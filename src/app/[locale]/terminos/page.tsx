import { Metadata } from "next";
import TerminosClient from "./TerminosClient";

export const metadata: Metadata = {
  title: "Términos y condiciones | Football Cult",
  description: "Qué es Football Cult y cómo funciona nuestro servicio de comparación de precios.",
};

export default function Terminos() {
  return <TerminosClient />;
}
