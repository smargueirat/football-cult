import { Metadata } from "next";
import SobreNosotrosClient from "./SobreNosotrosClient";

export const metadata: Metadata = {
  title: "Sobre nosotros | Football Cult",
  description:
    "Football Cult es un comparador de precios de camisetas de fútbol. Conocé cómo funciona el sitio.",
};

export default function SobreNosotros() {
  return <SobreNosotrosClient />;
}
