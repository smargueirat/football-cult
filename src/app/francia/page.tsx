import { Metadata } from "next";
import FranciaClient from "./FranciaClient";

export const metadata: Metadata = {
  title: "Fútbol francés | Football Cult",
  description:
    "Cómo cubrimos el fútbol francés en Football Cult: la Selección de Francia, comparada en hasta 10 tiendas distintas, y un archivo retro real desde 1950.",
};

export default function Francia() {
  return <FranciaClient />;
}
