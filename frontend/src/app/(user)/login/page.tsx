'use client';
import { StatefulButton } from "@/src/components/aceternity/stateful-button";
import { useAuth } from "@/src/hooks/useAuth";
import { redirect } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

export default function Login() {
    const { user, login, errors } = useAuth({ middleware: "guest" });

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleLogin = () => {
        login({
            password: loginData.password,
            email: loginData.email
        }).catch((err) => { console.log(err) })
    };
    useEffect(() => {
        if (user)
            redirect("/dashboard");
    }, [user]);

    return (
        <main className="min-h-[80vh] flex flex-col justify-center items-center px-4">
            <div className="w-full max-w-3xl bg-zinc-900/50 p-8 rounded-2xl border border-white/5 shadow-xl">
                <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
                <p className="text-gray-400 mb-8 text-sm">Please enter your details to log in.</p>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleLogin();
                    }}
                    className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium uppercase tracking-wider text-gray-500">Email</label>
                        <input
                            type="email"
                            name="email"
                            onChange={handleChange}
                            className="w-full bg-black border border-white/10 p-3 rounded-xl focus:ring-2 focus:ring-main focus:border-transparent outline-none transition-all"
                            placeholder="name@company.com"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium uppercase tracking-wider text-gray-500">Password</label>
                        <input
                            type="password"
                            name="password"
                            onChange={handleChange}
                            className="w-full bg-black border border-white/10 p-3 rounded-xl focus:ring-2 focus:ring-main focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <ul>
                        {Object.entries(errors).map(([field, messages]) => (
                            <li key={field} className="text-red-500 flex gap-2">
                                <strong>{field}:</strong>
                                <ul>
                                    {messages.map((message, index) => (
                                        <li key={`${field}-${index}`}>{message}</li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                    <StatefulButton
                        className="disabled:bg-main/70 
                        bg-main hover:ring-main
                        disabled:cursor-default disabled:ring-transparent"
                        onClick={handleLogin}>
                        Log in
                    </StatefulButton>
                </form>
            </div>
        </main >
    );
}
