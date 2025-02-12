import AvatarSetup from './AvatarSetup';

export const metadata = {
  title: 'Set Avatar',
  description: 'Set your profile picture/avatar.',
  alternates: {
    canonical: 'https://www.eventkick.ke/setAvatar',
  },
};

export default function SetAvatarPage() {
  return <AvatarSetup />;
}