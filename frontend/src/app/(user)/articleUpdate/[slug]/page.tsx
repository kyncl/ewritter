'use client';
import { useAuth } from "@/src/hooks/useAuth";
import { redirect, useParams } from "next/navigation";
import { JSONContent } from "novel";
import { useEffect, useState } from "react";
import { ArticleEditor } from "@/src/_Components/Articles/ArticleEditor";
import { StatefulButton } from "@/src/components/aceternity/stateful-button";
import { useSpecificArticle } from "@/src/hooks/useSpecificArticle";

export default function Page() {
    const params = useParams();
    const articleId = parseInt((params.slug ?? "")?.toString());
    const { specificArticle, updateArticle, isActionLoading, errors, generalError } = useSpecificArticle(isFinite(articleId) ? articleId : null);
    const [articleHeader, setArticleHeader] = useState(specificArticle?.header ?? "");
    const [article, setArticle] = useState<JSONContent | string>(specificArticle?.content ?? "");
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const { user } = useAuth({ middleware: "auth" });
    if (user === null)
        redirect("/login");
    const [isReady, setIsReady] = useState(false);

    const articleUpdateProcess = () => {
        if (typeof user === "undefined") return;
        setUpdateSuccess(false);
        updateArticle(articleId, {
            header: articleHeader,
            content: JSON.stringify(article),
            user_ids: [user.id],
        })
            .then((success) => {
                if (success) {
                    setUpdateSuccess(true);
                    localStorage.setItem("lastWorkedOnArticle", "");
                    setTimeout(() => setUpdateSuccess(false), 3000);
                }
            })
            .catch(() => {
            });
    }

    useEffect(() => {
        if (specificArticle?.content) {
            // eslint-disable-next-line
            setArticleHeader(specificArticle.header);
            try {
                const parsed = JSON.parse(specificArticle.content) as JSONContent;
                setArticle(parsed);
                setIsReady(true);
            } catch (e) {
                console.error("Parse error", e);
            }
        }
    }, [specificArticle]);
    if (!isFinite(articleId)) return redirect("/");
    return (
        <div className="p-5">
            <div className="fixed top-20 right-5">
                {updateSuccess && (
                    <div className="bg-background-dark border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 animate-in fade-in slide-in-from-top-2">
                        <strong className="font-bold">Success! </strong>
                        <span className="inline">Article updated successfully.</span>
                    </div>
                )}
                {generalError && (
                    <div className="bg-background-dark border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                        <strong className="font-bold">Error: </strong>
                        <span className="inline">{generalError}</span>
                    </div>
                )}
                {Object.entries(errors).map(([field, messages]) => (
                    <li key={field} className="text-red-500 flex gap-2">
                        <strong>{field}:</strong>
                        <ul>
                            {messages.map((message, index) => (
                                <li key={`${field}-${index}`}>{message}</li>
                            ))}
                        </ul>
                    </li>
                ))}
            </div>
            {isReady && !isActionLoading ? (
                <ArticleEditor
                    key={articleId}
                    articleHeader={articleHeader}
                    setArticleHeader={setArticleHeader}
                    article={article}
                    setArticle={setArticle}
                />
            ) : (
                <div className="flex items-center justify-center h-64">
                    <p className="animate-pulse text-zinc-500">Preparing editor...</p>
                </div>
            )}
            <StatefulButton
                onClick={articleUpdateProcess}
                className="fixed bottom-5 right-5 bg-main hover:ring-main">
                Update article
            </StatefulButton>
        </div>
    );
}
