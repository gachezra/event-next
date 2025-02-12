import UserProfile from './UserProfile';

export const metadata = {
  title: 'Your Profile | EventKick',
  description: 'View your profile, tickets, transactions, and posted events.',
  alternates: {
    canonical: 'https://www.eventkick.ke/profile',
  },
};

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-[#131324] text-white">
      <UserProfile />
    </main>
  );
}