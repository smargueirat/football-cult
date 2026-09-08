import { Metadata } from "next";
import PrivacidadClient from "./PrivacidadClient";

export const metadata: Metadata = {
  title: "Política de privacidad | Football Cult",
  description: "Qué información recopila Football Cult y cómo la usa.",
};

export default function Privacidad() {
  return <PrivacidadClient />;
}
