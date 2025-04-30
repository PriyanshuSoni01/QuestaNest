import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRef } from 'react'
import { useState, useEffect } from 'react'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { app } from '../firebase'
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure } from '../redux/user/userSlice.js'
import { signOutUserStart, signOutUserSuccess, signOutUserFailure } from '../redux/user/userSlice.js'
import { Link } from 'react-router-dom'



export default function Profile() {
  const dispatch = useDispatch()
  const fileRef = useRef(null)
  const { currentUser, loading, error } = useSelector((state) => state.user)
  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [formData, setFormData] = useState({})
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);


  useEffect(() => {
    if (file) {
      handleFileUpload(file)
    }
  }, [file])

  const handleFileUpload = (file) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setFilePerc(Math.round(progress))
      },
      (error) => {
        setFileUploadError(true)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        )
      }
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message))
        return
      }
      dispatch(deleteUserSuccess(data))
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart())
      const res = await fetch('/api/auth/signout')
      const data = await res.json()
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message))
        return
      }
      dispatch(signOutUserSuccess(data))
    } catch (error) {
      dispatch(signOutUserFailure(data.message))
    }
  }

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className='w-full h-full p-2 bg-orange-950'>
      <div className='flex flex-col lg:flex-row gap-8 p-5 rounded-xl bg-black '>

        {/* Profile Section */}
        <div className='p-2 w-full lg:w-1/2 text-orange-100 rounded-lg shadow-lg'>
          <h1 className='text-3xl font-semibold text-center my-7 text-orange-400  '>PROFILE</h1>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*' />
            <img
              onClick={() => fileRef.current.click()}
              src={formData.avatar || currentUser.avatar}
              alt="Profile"
              className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
            />

            <p className='text-sm self-center'>
              {fileUploadError ? (
                <span className='text-red-500'>Error in Image Upload(Image must be less than 2MB)</span>
              ) : filePerc > 0 && filePerc < 100 ? (
                <span className='text-orange-200'>{`Uploading ${filePerc}%`}</span>
              ) : filePerc === 100 ? (
                <span className='text-green-500'>Image Successfully Uploaded!!</span>
              ) : ('')}
            </p>

            <input
              type='text'
              defaultValue={currentUser.username}
              placeholder='Username'
              id="username"
              className='border border-orange-400 bg-transparent text-orange-100 placeholder-orange-300 p-3 rounded-lg'
              onChange={handleChange}
            />
            <input
              type='email'
              defaultValue={currentUser.email}
              placeholder='Email'
              id="email"
              className='border border-orange-400 bg-transparent text-orange-100 placeholder-orange-300 p-3 rounded-lg'
              onChange={handleChange}
            />
            <input
              type='password'
              id="password"
              placeholder='Password'
              className='border border-orange-400 bg-transparent text-orange-100 placeholder-orange-300 p-3 rounded-lg'
              onChange={handleChange}
            />

            <button disabled={loading} className='bg-orange-600 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
              {loading ? 'Loading...' : 'UPDATE'}
            </button>

            <Link className="bg-[#fed3b5] text-[#613d24] font-medium p-3 rounded-lg uppercase text-center hover:opacity-95" to={"/create-listing"}>
              Create Listing
            </Link>
          </form>

          <div className='flex justify-between mt-5 '>
            <span className='text-red-500 cursor-pointer' onClick={handleDeleteUser}>Delete Account</span>
            <span className='text-red-500 cursor-pointer' onClick={handleSignOut}>Sign Out</span>
          </div>

          <p className='text-red-500 mt-5'>{error ? error : ''}</p>
          <p className='text-green-500 mt-5'>{updateSuccess ? 'User is updated successfully!!' : ''}</p>
          <div className='w-full flex  justify-center'> <button onClick={handleShowListings} className='text-orange-400 p-5 border-2 border-orange-400 rounded-lg hover:scale-95 transition-all duration-[130ms] '>
            Show Listings
          </button></div>
          

          <p className='text-red-500 mt-5'>
            {showListingsError ? 'Error showing listings' : ''}
          </p>
        </div>

        {/* Partition Line */}
        <div className='hidden lg:block lg:h-auto w-[2px] bg-orange-600'></div>

        {/* Listings Section */}
        <div className='w-full lg:w-1/2 flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2 mt-5'>
          {userListings && userListings.length > 0 ? (
            <>
              <h1 className='text-center text-2xl font-semibold text-orange-400 sticky z-10 top-0 py-4 border-b-2 border-b-orange-400 bg-black '>
                YOUR LISTINGS
              </h1>

              {userListings.map((listing) => (
                <div
                  key={listing._id}
                  className='border border-orange-500 rounded-lg p-3 flex justify-between items-center gap-4 mt-6 '
                >
                  <Link to={`/listing/${listing._id}`}>
                    <img
                      src={listing.imageUrls[0]}
                      alt='listing cover'
                      className='h-16 w-24 object-contain rounded-md'
                    />
                  </Link>
                  <Link
                    className='text-orange-200 font-semibold hover:underline truncate flex-1'
                    to={`/listing/${listing._id}`}
                  >
                    <p>{listing.name}</p>
                  </Link>

                  <div className='flex flex-col items-center'>
                    <button
                      onClick={() => handleListingDelete(listing._id)}
                      className='text-red-500 uppercase'
                    >
                      Delete
                    </button>
                    <Link to={`/update-listing/${listing._id}`}>
                      <button className='text-green-500 uppercase'>Edit</button>
                    </Link>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className='flex justify-center items-center h-full text-orange-300 text-xl mt-32 text-center'>
              No listings exist. Click "Show Listings" to load your listings.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
