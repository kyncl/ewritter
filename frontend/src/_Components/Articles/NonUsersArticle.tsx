import { Article } from "@/src/hooks/useArticle";
import { redirect } from "next/navigation";

interface NonUsersArticleProps {
    article: Article;
    articleUser: {
        id: number;
        name: string;
    };
}

export const NonUsersArticle = ({ article, articleUser }: NonUsersArticleProps) => {
    return (
        <div
            className="bg-background-dark 
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
                    key={articleUser.id}
                    className={`text-xs px-2 py-1 rounded-full border 
                    w-fit
                    bg-white/5 border-white/10 text-foreground/70"
                    `}
                >
                    @{articleUser.name}
                </span>
            </button>
        </div>
    );
}
