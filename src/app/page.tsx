import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-bold mb-4">
          Bem-vindo, {session.user?.name}.
        </h1>
        <p className="text-zinc-400 max-w-lg text-center">
          O Atitino está configurado e seguro. Em breve, sua lista de filmes aparecerá aqui.
        </p>

        {/* Botão temporário de logout para teste */}
        <a
            href="/api/auth/signout"
            className="mt-8 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-full text-sm font-medium transition-colors"
        >
          Sair
        </a>
      </div>
  );
}