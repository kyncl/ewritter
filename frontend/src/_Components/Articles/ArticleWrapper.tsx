'use client';

import { useState } from "react";
import { JSONContent } from "novel";
import { ArticlePreview } from "@/src/_Components/Articles/ArticlePreview";
import { Article } from "@/src/hooks/useArticle";

export function ArticleWrapper({ initialArticle }: { initialArticle: Article | undefined }) {
    const [article, setArticle] = useState<JSONContent | string>(() => {
        if (typeof initialArticle === "undefined") return "";
        try {
            return typeof initialArticle.content === 'string'
                ? JSON.parse(initialArticle.content) as JSONContent
                : initialArticle.content;
        } catch {
            return initialArticle.content;
        }
    });
    return (
        <ArticlePreview
            specificArticle={initialArticle}
            article={article}
            setArticle={setArticle}
        />
    );
}
