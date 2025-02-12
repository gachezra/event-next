import EventsPage from './EventsPage';

export const metadata = {
  title: 'EventKick | Events in Mombasa and Nairobi',
  description: 'Discover the best events in Mombasa today and this weekend. Your complete guide to what\'s happening in Mombasa - concerts, festivals, beach parties, cultural events, and more. Find events tonight and this weekend in Mombasa.',
  keywords: [
    'events in mombasa',
    'mombasa events',
    "what's on mombasa",
    'tonight in mombasa',
    'today in mombasa',
    'this weekend in mombasa',
    'mombasa weekend events',
    'things to do in mombasa',
    'mombasa entertainment',
    'mombasa festivals',
    'mombasa beach events',
    'coastal kenya events',
    'mombasa nightlife',
    'mombasa cultural events',
    'events at fort jesus',
    'nyali beach events',
    'diani beach events',
    'mombasa music events',
    'mombasa food festivals',
    'mombasa art exhibitions'
  ],
  openGraph: {
    title: 'Discover Events in Mombasa | Your Complete Event Guide',
    description: 'Find the best events happening in Mombasa tonight and this weekend. Live music, beach parties, cultural events, and more!',
    type: 'website',
    locale: 'en_KE',
    siteName: 'EventKick | Your Events Guide'
  }
};

export default function HomePage() {
  return <EventsPage />;
}