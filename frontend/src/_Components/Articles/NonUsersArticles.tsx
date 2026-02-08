import { User } from "@/src/_lib/interfaces/User";
import { PaginatedResponse } from "@/src/hooks/useArticle";
import { NonUsersArticle } from "./NonUsersArticle";

interface NonUsersArticlesProps {
    paginatedNonUserArticles: PaginatedResponse | undefined;
    user: User | undefined;
}

export const NonUsersArticles = (
    { paginatedNonUserArticles, user }: NonUsersArticlesProps) => {
    return (
        paginatedNonUserArticles?.data
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
            )
    );
}
