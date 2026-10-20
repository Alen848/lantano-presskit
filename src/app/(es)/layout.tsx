import "../globals.css";
import type { ReactNode } from "react";
import { RootDocument, buildMetadata } from "@/components/RootDocument";

export { viewport } from "@/components/RootDocument";
export const metadata = buildMetadata("es");

export default function SpanishLayout({ children }: { children: ReactNode }) {
  return <RootDocument locale="es">{children}</RootDocument>;
}
