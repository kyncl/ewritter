'use client';
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import { CreatePost } from "../_Components/CreatePost";

export default function Home() {
    const { user } = useAuth({ middleware: "guest" });

    return (
        <main className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-6 bg-clip-text">
                Ewritter
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10">
                Platform that connects people who wants to bitch about things
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                    <div className="flex flex-col items-center gap-6">
                        <p className="text-xl">Welcome back, <span className="text-main font-bold">{user.name}</span></p>
                        <Link
                            href="/dashboard"
                            className="px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-all"
                        >
                            Go to Dashboard
                        </Link>
                        <CreatePost />
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
        </main>
    )
}
