import "../globals.css";
import type { ReactNode } from "react";
import { RootDocument, buildMetadata } from "@/components/RootDocument";

export { viewport } from "@/components/RootDocument";
export const metadata = buildMetadata("en");

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return <RootDocument locale="en">{children}</RootDocument>;
}
