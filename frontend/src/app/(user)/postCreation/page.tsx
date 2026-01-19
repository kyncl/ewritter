'use client';

import { useSecureHTML } from "@/src/hooks/useSecureHTML";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import "@/src/app/preview.css";

import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js/lib/common';
import 'highlight.js/styles/atom-one-dark.css';
import Editor from "@/src/components/editor/editor";

const marked = new Marked(
    markedHighlight({
        emptyLangClass: 'hljs',
        langPrefix: 'hljs language-',
        highlight(code, lang) {
            const gottenLanguage = hljs.getLanguage(lang);
            const language = gottenLanguage ? lang : 'plaintext';
            const highlighting = hljs.highlight(code, { language });
            return highlighting.value;
        }
    })
);

export default function PostCreation() {
    const [article, setArticle] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("lastWorkedOnArticle") ?? "";
        }
        return "";
    });
    const [articleHeader, setArticleHeader] = useState("");
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        localStorage.setItem("lastWorkedOnArticle", article);
    }, [article]);

    return (
        <main className="max-w-5xl mx-auto px-6 py-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">Create Post</h1>
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
                    <EditorD
                        article={article}
                        articleHeader={articleHeader}
                        setArticle={setArticle}
                        setArticleHeader={setArticleHeader}
                    />
                ) : (
                    <Preview
                        article={article}
                        articleHeader={articleHeader}
                    />
                )}
            </section>
            <div className="flex justify-end fixed right-7 bottom-7">
                <button className="bg-main text-white px-8 py-3 rounded-xl font-bold hover:brightness-110 transition-all shadow-lg shadow-main/20">
                    Publish Post
                </button>
            </div>
        </main>
    );
}

interface EditorProps {
    articleHeader: string;
    article: string;
    setArticleHeader: Dispatch<SetStateAction<string>>;
    setArticle: Dispatch<SetStateAction<string>>;
}

export const defaultValue = {
    type: 'doc',
    content: [
        {
            type: 'paragraph',
            content: []
        }
    ]
}

const EditorD = ({ articleHeader, article, setArticleHeader, setArticle }: EditorProps) => {
    const [content, setContent] = useState<string>('')
    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-main">Title</label>
                <input
                    type="text"
                    value={articleHeader}
                    placeholder="An interesting title..."
                    className="w-full bg-transparent text-3xl font-bold outline-none border-l-2 border-white/10 focus:border-main pl-4 transition-colors placeholder:text-zinc-700"
                    onChange={(e) => setArticleHeader(e.target.value)}
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-main">Content</label>
                <Editor initialValue={defaultValue} onChange={setContent} />
            </div>
        </div>
    );
}

const Preview = ({ articleHeader, article }: { articleHeader: string, article: string }) => {
    const [secureArticle, setSecureArticle] = useState("");

    useEffect(() => {
        const proc = async () => {
            const html = await marked.parse(article);
            setSecureArticle(html);
        }
        proc().catch((err) => { console.error(err) });
    }, [article]);
    const secureHTML = useSecureHTML(secureArticle);
    return (
        <div className="prose prose-invert max-w-none animate-in slide-in-from-bottom-2 duration-300">
            <h1 className="text-5xl font-extrabold mb-8">{articleHeader || "Untitled Post"}</h1>
            <div className="text-gray-300 text-lg leading-loose whitespace-pre-wrap">
                {
                    article !== "" ? <div className={`preview-post`} dangerouslySetInnerHTML={secureHTML} /> :
                        <p className="text-foreground/50">Nothing to preview yet...</p>}
            </div>
        </div>
    );
}
