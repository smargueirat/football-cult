import { Metadata } from "next";
import FavoritosClient from "./FavoritosClient";

export const metadata: Metadata = {
  title: "Tus favoritos | Football Cult",
  robots: { index: false, follow: true },
};

export default function FavoritosPage() {
  return <FavoritosClient />;
}
