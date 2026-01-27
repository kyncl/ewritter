import useSWR from 'swr';
import { AxiosError, isAxiosError } from 'axios';
import axios from "@/src/_lib/axios";
import { useState } from 'react';
import { LaravelErrorResponse, ValidationErrors } from './useAuth';

export interface Article {
    id: number;
    header: string;
    content: string;
    users?: Array<{ id: number; name: string }>;
    created_at?: string;
    updated_at?: string;
}
export interface PaginatedResponse {
    current_page: number;
    data: Article[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{ url: string | null; label: string; active: boolean }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface ArticlePayload {
    header: string;
    content: string;
    user_ids: number[];
}

export const useArticle = (userId: number | null = null, page: number = 1, articleId: number | null = null) => {
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [loading, setLoading] = useState<boolean>(false);

    const fetchUrl = userId ? `/articles/${userId}` : '/articles';
    const { data: articles, error, mutate } = useSWR<Article[] | undefined, AxiosError<LaravelErrorResponse>>(
        fetchUrl,
        async () => {
            try {
                const fechedArticles = await axios.get<Article[]>(fetchUrl);
                return fechedArticles.data;
            }
            catch (err: unknown) {
                if (isAxiosError(err)) {
                    if (err.response?.status !== 409) throw err;
                    return undefined;
                }
                throw err;
            }
        }
    );

    const { data: allArticles } = useSWR<Article[], AxiosError<LaravelErrorResponse>>(
        "/articles",
        async () => {
            try {
                const fechedArticles = await axios.get<Article[]>("/articles");
                return fechedArticles.data;
            }
            catch (err: unknown) {
                if (isAxiosError(err)) {
                    if (err.response?.status !== 409) throw err;
                    return [];
                }
                throw err;
            }
        }
    );

    const { data: paginatedArticles } = useSWR<PaginatedResponse, AxiosError>(
        `/articles?page=${page}`,
        async (url: string) => {
            const response = await axios.get<PaginatedResponse>(url);
            return response.data;
        }
    );

    const { data: specificArticle } = useSWR<Article, AxiosError>(
        articleId ? `/article/${articleId}` : null,
        async (url: string) => {
            const response = await axios.get<Article>(url);
            return response.data;
        }
    );

    const { data: paginatedNonUserArticles } = useSWR<PaginatedResponse, AxiosError>(
        userId ? `/articles/${userId}/non/user?page=${page}` : null,
        async (url: string) => {
            const response = await axios.get<PaginatedResponse>(url);
            return response.data;
        }
    );

    const csrf = () => axios.get('/sanctum/csrf-cookie');

    // 2. Create Article
    const createArticle = async (data: ArticlePayload) => {
        await csrf();
        setErrors({});
        setLoading(true);

        try {
            await axios.post('/articleCreate', data)
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
    const updateArticle = async (id: number, data: Partial<ArticlePayload>) => {
        await csrf();
        setErrors({});
        setLoading(true);

        try {
            await axios.put(`/articleUpdate/${id}`, data)
                .then(() => mutate()).catch((error: AxiosError<LaravelErrorResponse>) => {
                    if (isAxiosError(error) && error.response?.status === 422) {
                        setErrors(error.response.data.errors);
                        throw error;
                    }
                })
            return true;
        }
        finally {
            setLoading(false);
        }
    };

    // 4. Delete Article
    const deleteArticle = async (id: number) => {
        await csrf();
        setLoading(true);

        try {
            await axios.delete(`/article/${id}`)
                .then(() => mutate());
            return true;
        } catch (error: unknown) {
            console.error("Delete failed", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        articles,
        allArticles,
        paginatedArticles,
        specificArticle,
        paginatedNonUserArticles,
        isLoading: !error && !articles,
        isActionLoading: loading,
        errors,
        createArticle,
        updateArticle,
        deleteArticle,
        refreshArticles: mutate
    };
};
