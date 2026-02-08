import { DEFAULT_ARTICLE, EMPTY_ARTICLE } from "@/src/_lib/constants";
import Editor from "@/src/components/editor/editor";
import { JSONContent } from "novel";
import { Dispatch, SetStateAction } from "react";

interface ArticleEditorProps {
    articleHeader: string;
    setArticleHeader: Dispatch<SetStateAction<string>>;
    article: string | JSONContent;
    setArticle: Dispatch<SetStateAction<string | JSONContent>>;
}


export const ArticleEditor = ({ articleHeader, article, setArticleHeader, setArticle }: ArticleEditorProps) => {
    let articleSave: JSONContent = DEFAULT_ARTICLE;
    try {
        if (typeof article === "string")
            articleSave = JSON.parse(article) as JSONContent
        else
            articleSave = article;
    }
    catch {
        console.warn("Couldn't get savedArticle");
    };
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
                {articleSave !== EMPTY_ARTICLE ? (
                    <Editor key="loaded-editor" initialValue={articleSave} onChange={setArticle} />
                ) : (
                    <Editor key="empty-editor" initialValue={EMPTY_ARTICLE} onChange={setArticle} />
                )}
            </div>
        </div>
    );
}
