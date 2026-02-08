import { HomeCTA } from "../_Components/HomeCTA";

export default function Home() {
    return (
        <main className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-6 bg-clip-text">
                Ewritter
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10">
                Platform that connects people who want to bitch about things.
            </p>
            <HomeCTA />
        </main>
    );
}
