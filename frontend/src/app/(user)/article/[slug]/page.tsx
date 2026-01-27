'use client';

import { ArticlePreview } from "@/src/_Components/Articles/ArticlePreview";
import { useArticle } from "@/src/hooks/useArticle";
import { redirect, useParams } from "next/navigation";
import { JSONContent } from "novel";
import { useEffect, useState } from "react";


export default function Page() {
    const params = useParams();
    const articleId = parseInt((params.slug ?? "")?.toString());
    const { specificArticle } = useArticle(null, 1, articleId);
    const [article, setArticle] = useState<JSONContent | string>(specificArticle?.content ?? "");
    useEffect(() => {
        if (specificArticle?.content) {
            try {
                const parsed = JSON.parse(specificArticle.content) as JSONContent;
                // eslint-disable-next-line
                setArticle(parsed);
            } catch (e) {
                console.error("Parse error", e);
            }
        }
    }, [specificArticle]);
    if (!isFinite(articleId)) return redirect("/");
    return (
        <div className="p-5">
            <ArticlePreview
                articleHeader={specificArticle?.header ?? ""}
                article={article}
                setArticle={setArticle}
            />
        </div>
    );
}
