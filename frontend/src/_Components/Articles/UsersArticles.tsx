"use client";
import { copyLink } from "@/src/_lib/utils";
import { useArticle } from "@/src/hooks/useArticle";
import { useSpecificArticle } from "@/src/hooks/useSpecificArticle";
import { redirect } from "next/navigation";
import { useState } from "react";
import { FaChevronDown, FaEdit, FaShare, FaTrash } from "react-icons/fa";

interface UsersArticlesProps {
    userId: number | undefined
}

export const UsersArticles = ({ userId }: UsersArticlesProps) => {
    const { articles, refreshArticles } = useArticle(userId);
    const { deleteArticle } = useSpecificArticle();
    const [copySuccess, setCopySuccess] = useState(false);

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Unknown";
        return new Intl.DateTimeFormat(undefined, {
            dateStyle: 'medium',
        }).format(new Date(dateString));
    };

    const CopyProcess = (articleId: number) => {
        setCopySuccess(false);
        const shareUrl = `${window.location.origin}/article/${articleId}`;
        copyLink(shareUrl, false);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 3000);
    }


    return (
        <div>
            {copySuccess && (
                <div className="fixed w-fit right-5 top-20 bg-background-dark border border-green-400 text-green-700 px-4 py-3 rounded mb-4 animate-in fade-in slide-in-from-top-2">
                    <strong className="font-bold">Success! </strong>
                    <span className="inline">Link copied!</span>
                </div>
            )}
            <details className="p-5">
                <summary className="flex items-center justify-between select-none cursor-pointer p-4 list-none">
                    <div className="flex items-center gap-4">
                        <span className="text-3xl font-bold tracking-tight">Your Articles</span>
                        <span className="bg-main/20 text-main text-sm py-1 px-3 rounded-full">
                            {articles?.length || 0}
                        </span>
                    </div>
                    <FaChevronDown className="transition-transform duration-300 group-open:rotate-180 text-foreground/50" />
                </summary>
                <div className="flex flex-col gap-4 mt-6">
                    {articles?.map((article) => (
                        <div
                            key={article.id}
                            className="group/card bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 transition-all duration-300 relative overflow-hidden"
                        >
                            <div className="flex flex-col gap-2 relative z-10">
                                <h3 className="text-2xl font-bold truncate pr-10">
                                    {article.header}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-foreground/50">
                                    <span>Created {formatDate(article.created_at)}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 mt-6 relative z-10">
                                <button
                                    onClick={() => redirect(`/articleUpdate/${article.id}`)}
                                    className="cursor-pointer flex-1 bg-white text-black py-2 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                                >
                                    <FaEdit className="text-sm" /> Edit
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        CopyProcess(article.id);
                                    }}
                                    className="cursor-pointer w-12 h-10 flex items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all"
                                    title="Share article"
                                >
                                    <FaShare />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!confirm("Are you sure you want to delete this?")) return;
                                        const process = async () => {
                                            try {
                                                await deleteArticle(article.id);
                                                await refreshArticles();
                                            } catch (err) {
                                                console.error(err);
                                            }
                                        }
                                        process().catch((err) => console.error(err));;
                                    }}
                                    className="cursor-pointer w-12 h-10 flex items-center justify-center rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                    title="Delete Article"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </details>
        </div>
    )
};
