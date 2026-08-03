import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  session: {
    // JWT: no hace falta base de datos para tener cuentas/sesiones.
    // Los favoritos del usuario viajan dentro del propio token (ver
    // callbacks abajo). Las alertas de precio, en cambio, se guardan en
    // KV (ver /api/price-alerts) porque el cron que las revisa necesita
    // poder encontrarlas sin depender de la sesión de nadie.
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, trigger, session }) {
      if (trigger === "update" && session?.favorites) {
        token.favorites = session.favorites;
      }
      return token;
    },
    async session({ session, token }) {
      session.favorites = (token.favorites as string[] | undefined) ?? [];
      return session;
    },
  },
});
