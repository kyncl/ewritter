import { User } from "@/src/_lib/interfaces/User";
import { PaginatedResponse } from "@/src/hooks/useArticle";
import { redirect } from "next/navigation";

interface NonUsersArticlesProps {
    paginatedNonUserArticles: PaginatedResponse | undefined;
    user: User;
}

export const NonUsersArticles = (
    { paginatedNonUserArticles, user }: NonUsersArticlesProps) => {
    return (
        <>
            {
                paginatedNonUserArticles?.data
                    .map((article) =>
                        <div key={article.id} className="flex flex-wrap gap-2 mt-1">
                            {article.users?.map((u) => {
                                const isMe = u.id === user?.id;
                                if (isMe) return ""
                                else return (
                                    <div key={article.id} className="bg-background-dark 
                                        hover:brightness-150 
                                        rounded-xl m-2 
                                        w-full
                                        text-xl relative cursor-pointer p-5">
                                        <button
                                            onClick={() => { redirect(`/article/${article.id}`) }}
                                            className="flex flex-col cursor-pointer w-full text-left">
                                            <h3 className="text-3xl">Post: {article.header}</h3>
                                            <span className="text-foreground/50">
                                                Created: {article.created_at ? new Date(article.created_at).toLocaleString() : "N/A"}
                                            </span>
                                            <span
                                                key={u.id}
                                                className={`text-xs px-2 py-1 rounded-full border 
                                                    w-fit
                                                    bg-white/5 border-white/10 text-foreground/70"
                                                    `}
                                            >
                                                @{u.name}
                                            </span>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )
            }
        </>
    );
}
