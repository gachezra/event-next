import '../styles/globals.css';
import { Footer } from '../components/footer';
import { Header } from '../components/header';
import { Toaster } from 'sonner';

export const metadata = {
  title: {
    template: '%s | Your Events Guide',
    default: 'Discover Events in Mombasa | What\'s On Tonight & This Weekend'
  },
  description: 'Find the best events happening in Mombasa tonight and this weekend. Live music, beach parties, cultural events, and more!',
  keywords: [
    'events in mombasa',
    'mombasa events',
    "what's on mombasa",
    'tonight in mombasa',
    'this weekend in mombasa',
    'mombasa entertainment',
    'coastal kenya events',
    'clubs in mombasa',
    'mombasa nightlife'
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="lofi">
      <head>
        <link rel="icon" href="/favicon.svg" sizes="any" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-[#131324]">
        <div className="flex flex-col min-h-screen">
        <Toaster position="bottom-right" theme="dark" />
          <Header />
          <main className="flex-grow w-full">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}