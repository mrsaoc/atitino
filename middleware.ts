import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/login", // Redireciona para nossa tela customizada se não tiver logado
    },
});

export const config = {
    // Define quais rotas serão protegidas.
    // O matcher abaixo protege tudo, exceto arquivos estáticos, imagens e a própria api de auth.
    matcher: ["/((?!api/auth|login|_next/static|_next/image|favicon.ico).*)"],
};