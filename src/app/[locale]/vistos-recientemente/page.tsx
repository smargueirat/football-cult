import { Metadata } from "next";
import VistosRecientementeClient from "./VistosRecientementeClient";

export const metadata: Metadata = {
  title: "Vistos recientemente | Football Cult",
  robots: { index: false, follow: true },
};

export default function VistosRecientementePage() {
  return <VistosRecientementeClient />;
}
