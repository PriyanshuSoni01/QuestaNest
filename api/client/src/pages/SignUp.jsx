import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth'

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()



  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    }
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Ensure formData is defined
      });
      const data = await res.json()
      if(data.success === false){
        setError(data.message)
        setLoading(false)
        return
      }
      setLoading(false)
      setError(null)
      navigate('/signin')
      console.log(data)
    } catch (error) {
      setLoading(false)
      setError(error.message)
    }
  }
  console.log(formData)




  return (
    <div className='w-full h-screen flex justify-center items-center'>
    <div className='p-7 w-[40%] max-w-lg mx-auto bg-black text-orange-100 rounded-lg'>
      <h1 className='text-3xl text-center font-semibold my-7  text-orange-500'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input 
          type="text" 
          placeholder='Username' 
          className='border border-orange-500 p-3 rounded-lg bg-black text-orange-100 placeholder-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-500' 
          id='username' 
          onChange={handleChange} 
        />
        <input 
          type="email" 
          placeholder='Email' 
          className='border border-orange-500 p-3 rounded-lg bg-black text-orange-100 placeholder-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-500' 
          id='email' 
          onChange={handleChange} 
        />
        <input 
          type="password" 
          placeholder='Password' 
          className='border border-orange-500 p-3 rounded-lg bg-black text-orange-100 placeholder-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-500' 
          id='password' 
          onChange={handleChange} 
        />
        <button 
          disabled={loading} 
          className='bg-orange-600 text-black p-3 rounded-lg uppercase hover:bg-orange-700 disabled:opacity-80 font-medium transition-colors'
        >
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
        <OAuth/>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={'/signin'}>
          <span className='text-orange-500 hover:text-orange-400'>Sign in</span>
        </Link>
      </div>
      {error && <p className='text-orange-400 mt-5'>{error}</p>}
    </div>
    </div>
  )
  
}
