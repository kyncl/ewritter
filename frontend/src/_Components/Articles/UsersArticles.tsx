import { Article } from "@/src/hooks/useArticle";
import { redirect } from "next/navigation";
import { FaTrash } from "react-icons/fa";

interface UsersArticlesProps {
    articles: Article[] | undefined;
    deleteArticle: (id: number) => Promise<boolean>;
}

export const UsersArticles = ({ articles, deleteArticle }: UsersArticlesProps) => {
    return (
        <details className="p-5">
            <summary className="select-none cursor-pointer p-5 ml-5 text-2xl">
                Your Articles
            </summary>
            {
                articles
                    ?.map((article) =>
                        <div key={article.id} className="
                                bg-background-dark 
                                hover:brightness-150 
                                rounded-xl m-2 
                                text-xl relative cursor-pointer p-5">
                            <button
                                onClick={() => { redirect(`/articleUpdate/${article.id}`) }}
                                className="flex flex-col cursor-pointer">
                                <h3 className="text-left pl-3 text-3xl">Post: {article.header}</h3>
                                <span className="text-foreground/50">Created: {new Date(article.created_at ?? "").toLocaleString()}</span>
                            </button>
                            <button
                                onClick={() => {
                                    deleteArticle(article.id).catch((err) => console.error(err));
                                }}
                                className="absolute top-5 right-5
                                        duration-300
                                        p-1 rounded-lg
                                        cursor-pointer
                                        hover:bg-red-600/20
                                        hover:text-red-500">
                                <FaTrash />
                            </button>
                        </div>
                    )
            }
        </details>
    )
};
