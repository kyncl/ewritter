import useSWR from 'swr';
import { AxiosError, isAxiosError } from 'axios';
import axios from "@/src/_lib/axios";
import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { User } from '../_lib/interfaces/User';

export type ValidationErrors = Record<string, string[]>;
export interface AuthProps {
    middleware?: 'auth' | 'guest';
    redirectIfAuthenticated?: string;
}
export interface AuthActionProps {
    setStatus?: (status: string | null) => void;
    [key: string]: unknown;
}
export interface LaravelErrorResponse {
    errors: ValidationErrors;
    message?: string;
}

// DISCLAIMER: this hook is from Laravel breeze repo (https://github.com/laravel/breeze-next)
// with AI improvements so it's type-safe (why can't you have already one in ts instead of js? :( )
export const useAuth = ({ middleware, redirectIfAuthenticated }: AuthProps = {}) => {
    const router = useRouter();
    const params = useParams();
    const [errors, setErrors] = useState<ValidationErrors>({});

    const { data: user, error, mutate, isLoading } = useSWR<User | undefined, AxiosError<LaravelErrorResponse>>(
        `/api/user`,
        async (): Promise<User | undefined> => {
            try {
                const res = await axios.get<User>('/api/user');
                return res.data;
            } catch (err: unknown) {
                if (isAxiosError(err)) {
                    if (err.response?.status !== 409) throw err;
                    router.push('/verify-email');
                    return undefined;
                }
                throw err;
            }
        }
    );

    const csrf = () => axios.get('/sanctum/csrf-cookie');

    const register = async ({ ...props }: AuthActionProps) => {
        await csrf();
        setErrors({});

        return await axios
            .post('/register', props)
            .then(() => mutate())
            .catch((error: AxiosError<LaravelErrorResponse>) => {
                if (error.response?.status !== 422) throw error;
                setErrors(error.response.data.errors);
            });
    };

    const login = async ({ setStatus, ...props }: AuthActionProps) => {
        await csrf();
        setErrors({});
        if (setStatus) setStatus(null);

        axios
            .post('/login', props)
            .then(() => mutate())
            .catch((error: AxiosError<LaravelErrorResponse>) => {
                if (error.response?.status !== 422) throw error;
                setErrors(error.response.data.errors);
            });
    };

    const forgotPassword = async ({ setStatus, email }: AuthActionProps) => {
        await csrf();
        setErrors({});
        if (setStatus) setStatus(null);

        axios
            .post<{ status: string }>('/forgot-password', { email })
            .then(response => setStatus?.(response.data.status))
            .catch((error: AxiosError<LaravelErrorResponse>) => {
                if (error.response?.status !== 422) throw error;
                setErrors(error.response.data.errors);
            });
    };

    const resetPassword = async ({ setStatus, ...props }: AuthActionProps) => {
        await csrf();
        setErrors({});
        if (setStatus) setStatus(null);

        axios
            .post<{ status: string }>('/reset-password', {
                token: params?.token as string,
                ...props
            })
            .then(response =>
                router.push('/login?reset=' + btoa(response.data.status)),
            )
            .catch((error: AxiosError<LaravelErrorResponse>) => {
                if (error.response?.status !== 422) throw error;
                setErrors(error.response.data.errors);
            });
    };

    const resendEmailVerification = ({ setStatus }: { setStatus: (s: string) => void }) => {
        axios
            .post<{ status: string }>('/email/verification-notification')
            .then(response => setStatus(response.data.status))
            .catch(err => console.error(err));
    };

    // Wrapped in useCallback so it can be a dependency in useEffect
    const logout = useCallback(async () => {
        if (!error) {
            await axios.post('/logout').then(() => mutate());
        }
        window.location.pathname = '/login';
    }, [error, mutate]);

    useEffect(() => {
        // If we are still fetching the user, sit tight.
        if (user === undefined && !error) return;

        if (middleware === 'guest' && user) {
            router.push(redirectIfAuthenticated || '/dashboard');
        }

        if (middleware === 'auth' && error) {
            // Only logout if the error is actually a 401 (Unauthenticated)
            if (error.response?.status === 401) {
                logout().catch(err => console.error('Logout failed:', err));
            }
        }
    }, [user, error, isLoading, router, logout, middleware, redirectIfAuthenticated]);

    return {
        errors,
        user,
        register,
        login,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        logout,
    };
};
