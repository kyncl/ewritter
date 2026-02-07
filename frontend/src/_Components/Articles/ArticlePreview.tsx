import { EMPTY_ARTICLE } from "@/src/_lib/constants";
import Editor from "@/src/components/editor/editor";
import { JSONContent } from "novel";
import { Dispatch, SetStateAction } from "react";

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
    articleHeader: string;
    article: string | JSONContent;
    setArticle: Dispatch<SetStateAction<string | JSONContent>>;
}

export const ArticlePreview = ({ articleHeader, article, setArticle }: ArticlePreviwProps) => {
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

    return (
        <div className="prose prose-invert max-w-none animate-in slide-in-from-bottom-2 duration-300">
            <h1 className="text-5xl font-extrabold mb-8 border-b border-b-foreground/80">{articleHeader || "Untitled Post"}</h1>
            <div className="text-gray-300 text-lg leading-loose whitespace-pre-wrap">
                {
                    article !== "" ? <Editor initialValue={articleSave} onChange={setArticle} preview={true} /> :
                        <p className="text-foreground/50">Nothing to preview yet...</p>}
            </div>
        </div>
    );
}
