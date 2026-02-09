'use client';

import Link from "next/link";
import { useAuth } from "../hooks/useAuth";

/* Dynamic part of Home */
export function HomeClient() {
    const { user } = useAuth({ middleware: "guest" });
    return (
        <div className="flex flex-col sm:flex-row gap-4">
            {!user ? (
                <Link
                    href="/register"
                    className="mt-4 px-8 py-4 border-main border-solid border 
                    text-white rounded-full font-bold hover:scale-105 transition-transform"
                >
                    Start for free
                </Link>
            ) : ""}
        </div>
    );
}
