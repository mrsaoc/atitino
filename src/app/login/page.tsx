"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Clapperboard, Loader2 } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                username: username.toLowerCase(), // Garante consistência
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Credenciais inválidas. Tente novamente.");
                setLoading(false);
            } else {
                // Sucesso: Redireciona para a home
                router.push("/");
                router.refresh();
            }
        } catch (err) {
            setError("Ocorreu um erro inesperado.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 text-zinc-100">
            <div className="w-full max-w-md space-y-8">
                {/* Cabeçalho da Marca */}
                <div className="flex flex-col items-center justify-center text-center space-y-2">
                    <div className="h-16 w-16 bg-white text-zinc-950 rounded-2xl flex items-center justify-center shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)]">
                        <Clapperboard size={32} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight mt-4">Atitino</h1>
                    <p className="text-zinc-500 text-sm">
                        Curadoria privada de cinema & séries.
                    </p>
                </div>

                {/* Formulário */}
                <div className="bg-zinc-900/50 border border-zinc-800/50 p-8 rounded-2xl shadow-2xl backdrop-blur-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="username"
                                    className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2"
                                >
                                    Usuário
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
                                    placeholder="Seu nome de usuário"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2"
                                >
                                    Senha
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-950/30 border border-red-900/50 text-red-200 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-zinc-950 font-bold py-3.5 rounded-lg hover:bg-zinc-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                "Entrar"
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-zinc-600">
                    Acesso restrito a administradores.
                </p>
            </div>
        </div>
    );
}