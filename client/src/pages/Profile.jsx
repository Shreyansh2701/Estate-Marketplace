import { useSelector } from 'react-redux'
import { useRef, useState } from 'react';
import { useEffect } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';

export default function Profile() {
  const avatarRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileuploadError, setFileUploadError] = useState(false);
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
    }
  );
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
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
        <input type="text" placeholder='username' id="username" className='border p-3 rounded-lg' />
        <input type="email" placeholder='email' id="email" className='border p-3 rounded-lg' />
        <input type="password" placeholder='password' id="password" className='border p-3 rounded-lg' />
        <button className='bg-slate-700 text-white rounded-lg p-2 uppercase hover:opacity-95 disabled:opacity-80'>Update</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}
