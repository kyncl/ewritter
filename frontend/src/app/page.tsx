'use client';
import Link from "next/link";

export default function Home() {
    return (
        <main className="flex flex-col justify-center items-center">
            <h1 className="text-5xl font-semibold">Header</h1>
            <Link className="block text-2xl rounded-lg p-1 
            bg-main hover:bg-main/80
            duration-300 hover:duration-200
            " href="login/">Login</Link>
        </main>
    )
}
