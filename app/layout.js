import { Inter, Figtree } from "next/font/google";
import "./globals.css";

const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans" });

const fontHeading = Figtree({ subsets: ["latin"], variable: "--font-heading" });

export const metadata = {
  title: "Cockpit + Next.js",
  description: "Headless CMS frontend powered by Cockpit",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontHeading.variable}`}>
      <body className="antialiased min-h-screen">
        <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#f5f7f6] to-[#e9eceb]">
          <div className="absolute w-[500px] h-[500px] bg-green-400 opacity-30 blur-[120px] rounded-full top-[-100px] left-[-100px]"></div>
          <div className="absolute w-[500px] h-[500px] bg-green-500 opacity-20 blur-[120px] rounded-full top-[50px] right-[-100px]"></div>
        </div>
        {children}
      </body>
    </html>
  );
}
