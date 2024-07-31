import { useSelector } from 'react-redux'
import { useRef, useState } from 'react';
import { useEffect } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { 
  updateUserStart, 
  updateUserSuccess, 
  updateUserFailure,
  deleteUserStart, 
  deleteUserSuccess, 
  deleteUserFailure
 } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const avatarRef = useRef(null);
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileuploadError, setFileUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [formData, setFormData] = useState({});
  console.log(formData);
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setFilePercentage(Math.round(progress));

      if (snapshot.state === 'success') {
        console.log('Upload successful');
      }
    },
    (error) => {
      setFileUploadError(true);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setFormData({...formData, avatar: downloadURL});
      })
    });
  }

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if(data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      // localStorage.removeItem('token');
      // navigate('/sign-in');
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={avatarRef} hidden accept='image/*'/>
        <img onClick={()=>avatarRef.current.click()} src={formData.avatar || currentUser.avatar} alt="profile" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />
        <p className='text-sm self-center'>
          {
            fileuploadError ? (<span className="text-red-700">Error Image Upload (image must be less than 12mb)</span>) : filePercentage > 0 && filePercentage < 100 ? (
              <span className="text-slate-700">Image is uploading... {filePercentage}%</span>
            ) : filePercentage === 100 ?  (
              <span className="text-green-700">Image uploaded successfully</span>
            ) : ""
          }
        </p>
        <input type="text" placeholder='username' id="username" className='border p-3 rounded-lg' defaultValue={currentUser.username} onChange={handleChange} />
        <input type="email" placeholder='email' id="email" className='border p-3 rounded-lg' defaultValue={currentUser.email} onChange={handleChange} />
        <input type="password" placeholder='password' id="password" className='border p-3 rounded-lg' onChange={handleChange} />
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-2 uppercase hover:opacity-95 disabled:opacity-80'>
          {
            loading ? 'Loading...' : 'Update'
          }
          </button>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
      <p className='text-red-700 mt-5'>
        {
          error ? error : ''
        }
      </p>
      <p className='text-green-700 mt-5'>{updateSuccess ? 'Updated Successfully' : ''}</p>
    </div>
  )
}
