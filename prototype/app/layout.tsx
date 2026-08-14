import type { Metadata } from "next";

import { AppShell } from "@/components/shell/app-shell";

import "./globals.css";

export const metadata: Metadata = {
  title: "BrandPulse NEXT",
  description: "Static-first causal opportunity router prototype",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
