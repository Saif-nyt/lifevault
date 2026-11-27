import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: {
    default: "LifeVault — Your Life. Your Knowledge. Your Archive.",
    template: "%s · LifeVault",
  },
  description:
    "A private personal archive for notes, memories, books, films, ideas, documents and everything else you want to remember.",
  applicationName: "LifeVault",
  keywords: ["personal archive", "notes", "memories", "knowledge management", "lifevault"],
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f4fa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1020" },
  ],
};

const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('lifevault-theme');
    var dark = stored ? stored === 'dark' : true;
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
