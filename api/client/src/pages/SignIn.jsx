import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector} from 'react-redux'
import { signInStart, sigInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })
const {loading, error} = useSelector((state) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()



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
      dispatch(signInStart())
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Ensure formData is defined
      });
      const data = await res.json()
      console.log(data)
      if(data.success === false){
        dispatch(signInFailure(data.message))
        return
      }
      dispatch(sigInSuccess(data))
      navigate('/')
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  }
  console.log(formData)




  return (
    <div className=' w-full h-screen flex justify-center items-center gradient'>
      <div className='p-8 w-[50%] max-w-lg mx-auto bg-black text-orange-100 rounded-lg shadow-lg '>
      <h1 className='text-3xl text-center font-semibold my-7 text-orange-400'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
  
        <input
          type="email"
          placeholder='Email'
          className='border border-orange-400 bg-transparent text-orange-100 placeholder-orange-300 p-3 rounded-lg'
          id='email'
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder='Password'
          className='border border-orange-400 bg-transparent text-orange-100 placeholder-orange-300 p-3 rounded-lg'
          id='password'
          onChange={handleChange}
        />
  
        <button
          disabled={loading}
          className='bg-orange-600 text-black p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 font-medium'
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>
  
        <OAuth />
      </form>
  
      <div className='flex gap-2 mt-5'>
        <p className='text-orange-200'>Don't have an account?</p>
        <Link to={'/signup'}>
          <span className='text-orange-400 hover:underline f'>Sign up</span>
        </Link>
      </div>
  
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
    </div>
    
  );
}
