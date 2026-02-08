import { EMPTY_ARTICLE } from "@/src/_lib/constants";
import { copyLink } from "@/src/_lib/utils";
import Editor from "@/src/components/editor/editor";
import { Article } from "@/src/hooks/useArticle";
import { JSONContent } from "novel";
import { Dispatch, SetStateAction } from "react";
import { FaLink } from "react-icons/fa";

/* const marked = new Marked(
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
); */

interface ArticlePreviwProps {
    specificArticle?: Article;
    articleHeader?: string;
    article: string | JSONContent;
    setArticle: Dispatch<SetStateAction<string | JSONContent>>;
}

export const ArticlePreview = ({ specificArticle, article, setArticle, articleHeader }: ArticlePreviwProps) => {
    let articleSave: JSONContent = EMPTY_ARTICLE;
    try {
        if (typeof article === "string") {
            // SAFE: I don't care why double stringification is a thing?
            // eslint-disable-next-line
            let parsed = JSON.parse(article);
            if (typeof parsed === "string") {
                // eslint-disable-next-line
                parsed = JSON.parse(parsed);
            }
            articleSave = parsed as JSONContent;
        } else {
            articleSave = article;
        }
    } catch {
        console.warn("Couldn't get savedArticle");
    }
    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        return new Intl.DateTimeFormat(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short'
        }).format(new Date(dateString));
    };

    return (
        <div className="prose prose-invert max-w-none animate-in slide-in-from-bottom-2 duration-300">
            <h1 className="text-5xl font-extrabold mb-8">{articleHeader || specificArticle?.header || "Untitled Post"}</h1>
            <div className="flex flex-col gap-2 text-sm text-foreground/60 mb-8 not-prose">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">Authors:</span>
                    <div className="flex gap-1">
                        {specificArticle?.users?.map((user, idx) => (
                            <span key={user.id}>
                                {user.name}{idx < (specificArticle.users?.length ?? 0) - 1 ? ',' : ''}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-1">
                    <span>
                        <span className="font-semibold text-foreground">Created:</span> {formatDate(specificArticle?.created_at)}
                    </span>
                    <span>
                        <span className="font-semibold text-foreground">Last update:</span> {formatDate(specificArticle?.updated_at)}
                    </span>
                </div>

                <button
                    onClick={() => copyLink()}
                    className="flex items-center gap-2 w-fit mt-2 hover:text-main duration-200 text-xs uppercase tracking-wider font-bold"
                >
                    <FaLink /> Copy Article Link
                </button>
            </div>
            <div className="text-gray-300 text-lg leading-loose whitespace-pre-wrap border-t border-t-foreground/80">
                {
                    article !== "" ? <Editor initialValue={articleSave} onChange={setArticle} preview={true} /> :
                        <p className="text-foreground/50">Nothing to preview yet...</p>}
            </div>
        </div>
    );
}
