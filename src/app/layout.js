import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Diego's Frogs",
  description: "Generate mood-based frog stickers",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: "Diego's Frogs"
  },
  formatDetection: {
    telephone: false
  }
};

export const viewport = {
  themeColor: "#4ade80",
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: 'no'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
