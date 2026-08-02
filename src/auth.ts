import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  session: {
    // JWT: no hace falta base de datos para tener cuentas/sesiones.
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
});
