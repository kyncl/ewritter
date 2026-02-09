"use client"
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import { CreateArticle } from "./CreateArticle";

export const HomeWelcomingMsg = () => {
    const { user } = useAuth({ middleware: "guest" });
    return (
        <div>
            {user ? (
                <div className="flex flex-col items-center gap-6 pb-4">
                    <p className="text-xl">
                        Welcome back, <span className="text-main font-bold">{user.name}</span>
                    </p>
                    <Link
                        href="/dashboard"
                        className="px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-all"
                    >
                        Go to Dashboard
                    </Link>
                    <CreateArticle />
                </div>

            ) : ""}
        </div>
    );
}
