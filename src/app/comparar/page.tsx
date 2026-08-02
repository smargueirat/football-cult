import { Metadata } from "next";
import CompareClient from "./CompareClient";

export const metadata: Metadata = {
  title: "Comparar camisetas | Football Cult",
  robots: { index: false, follow: true },
};

export default function ComparePage() {
  return <CompareClient />;
}
