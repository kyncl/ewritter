'use client';
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";

export const NavBar = () => {
    const { user, logout } = useAuth({ middleware: "guest" });

    return (
        <nav className="flex justify-between items-center px-8 py-4 border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
            <h2 className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
                <Link href="/">EWRITTER</Link>
            </h2>
            <div className="flex items-center gap-6">
                {user ? (
                    <div className="flex items-center gap-4">
                        <Link
                            className="
                            hover:text-gray-200 
                            text-gray-400
                            duration-300"
                            href="/dashboard">
                            <span className="text-sm">
                                Hi, {user.name}
                            </span>
                        </Link>
                        <button
                            onClick={() => { logout().catch(console.error) }}
                            className="text-sm font-medium hover:text-red-400 transition-colors"
                        >
                            Log out
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link className="text-sm font-medium hover:text-main transition-colors" href="/login">
                            Login
                        </Link>
                        <Link
                            className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition-all"
                            href="/register"
                        >
                            Get Started
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};
