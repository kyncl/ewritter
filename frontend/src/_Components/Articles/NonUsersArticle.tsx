import { Article } from "@/src/hooks/useArticle";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface NonUsersArticleProps {
    article: Article;
    articleUser: {
        id: number;
        name: string;
    };
}

export const NonUsersArticle = ({ article, articleUser }: NonUsersArticleProps) => {

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Unknown";
        return new Intl.DateTimeFormat(undefined, {
            dateStyle: 'medium',
        }).format(new Date(dateString));
    };

    return (
        <div className="relative w-full overflow-hidden rounded-2xl bg-background-dark/35 border border-white/10 p-px transition-all duration-300 hover:scale-[1.01]">
            <Link
                href={`/article/${article.id}`}
                className="relative flex h-full flex-col justify-between rounded-xl p-6 backdrop-blur-xl"
            >
                <div className="space-y-4">
                    <h3 className="text-3xl font-bold leading-tight text-white">
                        {article.header}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-foreground/50">
                        <span>Published {formatDate(article.created_at)}</span>
                    </div>
                </div>
                <div className="mt-8 flex items-center justify-between">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-foreground/80 transition-colors">
                        @{articleUser.name}
                    </span>
                    <span className="flex flex-row items-center justify-center gap-1 text-sm font-medium text-foreground hover:underline hover:text-white transition-colors">
                        Read Article
                        <ArrowRight />
                    </span>
                </div>
            </Link>
        </div>);
}
