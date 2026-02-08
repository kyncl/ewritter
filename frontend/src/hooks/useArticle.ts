import useSWR from 'swr';
import { AxiosError, isAxiosError } from 'axios';
import axios from "@/src/_lib/axios";
import { LaravelErrorResponse } from './useAuth';

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

export const useArticle = (userId: number | null = null, page: number = 1) => {
    const fetchUrl = userId ? `/api/articles/${userId}` : '/api/articles';
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
    const { data: paginatedArticles } = useSWR<PaginatedResponse, AxiosError>(
        `/api/articles?page=${page}`,
        async (url: string) => {
            const response = await axios.get<PaginatedResponse>(url);
            return response.data;
        }
    );

    const { data: paginatedNonUserArticles } = useSWR<PaginatedResponse, AxiosError>(
        userId ? `/api/articles/${userId}/non/user?page=${page}` : null,
        async (url: string) => {
            const response = await axios.get<PaginatedResponse>(url);
            return response.data;
        }
    );
    return {
        articles,
        paginatedArticles,
        paginatedNonUserArticles,
        isLoading: !error && !articles,
        refreshArticles: mutate
    };
};
