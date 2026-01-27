'use client';
import { useArticle } from "@/src/hooks/useArticle";
import { useAuth } from "@/src/hooks/useAuth";
import { redirect, useParams } from "next/navigation";
import { JSONContent } from "novel";
import { useEffect, useState } from "react";
import { ArticleEditor } from "@/src/_Components/Articles/ArticleEditor";
import { StatefulButton } from "@/src/components/aceternity/stateful-button";

export default function Page() {
    const params = useParams();
    const articleId = parseInt((params.slug ?? "")?.toString());
    const { specificArticle, updateArticle, isActionLoading } = useArticle(null, 1, articleId);
    const [articleHeader, setArticleHeader] = useState(specificArticle?.header ?? "");
    const [article, setArticle] = useState<JSONContent | string>(specificArticle?.content ?? "");
    const { user } = useAuth({ middleware: "auth" });
    if (typeof user === "undefined") redirect("/");
    const [isReady, setIsReady] = useState(false);

    const articleUpdateProcess = () => {
        updateArticle(
            articleId,
            {
                header: articleHeader,
                content: JSON.stringify(article),
                user_ids: [user.id],
            }).then(() => {
                localStorage.setItem("lastWorkedOnArticle", "");
                window.location.reload();
            }).catch((e) => console.error(e));
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
