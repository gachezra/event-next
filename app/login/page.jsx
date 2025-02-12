import LoginForm from './loginform'
import Logo from '../../assets/favicon.svg'
import Image from 'next/image'

export const metadata = {
  title: 'Login',
  description: 'Login to your account to get tickets and view your history.',
}

const quotes = [
  "Great events make great history.",
  "Adventure is just a ticket away.",
  "Every event is a chance to create memories.",
  "Discover the moments that matter.",
  "Your journey starts with a single click.",
]

export default function LoginPage() {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]

  return (
    <main className="flex items-center justify-center min-h-screen px-4 py-8 bg-[#131324]">
      <div className="flex flex-col items-center w-full max-w-md px-6 py-8 mx-4 bg-[#1a1a2e] rounded-lg shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <Image src={Logo} alt="logo" className="h-12 mb-2" />
          <h1 className="text-3xl font-semibold text-white">Login</h1>
        </div>
        <LoginForm />
        <div className="mt-6 text-sm italic text-gray-400 text-center">
          <p>{`"${randomQuote}"`}</p>
        </div>
      </div>
    </main>
  )
}
