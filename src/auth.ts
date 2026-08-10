import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { RedisAdapter } from "@/lib/auth/redisAdapter";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // El adapter solo hace falta para el login por email (Resend): guarda el
  // token de verificación de un solo uso en Redis. Google no lo necesita
  // para nada -- sigue andando en modo JWT puro, como antes. De paso, el
  // adapter deja en Redis el registro de "quién se registró alguna vez"
  // (set `registered_users`), pensado para poder mandar mails más
  // adelante a quienes se hayan logueado, ya sea por Google o por mail.
  adapter: RedisAdapter(),
  providers: [
    Google,
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      // Dominio football-cult.com todavía no verificado en Resend (mismo
      // motivo que /api/report-product) -- usamos el remitente sandbox.
      from: "Football Cult <onboarding@resend.dev>",
    }),
  ],
  session: {
    // JWT: no hace falta tabla de sesiones en Redis. Los favoritos del
    // usuario viajan dentro del propio token (ver callbacks abajo).
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
