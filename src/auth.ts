import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  session: {
    // JWT: no hace falta base de datos para tener cuentas/sesiones.
    // Los favoritos y alertas de precio del usuario viajan dentro del
    // propio token (ver callbacks abajo), alcanza para un catálogo de
    // este tamaño.
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
      if (trigger === "update" && session?.priceAlerts) {
        token.priceAlerts = session.priceAlerts;
      }
      return token;
    },
    async session({ session, token }) {
      session.favorites = (token.favorites as string[] | undefined) ?? [];
      session.priceAlerts = (token.priceAlerts as string[] | undefined) ?? [];
      return session;
    },
  },
});
