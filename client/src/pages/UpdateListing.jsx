import { useEffect, useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };

    fetchListing();
  }, []);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <div className='w-full h-full bg-black p-5'>
      <main className='p-4 max-w-4xl mx-auto bg-black text-orange-300 '>
        <h1 className='text-3xl font-semibold text-center my-3 text-orange-500 '>Update a Listing</h1>
        <div className='w-60 h-[3px] mx-auto bg-orange-500 mb-5'></div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-6 sm:flex-row'>
          {/* Left Side Form */}
          <div className='flex flex-col gap-4 flex-1'>

            <div>
              <label htmlFor='name' className='font-medium'>Name</label>
              <input
                type='text'
                id='name'
                placeholder='Name'
                className='w-full border border-orange-600 p-3 rounded-lg mt-1 bg-black text-orange-300 placeholder-orange-800'
                maxLength='62'
                minLength='10'
                required
                onChange={handleChange}
                value={formData.name}
              />
            </div>

            <div>
              <label htmlFor='description' className='font-medium'>Description</label>
              <textarea
                id='description'
                placeholder='Description'
                className='w-full border border-orange-600 p-3 rounded-lg mt-1 bg-black text-orange-300 placeholder-orange-800'
                required
                onChange={handleChange}
                value={formData.description}
              />
            </div>

            <div>
              <label htmlFor='address' className='font-medium'>Address</label>
              <input
                type='text'
                id='address'
                placeholder='Address'
                className='w-full border border-orange-600 p-3 rounded-lg mt-1 bg-black text-orange-300 placeholder-orange-800'
                required
                onChange={handleChange}
                value={formData.address}
              />
            </div>

            {/* Property Options */}
            <div className='flex flex-wrap gap-4'>
              <div className='flex items-center gap-2'>
                <input
                  type='radio'
                  id='sale'
                  name='type'
                  value='sale'
                  onChange={handleChange}
                  checked={formData.type === 'sale'}
                  className='text-orange-600 bg-black border-orange-600'
                />
                <label htmlFor='sale'>Sell</label>
              </div>
              <div className='flex items-center gap-2'>
                <input
                  type='radio'
                  id='rent'
                  name='type'
                  value='rent'
                  onChange={handleChange}
                  checked={formData.type === 'rent'}
                  className='text-orange-600 bg-black border-orange-600'
                />
                <label htmlFor='rent'>Rent</label>
              </div>
              <div className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  id='parking'
                  onChange={handleChange}
                  checked={formData.parking}
                  className='text-orange-600 bg-black border-orange-600'
                />
                <label htmlFor='parking'>Parking Spot</label>
              </div>
              <div className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  id='furnished'
                  onChange={handleChange}
                  checked={formData.furnished}
                  className='text-orange-600 bg-black border-orange-600'
                />
                <label htmlFor='furnished'>Furnished</label>
              </div>
              <div className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  id='offer'
                  onChange={handleChange}
                  checked={formData.offer}
                  className='text-orange-600 bg-black border-orange-600'
                />
                <label htmlFor='offer'>Offer</label>
              </div>
            </div>

            {/* Number Inputs */}
            <div className='flex flex-wrap gap-6'>
              <div className='flex flex-col'>
                <label htmlFor='bedrooms'>Bedrooms</label>
                <input
                  type='number'
                  id='bedrooms'
                  min='1'
                  max='10'
                  required
                  className='p-3 border border-orange-600 rounded-lg bg-black text-orange-300'
                  onChange={handleChange}
                  value={formData.bedrooms}
                />
              </div>
              <div className='flex flex-col'>
                <label htmlFor='bathrooms'>Bathrooms</label>
                <input
                  type='number'
                  id='bathrooms'
                  min='1'
                  max='10'
                  required
                  className='p-3 border border-orange-600 rounded-lg bg-black text-orange-300'
                  onChange={handleChange}
                  value={formData.bathrooms}
                />
              </div>
              <div className='flex flex-col'>
                <label htmlFor='regularPrice'>Regular Price</label>
                <input
                  type='number'
                  id='regularPrice'
                  min='50'
                  max='10000000'
                  required
                  className='p-3 border border-orange-600 rounded-lg bg-black text-orange-300'
                  onChange={handleChange}
                  value={formData.regularPrice}
                />
                {formData.type === 'rent' && (
                  <span className='text-xs text-orange-500'>($ / month)</span>
                )}
              </div>
              {formData.offer && (
                <div className='flex flex-col'>
                  <label htmlFor='discountPrice'>Discounted Price</label>
                  <input
                    type='number'
                    id='discountPrice'
                    min='0'
                    max='10000000'
                    required
                    className='p-3 border border-orange-600 rounded-lg bg-black text-orange-300'
                    onChange={handleChange}
                    value={formData.discountPrice}
                  />
                  {formData.type === 'rent' && (
                    <span className='text-xs text-orange-500'>($ / month)</span>
                  )}
                </div>
              )}
            </div>
          </div>
           {/* Partition Line */}
        <div className='hidden lg:block lg:h-auto w-[2px] bg-orange-600'></div>

          {/* Right Side: Image Upload & Submit */}
          <div className='flex flex-col flex-1 gap-4'>
            <div>
              <label className='font-semibold'>
                Images:
                <span className='font-normal text-orange-500 ml-2'>
                  The first image will be the cover (max 6)
                </span>
              </label>
            </div>

            <div className='flex gap-4'>
              <input
                onChange={(e) => setFiles(e.target.files)}
                className='p-3 border border-orange-600 rounded w-full bg-black text-orange-300'
                type='file'
                id='images'
                accept='image/*'
                multiple
              />
              <button
                type='button'
                disabled={uploading}
                onClick={handleImageSubmit}
                className='p-3 text-orange-500 border border-orange-500 rounded uppercase hover:shadow-lg disabled:opacity-80 hover:bg-orange-900'
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>

            {imageUploadError && <p className='text-orange-500 text-sm'>{imageUploadError}</p>}

            {/* Preview Uploaded Images */}
            {formData.imageUrls.length > 0 &&
              formData.imageUrls.map((url, index) => (
                <div
                  key={url}
                  className='flex justify-between items-center p-3 border border-orange-600 rounded-lg'
                >
                  <img
                    src={url}
                    alt='listing preview'
                    className='w-50 h-20 object-contain rounded-lg'
                  />
                  <button
                    type='button'
                    onClick={() => handleRemoveImage(index)}
                    className='p-2 text-orange-500 border border-orange-500 rounded hover:bg-orange-900'
                  >
                    Delete
                  </button>
                </div>
              ))}

            <button
              type='submit'
              disabled={loading || uploading}
              className='p-3 bg-orange-600 text-black rounded-lg uppercase hover:opacity-95 disabled:opacity-80 font-bold'
            >
              {loading ? 'Updating...' : 'Update Listing'}
            </button>

            {error && <p className='text-orange-500 text-sm'>{error}</p>}
          </div>
        </form>
      </main>
    </div>
  );
}