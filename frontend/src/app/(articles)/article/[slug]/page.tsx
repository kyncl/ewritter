import { ArticleWrapper } from "@/src/_Components/Articles/ArticleWrapper";
import { Article } from "@/src/hooks/useArticle";
import { JSONContent } from "novel";

export function getPlainText(node: JSONContent | undefined): string {
    if (node?.type === 'text' && node.text) {
        return node.text;
    }
    if (node?.content && Array.isArray(node.content)) {
        return node.content.map(child => getPlainText(child)).join(' ');
    }
    return '';
}

async function getArticle(id: number) {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const url = `${baseUrl}/api/article/${id}`;
    console.log(`[Server Fetch] Attempting to reach: ${url}`);
    try {
        const res = await fetch(url, {
            cache: 'no-store',
            signal: AbortSignal.timeout(5000),
        });

        if (!res.ok) {
            console.error(`[Server Fetch] Status: ${res.status} for ID: ${id}`);
            const errorBody = await res.text();
            console.error(`[Server Fetch] Response Body snippet: ${errorBody.substring(0, 100)}`);
            return null;
        }
        const article = await res.json() as Article;
        const content = JSON.parse(article.content) as JSONContent;
        return {
            article,
            content
        };
    } catch (error: unknown) {
        console.error("[Server Fetch] Network Error:");
        console.error(error);
        return null;
    }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const articleId = parseInt(resolvedParams.slug);
    if (isNaN(articleId)) return <div>Invalid ID</div>;
    const articleData = await getArticle(articleId);
    const articleEditorData = articleData?.article;
    const preContent = articleData?.content;
    if (!articleData) return <div>Article not found</div>;
    return (
        <div className="p-5">
            <article className="sr-only">
                <h1>{preContent?.header}</h1>
                <p>{getPlainText(preContent)}</p>
            </article>

            <ArticleWrapper initialArticle={articleEditorData} />
        </div>
    );
}
