import { NonUsersArticles } from "@/src/_Components/Articles/NonUsersArticles";
import { UsersArticles } from "@/src/_Components/Articles/UsersArticles";
import { CreateArticle } from "@/src/_Components/CreateArticle";

export default function Dashboard() {
    return (
        <main>
            <h1 className="font-bold text-3xl p-5">Dashboard</h1>
            <UsersArticles />
            <h2 className="text-2xl font-semibold text-center p-5 pb-0 ml-3">Articles that could interested you</h2>
            <div className="p-4">
                <NonUsersArticles />
            </div>
            <CreateArticle />
        </main>
    );
}
