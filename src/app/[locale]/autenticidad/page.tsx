import { Metadata } from "next";
import AutenticidadClient from "./AutenticidadClient";

export const metadata: Metadata = {
  title: "Cómo verificar autenticidad | Football Cult",
  description:
    "Diferencia entre camiseta auténtica y réplica, señales de un vendedor no confiable, y cómo marcamos las ofertas de réplicas no oficiales en el sitio.",
};

export default function Autenticidad() {
  return <AutenticidadClient />;
}
