import type { Metadata } from "next";
import { NotFoundContent } from "../not-found-content";

export const metadata: Metadata = { title: "Page introuvable", robots: { index: false, follow: true }, alternates: { languages: {} } };

export default function FrenchNotFound() {
  return <NotFoundContent locale="fr"/>;
}
