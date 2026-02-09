"use client";
import { useArticle } from "@/src/hooks/useArticle";
import { NonUsersArticle } from "./NonUsersArticle";
import { useAuth } from "@/src/hooks/useAuth";
import { ArticlePagingNavigationButtons } from "./ArticlePagingNavigation";
import { useState } from "react";

export const NonUsersArticles = () => {
    const { user } = useAuth({ middleware: "auth" });
    const [page, setPage] = useState(1);
    const { paginatedNonUserArticles } = useArticle(user?.id, page);
    return (
        <div>
            {paginatedNonUserArticles?.data
                .map((article) =>
                    <div key={article.id} className="flex flex-wrap gap-2 mt-1">
                        {article.users?.map((articleUser) => {
                            const isMe = articleUser.id === user?.id;
                            if (isMe) return ""
                            else return (
                                <NonUsersArticle
                                    key={article.id}
                                    article={article}
                                    articleUser={articleUser}
                                />
                            );
                        })}
                    </div>
                )}
            <ArticlePagingNavigationButtons
                setPage={setPage}
                paginatedNonUserArticles={paginatedNonUserArticles}
            />
        </div>
    );
}
