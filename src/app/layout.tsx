import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DuetSketch",
  description: "A multiplayer drawing app for you and your pals",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="overflow-hidden">{children}</body>
    </html>
  );
}
