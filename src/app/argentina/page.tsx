import { Metadata } from "next";
import ArgentinaClient from "./ArgentinaClient";

export const metadata: Metadata = {
  title: "Fútbol argentino | Football Cult",
  description:
    "Cómo cubrimos el fútbol argentino en Football Cult: la Selección Argentina, comparada en hasta 12 tiendas distintas, y un archivo retro real desde 1982.",
};

export default function Argentina() {
  return <ArgentinaClient />;
}
