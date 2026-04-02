import { Inter, Figtree } from "next/font/google";
import "./globals.css";

const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans" });

const fontHeading = Figtree({ subsets: ["latin"], variable: "--font-heading" });


export const metadata = {
  title: "Cockpit + Next.js",
  description: "Headless CMS frontend powered by Cockpit",
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontHeading.variable}`}>
      <body
        className="antialiased min-h-screen"
      >
        {children}
      </body>
    </html>
  );
}