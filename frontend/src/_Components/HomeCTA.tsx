'use client';

import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import { CreateArticle } from "./CreateArticle";

/* Dynamic part of Home */
export function HomeCTA() {
    const { user } = useAuth({ middleware: "guest" });
    if (user === undefined) return <div className="h-16" />;
    return (
        <div className="flex flex-col sm:flex-row gap-4">
            {user ? (
                <div className="flex flex-col items-center gap-6">
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
            ) : (
                <Link
                    href="/register"
                    className="px-8 py-4 bg-main text-white rounded-full font-bold hover:scale-105 transition-transform"
                >
                    Start for free
                </Link>
            )}
        </div>
    );
}
