import { useState } from "react";
import useSWR from "swr";
import { Article, ArticlePayload } from "./useArticle";
import { AxiosError, isAxiosError } from "axios";
import axios from "../_lib/axios";
import { LaravelErrorResponse, ValidationErrors } from "./useAuth";

export const useSpecificArticle = (articleId: number | null = null) => {
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [loading, setLoading] = useState<boolean>(false);

    const { data: specificArticle, mutate } = useSWR<Article, AxiosError>(
        articleId ? `/api/article/${articleId}` : null,
        async (url: string) => {
            const response = await axios.get<Article>(url);
            return response.data;
        }
    );

    const csrf = () => axios.get('/sanctum/csrf-cookie');

    const createArticle = async (data: ArticlePayload) => {
        await csrf();
        setErrors({});
        setLoading(true);

        try {
            await axios.post('/api/articleCreate', data)
                .then(() => mutate()).catch((error: AxiosError<LaravelErrorResponse>) => {
                    if (error.response?.status === 422) {
                        setErrors(error.response.data.errors);
                    }
                    throw error;
                });
            return true;
        } finally {
            setLoading(false);
        }
    };

    // 3. Update Article
    const [generalError, setGeneralError] = useState<string | null>(null);
    const updateArticle = async (id: number, data: Partial<ArticlePayload>) => {
        await csrf();
        setErrors({});
        setGeneralError(null);
        setLoading(true);

        try {
            await axios.put(`/api/articleUpdate/${id}`, data);
            await mutate();
            return true;
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                const axiosError = error as AxiosError<LaravelErrorResponse>;
                const status = axiosError.response?.status;
                const responseData = axiosError.response?.data;
                if (status === 422 && responseData?.errors) {
                    setErrors(responseData.errors);
                } else if (status === 403) {
                    setGeneralError("You do not have permission to edit this article.");
                } else if (status === 401) {
                    setGeneralError("Session expired. Please log in again.");
                } else {
                    setGeneralError(responseData?.message || "An unexpected error occurred.");
                }
            }
            throw error;
        }
        finally {
            setLoading(false);
        };
    }

    // 4. Delete Article
    const deleteArticle = async (id: number) => {
        await csrf();
        setLoading(true);

        try {
            await axios.delete(`/api/article/${id}`)
                .then(() => mutate());
            return true;
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                const axiosError = error as AxiosError<LaravelErrorResponse>;
                setGeneralError(axiosError.response?.data.message || "Could not delete article.");
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        specificArticle,
        isActionLoading: loading,
        errors,
        createArticle,
        generalError,
        updateArticle,
        deleteArticle,
        refreshArticles: mutate
    };
}
