"use client";

import { validateRegistration } from "@/src/_lib/validation";
import { StatefulButton } from "@/src/components/aceternity/stateful-button";
import { useAuth } from "@/src/hooks/useAuth";
import { redirect } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

export default function Register() {
    const { user, register, errors } = useAuth({ middleware: "guest" });
    useEffect(() => {
        if (user)
            redirect("/dashboard");
    }, [user]);

    const [registerData, setRegisterData] = useState({
        email: '',
        password: '',
        username: '',
        password_confirmation: ''
    });
    const { emailErrMsg, usernameErrMsg, passwordErrMsg } = validateRegistration(registerData);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRegisterData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleRegister = () => {
        register({
            name: registerData.username,
            password: registerData.password,
            password_confirmation: registerData.password_confirmation,
            email: registerData.email
        }).catch((err) => { console.warn(err) })
    };

    return (
        <main className="min-h-[80vh] flex flex-col justify-center items-center px-4">
            <div className="w-full max-w-3xl bg-zinc-900/50 p-8 rounded-2xl border border-white/5 shadow-xl">
                <h1 className="text-3xl font-bold mb-2">Register</h1>
                <p className="text-gray-400 mb-8 text-sm">Please enter your details to register.</p>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                    className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium uppercase tracking-wider text-gray-500">Username</label>
                        <input
                            type="text"
                            name="username"
                            onChange={handleChange}
                            className="w-full bg-black border border-white/10 p-3 rounded-xl focus:ring-2 focus:ring-main focus:border-transparent outline-none transition-all"
                            placeholder="username"
                        />
                        <span className="text-red-500">{usernameErrMsg}</span>
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
                        <span className="text-red-500">{emailErrMsg}</span>
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
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium uppercase tracking-wider text-gray-500">Password Confirmation</label>
                        <input
                            onChange={handleChange}
                            type="password"
                            name="password_confirmation"
                            value={registerData.password_confirmation}
                            className="w-full bg-black border border-white/10 p-3 rounded-xl focus:ring-2 focus:ring-main focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                        />
                        <span className="text-red-500">{passwordErrMsg}</span>
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
                        disabled={passwordErrMsg !== null
                            || emailErrMsg !== null
                            || usernameErrMsg !== null}
                        className="disabled:bg-main/70 
                        bg-main hover:ring-main
                        disabled:cursor-default disabled:ring-transparent"
                        onClick={handleRegister}>
                        Register
                    </StatefulButton>
                </form>
            </div>
        </main >
    );
}
