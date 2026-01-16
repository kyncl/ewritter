'use client';

import useSWR from 'swr'
import axios, { AxiosError } from 'axios'
import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

interface User {
    id: number
    name: string
    email: string
    email_verified_at: string | null
    [key: string]: any
}

interface AuthActions {
    setErrors: (errors: any) => void
    setStatus: (status: string | null) => void
    [key: string]: any
}

interface UseAuthProps {
    middleware?: 'guest' | 'auth'
    redirectIfAuthenticated?: string
}

export const useAuth = ({ middleware, redirectIfAuthenticated }: UseAuthProps = {}) => {
    const router = useRouter()
    const params = useParams()

    const { data: user, error, mutate } = useSWR<User>('/api/user', () =>
        axios
            .get('/api/user')
            .then(res => res.data)
            .catch(error => {
                if (error.response?.status !== 409) throw error

                router.push('/verify-email')
            })
    )

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const register = async ({ setErrors, ...props }: Omit<AuthActions, 'setStatus'>) => {
        await csrf()

        setErrors([])

        axios
            .post('/register', props)
            .then(() => mutate())
            .catch((error: AxiosError<any>) => {
                if (error.response?.status !== 422) throw error

                setErrors(error.response?.data.errors)
            })
    }

    const login = async ({ setErrors, setStatus, ...props }: AuthActions) => {
        await csrf()

        setErrors([])
        setStatus(null)

        axios
            .post('/login', props)
            .then(() => mutate())
            .catch((error: AxiosError<any>) => {
                if (error.response?.status !== 422) throw error

                setErrors(error.response?.data.errors)
            })
    }

    const forgotPassword = async ({ setErrors, setStatus, email }: {
        setErrors: (errors: any) => void,
        setStatus: (status: string | null) => void,
        email: string
    }) => {
        await csrf()

        setErrors([])
        setStatus(null)

        axios
            .post('/forgot-password', { email })
            .then(response => setStatus(response.data.status))
            .catch((error: AxiosError<any>) => {
                if (error.response?.status !== 422) throw error

                setErrors(error.response?.data.errors)
            })
    }

    const resetPassword = async ({ setErrors, setStatus, ...props }: AuthActions) => {
        await csrf()

        setErrors([])
        setStatus(null)

        axios
            .post('/reset-password', { token: params?.token, ...props })
            .then(response =>
                router.push('/login?reset=' + btoa(response.data.status))
            )
            .catch((error: AxiosError<any>) => {
                if (error.response?.status !== 422) throw error

                setErrors(error.response?.data.errors)
            })
    }

    const resendEmailVerification = ({ setStatus }: { setStatus: (status: string) => void }) => {
        axios
            .post('/email/verification-notification')
            .then(response => setStatus(response.data.status))
    }

    const logout = async () => {
        if (!error) {
            await axios.post('/logout').then(() => mutate())
        }

        window.location.pathname = '/login'
    }

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user)
            router.push(redirectIfAuthenticated)

        if (middleware === 'auth' && user && !user?.email_verified_at)
            router.push('/verify-email')

        if (
            window.location.pathname === '/verify-email' &&
            user?.email_verified_at &&
            redirectIfAuthenticated
        )
            router.push(redirectIfAuthenticated)

        if (middleware === 'auth' && error) logout()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, error, middleware, redirectIfAuthenticated])

    return {
        user,
        register,
        login,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        logout,
    }
}
