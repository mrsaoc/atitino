import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
    // Estratégia de sessão via JWT para não sobrecarregar o banco
    session: {
        strategy: "jwt",
    },
    // Página de login customizada (vamos criar no próximo passo)
    pages: {
        signIn: "/login",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    return null;
                }

                // Busca o usuário no banco pelo username
                const user = await prisma.user.findUnique({
                    where: {
                        username: credentials.username,
                    },
                });

                if (!user) {
                    // Usuário não encontrado
                    return null;
                }

                // Compara a senha enviada com o hash no banco
                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordValid) {
                    // Senha incorreta
                    return null;
                }

                // Retorna o objeto do usuário para ser salvo na sessão
                return {
                    id: user.id,
                    name: user.name,
                    email: user.username, // Usamos o campo email para passar o username (padrão do NextAuth)
                    image: user.avatarUrl,
                };
            },
        }),
    ],
    callbacks: {
        // Adiciona dados extras ao objeto de sessão (frontend)
        async session({ session, token }) {
            if (token && session.user) {
                session.user.name = token.name;
                session.user.image = token.picture;
                // @ts-ignore
                session.user.id = token.sub;
                // @ts-ignore
                session.user.username = token.email;
            }
            return session;
        },
        // Persiste dados no token JWT
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
                token.name = user.name;
                token.email = user.email;
                token.picture = user.image;
            }
            return token;
        },
    },
};