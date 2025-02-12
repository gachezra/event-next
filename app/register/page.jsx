import RegisterForm from './registerform'
import Logo from '../../assets/favicon.svg'
import Image from 'next/image'

export const metadata = {
  title: 'Register',
  description: 'Register for an EventKick account.',
}

const quotes = [
  "The best events are those yet to come.",
  "Every moment has its story.",
  "Your journey starts with a single step.",
  "Create, connect, and celebrate.",
  "Join the community, shape the future.",
]

export default function RegisterPage() {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]

  return (
    <main className="flex items-center justify-center min-h-screen px-4 py-8 bg-[#131324]">
      <div className="flex flex-col items-center w-full max-w-md px-6 py-8 mx-4 bg-[#1a1a2e] rounded-lg shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <Image src={Logo} alt="logo" className="h-12 mb-2" />
          <h1 className="text-3xl font-semibold text-white">Register</h1>
        </div>
        <RegisterForm />
        <div className="mt-6 text-sm italic text-gray-400 text-center">
          <p>{`"${randomQuote}"`}</p>
        </div>
      </div>
    </main>
  )
}
