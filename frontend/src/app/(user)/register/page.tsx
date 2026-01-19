"use client";

import { useAuth } from "@/src/hooks/useAuth";
import { redirect } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

export default function Register() {
    const { user, register } = useAuth({ middleware: "guest" });
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        console.log(errors);
    }, [errors]);

    useEffect(() => {
        if (user)
            redirect("/dashboard");
    }, [user]);

    const [registerData, setRegisterData] = useState({
        email: '',
        password: '',
        username: ''
    });
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRegisterData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <main className="min-h-[80vh] flex flex-col justify-center items-center px-4">
            <div className="w-full max-w-3xl bg-zinc-900/50 p-8 rounded-2xl border border-white/5 shadow-xl">
                <h1 className="text-3xl font-bold mb-2">Register</h1>
                <p className="text-gray-400 mb-8 text-sm">Please enter your details to register.</p>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium uppercase tracking-wider text-gray-500">Username</label>
                        <input
                            type="text"
                            name="username"
                            onChange={handleChange}
                            className="w-full bg-black border border-white/10 p-3 rounded-xl focus:ring-2 focus:ring-main focus:border-transparent outline-none transition-all"
                            placeholder="username"
                        />
                    </div>
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
                            onChange={handleChange}
                            type="password"
                            name="password"
                            value={registerData.password}
                            className="w-full bg-black border border-white/10 p-3 rounded-xl focus:ring-2 focus:ring-main focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        onClick={() => {
                            register({
                                setErrors,
                                name: registerData.username,
                                password: registerData.password,
                                password_confirmation: registerData.password,
                                email: registerData.email
                            }).catch((err) => { console.log(err) })
                        }
                        }
                        className="bg-main
                hover:bg-main/80
                duration-300
                    rounded-2xl p-2 mt-5">
                        Register
                    </button>
                </div>
            </div>
        </main >
    );
}
