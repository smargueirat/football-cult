import { Metadata } from "next";
import BrasilClient from "./BrasilClient";

export const metadata: Metadata = {
  title: "Fútbol brasileño | Football Cult",
  description:
    "Cómo cubrimos el fútbol brasileño en Football Cult: selección, catorce clubes y cinco tiendas oficiales de club integradas al catálogo.",
};

export default function Brasil() {
  return <BrasilClient />;
}
