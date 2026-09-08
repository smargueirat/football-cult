import { Metadata } from "next";
import ItaliaClient from "./ItaliaClient";

export const metadata: Metadata = {
  title: "Fútbol italiano | Football Cult",
  description:
    "Cómo cubrimos el fútbol italiano en Football Cult: la Selección de Italia, comparada en hasta 9 tiendas distintas, y un archivo retro real desde 1970.",
};

export default function Italia() {
  return <ItaliaClient />;
}
