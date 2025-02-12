'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import axios from 'axios'

export default function LoginForm() {
  const router = useRouter()
  const [values, setValues] = useState({
    username: '',
    password: '',
  })

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (handleValidation()) {
      try {
        const { data } = await axios.post('/api/login', values)

        if (!data.status) {
          toast.error(data.msg)
          return
        }

        if (data.user.avatarImage){
          localStorage.setItem('isAvatarImageSet', true)
        }

        localStorage.setItem('token', data.token)

        localStorage.setItem('user', JSON.stringify(data.user))

        router.push('/')
      } catch (error) {
        toast.error('An error occurred. Please try again.')
      }
    }
  }

  const handleValidation = () => {
    const { password, username } = values
    if (!username) {
      toast.error('Username is required.')
      return false
    }
    if (!password) {
      toast.error('Password is required.')
      return false
    }
    return true
  }

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value })
  }

  return (
    <form className="flex flex-col w-full mt-4" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        name="username"
        onChange={handleChange}
        minLength={3}
        className="w-full p-3 mt-2 text-gray-200 placeholder-gray-400 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:border-indigo-500"
      />
      <input
        type="password"
        placeholder="Password"
        name="password"
        onChange={handleChange}
        className="w-full p-3 mt-4 text-gray-200 placeholder-gray-400 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:border-indigo-500"
      />
      <div className="flex justify-end mt-2">
        <Link
          href="/forgot-password"
          className="text-sm text-indigo-400 hover:text-indigo-500"
        >
          Forgot Password?
        </Link>
      </div>
      <div className="flex items-center justify-center mx-auto mt-4 text-center">
        <button
          type="submit"
          className="px-6 py-2 mt-2 text-indigo-600 transition duration-150 ease-in-out bg-transparent border-2 border-indigo-600 rounded-full hover:bg-opacity-10 hover:bg-gray-300"
        >
          Login
        </button>
      </div>
      <span className="block mt-6 text-sm text-center text-gray-300">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-indigo-500 hover:text-indigo-600">
          Register
        </Link>
      </span>
    </form>
  )
}
