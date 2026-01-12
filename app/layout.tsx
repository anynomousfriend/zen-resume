import type { Metadata } from "next";
import { Inter, Playfair_Display, Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const notoSerifJP = Noto_Serif_JP({ 
  subsets: ["latin"],
  weight: ['300', '400', '700'],
  variable: '--font-noto-serif-jp',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "ZenResume - Craft Your Path",
  description: "Create stunning, professional resumes with mindful intention. In a world of noise, find your signal.",
  icons: {
    icon: [
      { url: '/logo-02.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo-02.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/logo-02.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} ${notoSerifJP.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
