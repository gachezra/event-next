import PlanEventForm from './plan-event-form';

export const metadata = {
  title: 'Plan Your Event',
  description: 'Post details about your events which will be published after admin review.',
}

export default function PlanEventPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#131324] text-white">
      <main className="container mx-auto flex-grow p-4">
        <h1 className="text-3xl font-bold mb-4">Plan Your Event</h1>
        <p className="mb-4">
          Follow the instructions below to publish your event:
        </p>
        <ol className="list-decimal list-inside mb-4">
          <li>Enter the title of your event.</li>
          <li>Provide a detailed description of the event.</li>
          <li>Select the date and time for the event.</li>
          <li>Enter the location where the event will be held.</li>
          <li>Upload an image for your event (optional).</li>
          <li>Click the "Submit" button to publish your event.</li>
        </ol>
        <PlanEventForm />
      </main>
    </div>
  )
}
