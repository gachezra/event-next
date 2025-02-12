import { Suspense } from 'react';
import axios from 'axios';
import EventDetails from './eventDetails';

// Fetch event data
async function getEvent(id) {
  if (!id) return null;
  
  try {
    // Use absolute URL to avoid Invalid URL error
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await axios.get(`${baseUrl}/api/event/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}

// Generate metadata
export async function generateMetadata({ params }) {
  // Wait for params to resolve
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams?.id;

  if (!id) {
    console.error("No ID provided in params");
    return {
      title: "Event Not Found",
      description: "The event could not be found.",
    };
  }

  try {
    const event = await getEvent(id);

    if (!event) {
      return {
        title: "Event Not Found",
        description: "The event could not be found.",
      };
    }

    return {
      title: event.title || "Event Details",
      description: event.description || "Discover event details here.",
      openGraph: {
        title: event.title || "Event Details",
        description: event.description || "Discover event details here.",
        images: event.image ? [{ url: event.image }] : [],
      },
    };
  } catch (error) {
    console.error("Error in generateMetadata:", error);

    return {
      title: "Event Details",
      description: "Discover event details here.",
    };
  }
}

// Main page component
export default async function Page({ params }) {
  // Wait for params to resolve
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams?.id;

  return (
    <main className="min-h-screen bg-[#131324]">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      }>
        <EventDetails id={id} />
      </Suspense>
    </main>
  );
}