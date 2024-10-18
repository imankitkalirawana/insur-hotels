import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import Sonner from '@/components/providers';
import { Providers } from './providers';
import { Outfit } from 'next/font/google';
import Navbar from '@/components/sections/Navbar';
import Cookies from '@/components/sections/cookies';
import { Hotel } from '@/lib/interface';
import { getHotels, getWebsite } from '@/functions/get';
import { auth } from '@/auth';
import GoogleAnalytics from '@/components/GoogleAnalytics';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900']
});

export async function generateMetadata(): Promise<Metadata> {
  const website = await getWebsite();
  return {
    title: website.pageTitle,
    description: website.metaDescription,
    keywords: website.keywords,
    openGraph: {
      title: website.pageTitle,
      description: website.metaDescription,
      images: [
        {
          url: website.src,
          alt: website.pageTitle
        }
      ]
    }
  };
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hotels: Hotel[] = await getHotels();
  const session = await auth();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="bg-background text-foreground"
    >
      <GoogleAnalytics />
      <body className={outfit.className}>
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="light">
            <Navbar hotels={hotels} session={session} />
            <Cookies />
            {children}
            <Sonner />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
