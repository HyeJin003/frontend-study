import type { Metadata } from "next";
import "./globals.css";
import Header from "@/app/components/Header";
import { Noto_Sans_KR } from "next/font/google";
export const metadata: Metadata = {
  title: "Dayo",
  description: "여행 커뮤니티 Dayo",
};
const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={notoSansKR.className}>
        <Header />
        <div>{children}</div>
      </body>
    </html>
  );
}
