import ResetPasswordForm from './reset-password-form';
import Logo from '../../assets/favicon.svg';
import Image from 'next/image';

export const metadata = {
  title: 'Reset Password',
  description: 'Reset your password.',
}

export default function ResetPasswordPage() {
  return (
    <div className="flex flex-col bg-[#131324] text-white">
      <main className="flex items-center justify-center min-h-screen px-4 py-8 bg-[#131324]">
        <div className="flex flex-col items-center w-full max-w-md px-3 py-8 mx-4 bg-[#1a1a2e] rounded-lg shadow-2xl">
          <div className="flex flex-col items-center">
            <Image src={Logo} alt="logo" className="h-12 mr-2" />
            <h1 className="text-2xl font-bold text-white">Reset Password</h1>
          </div>
          <ResetPasswordForm />
        </div>
      </main>
    </div>
  )
}
