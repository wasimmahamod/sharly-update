import React, { useState } from 'react'
import { MdOutlineCloudUpload } from 'react-icons/md'
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { getDatabase, ref, set,onValue ,push, update} from "firebase/database";
import { getStorage, ref as iref, uploadString,getDownloadURL } from "firebase/storage";
import { getAuth, onAuthStateChanged ,updateProfile} from "firebase/auth";
import { useSelector } from 'react-redux';
import { Rings } from  'react-loader-spinner'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfilePhoto = () => {
    const auth = getAuth();
    const db = getDatabase();
    const storage = getStorage();
    let data=useSelector((state)=>state.userLoginInfo.userInfo)

    let [profileModalShow,setProfileModalShow]=useState(false)
    const [image, setImage] = useState('');
    const [cropData, setCropData] = useState("");
    const [cropper, setCropper] = useState('');
    let [loader,setLoader]=useState(false)

    const onChange = (e) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
          files = e.dataTransfer.files;
        } else if (e.target) {
          files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
          setImage(reader.result);
        };
        reader.readAsDataURL(files[0]);
      };
    
      const getCropData = () => {
        setLoader(true)
        toast.info("Please wait a few seconds  ");
        if (typeof cropper !== "undefined") {
          setCropData(cropper.getCroppedCanvas().toDataURL());
          const storageRef = iref(storage, data.uid+data.uid);
          const message4 = cropper.getCroppedCanvas().toDataURL();
          uploadString(storageRef, message4, 'data_url').then((snapshot) => {
            getDownloadURL(storageRef).then((downloadURL) => {
              updateProfile(auth.currentUser, {
                photoURL:downloadURL
              }).then(()=>{
                update(ref(db, 'user/'+data.uid),{
                  img:downloadURL,
                }).then(()=>{
                  setProfileModalShow(false)
                  set(push(ref(db, 'post/')), {
                    admin:data.displayName,
                    adminid:data.uid,
                    adminphoto:data.photoURL,
                    post:"Profile Update",
                    postimg:downloadURL,
                    date:`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}- ${new Date().getHours()}  ${new Date().getMinutes()}`  
                  }).then(()=>{
                    setLoader(false)
                  })
                })
              })
            })
          })
        }
      };
  return (
    <div>
        <ToastContainer
            position="top-center"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            />
        <div className='w-[100px] lg:w-[170px] h-[100px] lg:h-[170px] rounded-full overflow-hidden mt-[-20px] inline-block relative z-10 group'>
              <img className='w-full h-full' src={data.photoURL} />
              <div onClick={()=>setProfileModalShow(true)} className='w-full h-[0%] group-hover:h-[100%] bg-[rgba(0,0,0,.5)]  absolute top-0 left-0  ease-in-out duration-300 flex justify-center items-center'>
                <MdOutlineCloudUpload className='text-white text-2xl hidden group-hover:block' />
              </div>
    </div>
    {profileModalShow&&
    <div className='w-full h-screen bg-[rgba(0,0,0,.4)] absolute top-[25%] lg:top-0 left-0 z-50 lg:flex justify-center items-center'>
    <div className='w-full lg:w-1/4 p-5  bg-white rounded-2xl shadow-lg'>
    <h1 className='font-nunito text-2xl font-bold text-primary'>Upload Your Profile Photo </h1>
            <input onChange={onChange}  className='font-primary text-md text-primary block mt-5 mb-5 w-full' type='file' />
            {image&&
            <div className='w-[70px] h-[70px] rounded-full overflow-hidden mx-auto mb-2'>
                <div className="img-preview w-full h-full"/>
            </div>
            }
            {image&&
            
            <div className='w-[200px] h-[150px] mx-auto rounded-md overflow-hidden'>
            <Cropper
              style={{ height: '100%', width: "100%" }}
              zoomTo={0.5}
              initialAspectRatio={1}
              preview=".img-preview"
              src={image}
              viewMode={1}
              minCropBoxHeight={10}
              minCropBoxWidth={10}
              background={false}
              responsive={true}
              autoCropArea={1}
              checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
              onInitialized={(instance) => {
                setCropper(instance);
              }}
              guides={true}
            />
            </div>
            }
            <div className='flex items-center '>
            {loader
            ?
            <div className='flex items-center mt-3' >
             <Rings
              height="80"
              width="80"
              color="#4fa94d"
              radius="6"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel="rings-loading"
            />
            </div>
            :
            <button onClick={getCropData} className='font-primary py-2 px-2 bg-primary rounded-bl-lg text-sm text-white  mt-5 inline-block'>Upload</button>
            }
            <button onClick={()=>setProfileModalShow(false)} className='font-primary py-2 px-2 bg-red-500 rounded-bl-lg text-sm text-white ml-5  mt-5 inline-block'>Cancel</button>
            </div>
    </div>
    </div>
  }
    </div>
  )
}

export default ProfilePhoto