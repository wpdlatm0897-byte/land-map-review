import "./globals.css";
import "ol/ol.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Parcel Ledger",
  description: "필지별 토지대장 발급 보조 시스템"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
