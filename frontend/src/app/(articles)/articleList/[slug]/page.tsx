import { ArticlePagingNavigationLinks } from "@/src/_Components/Articles/ArticlePagingNavigation";
import { NonUsersArticle } from "@/src/_Components/Articles/NonUsersArticle";
import { PaginatedResponse } from "@/src/hooks/useArticle";

export async function getArticles(page: number) {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const url = `${baseUrl}/api/articles?page=${page}`;
    console.log(`[Server Fetch] Attempting to reach: ${url}`);
    try {
        const res = await fetch(url, {
            cache: 'no-store',
            signal: AbortSignal.timeout(5000),
        });

        if (!res.ok) {
            const errorBody = await res.text();
            console.error(`[Server Fetch] Response Body snippet: ${errorBody.substring(0, 100)}`);
            return null;
        }
        const articles = await res.json() as PaginatedResponse;
        return articles;
    } catch (error: unknown) {
        console.error("[Server Fetch] Network Error:");
        console.error(error);
        return null;
    }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const page = parseInt(resolvedParams.slug) ?? 1;
    const articles = await getArticles(page);
    console.log(articles);
    if (!articles) return (<main>No articles :(</main>)

    return (
        <main>
            {articles?.data.map((article) =>
                <div key={article.id} className="flex flex-wrap gap-2 mt-1">
                    {article.users?.map((articleUser) =>
                        <NonUsersArticle
                            key={article.id}
                            article={article}
                            articleUser={articleUser}
                        />
                    )}
                </div>
            )}
            <ArticlePagingNavigationLinks
                urlBeforePage="/articleList/"
                currentPage={page}
                paginatedNonUserArticles={articles}
            />
        </main>
    );
}
