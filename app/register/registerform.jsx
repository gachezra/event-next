'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import axios from 'axios'
import { MdEmail } from 'react-icons/md'

const EmailAlert = ({ message }) => (
  <div className="mt-4 text-center">
    <h3 className="text-xl text-white mb-2">Check your email</h3>
    <p className="text-gray-300 mb-4">{message}</p>
    <MdEmail className="text-indigo-500 mx-auto text-6xl mb-4" />
    <p className="text-sm text-gray-400">
      Check your spam folder if not in inbox
    </p>
  </div>
)

export default function RegisterForm() {
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  
  const [showEmailAlert, setShowEmailAlert] = useState(false)
  const [emailMessage, setEmailMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (handleValidation()) {
      const { email, username, password } = values
      try {
        const { data } = await axios.post('/api/auth/register', {
          username,
          email,
          password,
        })

        if (!data.status) {
          toast.error(data.msg)
          return
        }

        setEmailMessage(data.msg || 'Please check your email to verify your account.')
        setShowEmailAlert(true)
      } catch (error) {
        toast.error('An error occurred. Please try again.')
      }
    }
  }

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values
    
    if (password !== confirmPassword) {
      toast.error('Password and confirm password should be same.')
      return false
    }
    
    if (username.length < 3) {
      toast.error('Username should be greater than 3 characters.')
      return false
    }
    
    if (password.length < 6) {
      toast.error('Password should be equal or greater than 6 characters.')
      return false
    }
    
    if (!email) {
      toast.error('Email is required.')
      return false
    }

    return true
  }

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value })
  }

  if (showEmailAlert) {
    return <EmailAlert message={emailMessage} />
  }

  return (
    <form className="mt-6 px-6" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        name="username"
        onChange={handleChange}
        minLength={3}
        className="w-full p-3 mt-2 text-gray-200 placeholder-gray-400 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:border-gray-400"
      />
      <input
        type="email"
        placeholder="Email"
        name="email"
        onChange={handleChange}
        className="w-full p-3 mt-4 text-gray-200 placeholder-gray-400 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:border-gray-400"
      />
      <input
        type="password"
        placeholder="Password"
        name="password"
        onChange={handleChange}
        className="w-full p-3 mt-4 text-gray-200 placeholder-gray-400 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:border-gray-400"
      />
      <input
        type="password"
        placeholder="Confirm Password"
        name="confirmPassword"
        onChange={handleChange}
        className="w-full p-3 mt-4 text-gray-200 placeholder-gray-400 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:border-gray-400"
      />
      <div className="flex justify-end mt-2">
        <Link
          href="/forgot-password"
          className="text-sm text-indigo-400 hover:text-indigo-500"
        >
          Forgot Password?
        </Link>
      </div>
      <div className="justify-center text-center items-center mx-auto">
        <button
          type="submit"
          className="rounded-full border-2 justify-center border-indigo-600 px-6 pb-[6px] pt-2 mt-2 text-indigo-600 transition duration-150 ease-in-out hover:border-indigo-500 hover:bg-indigo-100 hover:bg-opacity-10 hover:text-indigo-500 focus:border-indigo-500 focus:text-indigo-500 focus:outline-none focus:ring-0 active:border-indigo-700 active:text-indigo-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10"
        >
          Register
        </button>
      </div>
      <span className="block mt-6 text-sm text-center text-gray-300">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-indigo-500 hover:text-indigo-600"
        >
          Login
        </Link>
      </span>
    </form>
  )
}