import { Metadata } from "next";
import ContactoClient from "./ContactoClient";

export const metadata: Metadata = {
  title: "Contacto | Football Cult",
  description: "Escribinos si encontraste un precio desactualizado o una tienda que deberíamos sumar.",
};

export default function Contacto() {
  return <ContactoClient />;
}
