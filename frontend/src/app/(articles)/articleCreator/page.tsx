'use client';

import { useEffect, useState } from "react";
import "@/src/style/preview.css";
import 'highlight.js/styles/atom-one-dark.css';
import { DEFAULT_ARTICLE, EMPTY_ARTICLE } from "@/src/_lib/constants";
import { ArticlePreview } from "@/src/_Components/Articles/ArticlePreview";
import { ArticleEditor } from "@/src/_Components/Articles/ArticleEditor";
import { JSONContent } from "novel";
import { StatefulButton } from "@/src/components/aceternity/stateful-button";
import { redirect, useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
import { useSpecificArticle } from "@/src/hooks/useSpecificArticle";

export default function ArticleCreator() {
    const { user } = useAuth({ middleware: "auth" });
    if (user === null)
        redirect("/login");
    const router = useRouter();
    const { createArticle } = useSpecificArticle();
    const [article, setArticle] = useState<string | JSONContent>(() => {
        // server render doesn't have window
        if (typeof window !== "undefined") {
            return localStorage.getItem("lastWorkedOnArticle") ?? "";
        }
        return "";
    });
    const [articleHeader, setArticleHeader] = useState("");
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        if (typeof article === "string")
            localStorage.setItem("lastWorkedOnArticle", article);
        else
            localStorage.setItem("lastWorkedOnArticle", JSON.stringify(article));
    }, [article]);

    const handleSubmit = () => {
        const stringedDefVal = JSON.stringify(DEFAULT_ARTICLE);
        let articleSave: JSONContent = EMPTY_ARTICLE;
        try {
            if (typeof article === "string")
                articleSave = JSON.parse(article) as JSONContent
            else
                articleSave = article;
        }
        catch {
            console.warn("Couldn't get savedArticle");
        };
        const stringedArticle = JSON.stringify(articleSave);
        if (stringedArticle === stringedDefVal)
            alert("Article can't be empty. Be creative!");
        else if (articleHeader === "")
            alert("Article needs header.");
        else {
            if (!user) return;
            const articleCreationProcess = async () => {
                await createArticle({
                    header: articleHeader,
                    content: JSON.stringify(article),
                    user_ids: [user.id],
                }).then(() => {
                    localStorage.setItem("lastWorkedOnArticle", "");
                })
                router.push("/dashboard");
            }
            articleCreationProcess().catch((err) => console.error(err));
        }
    };

    return (
        <main className="max-w-5xl mx-auto px-6 py-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">Create Article</h1>
                    <p className="text-gray-400 mt-2">Share your thoughts with the world.</p>
                </div>
                <div className="flex bg-zinc-900 p-1 rounded-xl border border-white/5">
                    <button
                        onClick={() => setShowPreview(false)}
                        className={`px-6 py-2 rounded-lg text-sm 
                            font-medium transition-all w-1/2
                            ${!showPreview ? 'bg-zinc-800 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Editor
                    </button>
                    <button
                        onClick={() => setShowPreview(true)}
                        className={`px-6 py-2 rounded-lg text-sm 
                        font-medium transition-all w-1/2 
                        ${showPreview ? 'bg-zinc-800 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Preview
                    </button>
                </div>
            </header>

            <section>
                {!showPreview ? (
                    <ArticleEditor
                        article={article}
                        articleHeader={articleHeader}
                        setArticle={setArticle}
                        setArticleHeader={setArticleHeader}
                    />
                ) : (
                    <ArticlePreview
                        article={article}
                        setArticle={setArticle}
                        articleHeader={articleHeader}
                    />
                )}
            </section>
            <div className="flex justify-end fixed right-7 bottom-7">
                <StatefulButton
                    onClick={handleSubmit}
                    className="bg-main text-white 
                        px-8 py-3 rounded-xl 
                        cursor-pointer
                        font-bold hover:brightness-130 
                        transition-all shadow-lg 
                        hover:ring-main
                        border-transparent
                        ring-transparent
                        shadow-main/20">
                    Publish Article
                </StatefulButton>
            </div>
        </main>
    );
}
