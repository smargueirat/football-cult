import { Metadata } from "next";
import GuiaDeTallasClient from "./GuiaDeTallasClient";

export const metadata: Metadata = {
  title: "Guía de tallas | Football Cult",
  description:
    "Cómo elegir la talla correcta de camiseta de fútbol: diferencia entre auténtica y réplica, cómo medir, y por qué cada marca talla distinto.",
};

export default function GuiaDeTallas() {
  return <GuiaDeTallasClient />;
}
