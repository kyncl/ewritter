'use client';
import { ArticlePagingNavigation } from "@/src/_Components/Articles/ArticlePagingNavigation";
import { NonUsersArticles } from "@/src/_Components/Articles/NonUsersArticles";
import { UsersArticles } from "@/src/_Components/Articles/UsersArticles";
import { CreateArticle } from "@/src/_Components/CreateArticle";
import { useArticle } from "@/src/hooks/useArticle";
import { useAuth } from "@/src/hooks/useAuth";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function Dashboard() {
    const { user } = useAuth({ middleware: "auth" });
    if (user === null)
        redirect("/login")
    const [page, setPage] = useState(1);
    const { articles, paginatedNonUserArticles } = useArticle(user?.id, page);

    return (
        <main>
            <h1 className="font-bold text-3xl p-5">Dashboard</h1>
            {articles?.length ?? 0 > 0 ?
                <UsersArticles userId={user?.id} />
                : ""}
            <h2 className="text-2xl font-semibold text-center p-5 pb-0 ml-3">Articles that could interested you</h2>
            <div className="p-4">
                <NonUsersArticles
                    user={user}
                    paginatedNonUserArticles={paginatedNonUserArticles}
                />

                <ArticlePagingNavigation
                    setPage={setPage}
                    paginatedNonUserArticles={paginatedNonUserArticles}
                />
            </div>
            <CreateArticle />
        </main>
    );
}
