import React, { useEffect, useRef, useState } from 'react'
import { GrGallery, GrSend } from 'react-icons/gr'
import { BsThreeDots } from 'react-icons/bs'
import { MdCloseFullscreen } from 'react-icons/md'
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getDatabase, ref, set,push ,onValue, remove,update} from "firebase/database";
import ScrollToBottom from 'react-scroll-to-bottom';
import { getStorage, ref as iref, uploadBytes,getDownloadURL } from "firebase/storage";
import moment from 'moment/moment';



const NewsFeed = () => {
  const db = getDatabase();
  const storage = getStorage();
  let [post,setPost]=useState([])
  let [postImg,setPostImg]=useState('')
  
  let [postModal,setPostModal]=useState(false)
  let [postSetting,setPostSetting]=useState(false)
  let [postEdit,setPostEdit]=useState(false)
  let [postEditModal,setPostEditModal]=useState(false)
  let [postdot,setPostDot]=useState([])
  let [postList,setPostList]=useState([])
  let [userInfolist, setUserInfoList] = useState([])
  let data=useSelector((state)=>state.userLoginInfo.userInfo)

  let postEditref=useRef()

  let handleMsg=(e)=>{
    setPost(e.target.value)
  }
  let handleMsgSend=()=>{
    if(!post){
      toast.error("Plase Write Something then Send ");
    }else{
      set(push(ref(db, 'post/')), {
        admin:data.displayName,
        adminid:data.uid,
        post:post,
        adminphoto:data.photoURL,
        date:`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}- ${new Date().getHours()}  ${new Date().getMinutes()}`  
      }).then(()=>{
        setPost('')
      })
    }

  }

  useEffect(()=>{
    const starCountRef = ref(db, 'post/');
    onValue(starCountRef, (snapshot) => {
     let arr=[]
     snapshot.forEach(item => {
      arr.push({...item.val(),id:item.key})
     });
     setPostList(arr)
    });
  },[])

  let handlePostPhotoFile=(e)=>{
    console.log(e.target.files[0])
    const storageRef = iref(storage, data.uid+data.displayName);
    uploadBytes(storageRef, e.target.files[0]).then((snapshot) => {
      getDownloadURL(storageRef).then((downloadURL) => {
        setPostImg(downloadURL)
      });
    });
  }

  let handlePostImgUpload=()=>{
    set(push(ref(db, 'post/')), {
      admin:data.displayName,
      adminid:data.uid,
      adminphoto:data.photoURL,
      post:post,
      postimg:postImg,
      date:`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}- ${new Date().getHours()}  ${new Date().getMinutes()}`  
    }).then(()=>{
      setPostModal(false)
    })
  }

  let handledot=(item)=>{
    if(data.uid==item.adminid){
      let arr=[]
      arr.push(item.adminid+item.id)
      setPostDot(arr)
      setPostSetting(true)
    }else{
      toast.error("Sorry You Are Not An Admin (: Can't Access!");
    }
    
  }

  let handlePostDelete=(item)=>{
      remove(ref(db, 'post/'+item.id))
  }
  let handlePostEdit=(item)=>{
      update(ref(db, 'post/'+item.id),{
        post:postEdit
      }).then(()=>{
        setPostEditModal(false)
      })
  }

  // useEffect(()=>{
  //   document.body.addEventListener('click',(e)=>{
  //     if(postEditref.current.contains(e.target)){
  //       setPostSetting(true)
  //     }else{
  //       setPostSetting(false)
  //     }
  //   })
  // },[])

  useEffect(() => {
    const starCountRef = ref(db, 'userInfo/');
    onValue(starCountRef, (snapshot) => {
        let arr = []
        snapshot.forEach((item) => {
                arr.push(item.val())
        })
        setUserInfoList(arr)
    });
}, [])
  return (
    <div className='mt-3 lg:mt-0 px-3 lg:px-0'>
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
        theme="light"
        />
      <div>
        <div className='w-full  '>
          <div className='flex gap-x-5 items-center relative w-full p-5 border border-solid rounded-md'>
            <div className='hidden lg:block w-[60px] h-[60px] rounded-full overflow-hidden '>
            <img className='w-full h-full' src={data.photoURL} alt="" />
            </div>
            <div className='w-full lg:w-[90%]'>
          <input onChange={handleMsg} value={post} className='w-full py-3 placeholder:font-primary lg:text-lg placeholder:text-[#D1D1D1] px-5 drop-shadow-lg rounded-full	' placeholder='What’s on your mind?' />
          <GrGallery onClick={()=>setPostModal(true)} className='absolute  bottom-9 lg:bottom-10 right-20 lg:text-lg' />
          <GrSend onClick={handleMsgSend} className='absolute lg:text-lg text-green-500 bottom-9 lg:bottom-10  right-10 ' />
            </div>
          </div>
         
        </div>
        <div>
          <h2 className='font-primary text-2xl font-bold text-primary mt-4'>NewsFeed</h2>
          <h4 className='font-primary text-lg font-medium mt-2'>Total Post : {postList.length}</h4>
          
        </div>
        <ScrollToBottom  className='w-full h-[450px] border border-solid rounded-md mt-5 px-4 overflow-y-auto'>
          {postList.map((item)=>(
          <div  className='border-b border-solid '>
            <div className='flex items-center gap-x-4 pt-14 pb-4 relative '>
              <img className='w-[60px] h-[60px] rounded-full overflow-hidden' src={item.adminphoto}/>
              <div>
                <h4 className='font-primary text-md lg:text-lg font-medium lg:font-bold text-primary '>{item.admin}</h4>
                {userInfolist.map((userItem)=>(
                  item.adminid==userItem.adminid
                  &&
                <p className='font-primary text-xs font-normal text-primary mt-1'>{userItem.title}</p>
                ))}

                <p className='font-primary font-normal text-xs mt-2 text-[#7B8FA1]'>{moment(item.date, "YYYYMMDD hhmm").fromNow()}</p>
              </div>
              <div    >
              <BsThreeDots onClick={()=>handledot(item)}  className='absolute top-[60px] lg:top-12 right-0' />
              {postdot.includes(item.adminid+item.id)&&
              postSetting&&
                   <div className='w-[200px] px-3 py-8 bg-white  shadow-md border border-solid absolute top-12 right-0 rounded-md  '>
                    <button onClick={()=>handlePostDelete(item)} className='w-full block bg-red-500 text-white rounded-md font-primary text-md py-2 border-b border-solid'>Delete</button>
                    <button onClick={()=>setPostEditModal(true)}  className='w-full block font-primary text-md py-2 border-b border-solid bg-primary rounded-md mt-2 text-white'>Edit</button>
                    <MdCloseFullscreen onClick={()=>setPostSetting(false)} className='text-lg text-red-500 absolute top-1 right-1 '/>

                   </div>
                }
                {postdot.includes(item.adminid+item.id)&&postSetting&&postEditModal&&
                    <div className='w-full lg:w-[300px] px-3 py-8 bg-white  shadow-md border border-solid absolute top-12 right-0 rounded-md  '>
                      <input onChange={(e)=>setPostEdit(e.target.value)} className='w-full py-2 px-1 border border-solid' type="text" defaultValue={item.post} />
                    <button onClick={()=>handlePostEdit(item)}  className='w-full block font-primary text-md py-2 border-b border-solid bg-primary rounded-md mt-2 text-white'>Edit</button>
                    <MdCloseFullscreen onClick={()=>setPostEditModal(false)} className='text-lg text-red-500 absolute top-1 right-1 '/>

                   </div>
                }
              </div>

            </div>
            <div className='mb-10 '>
              <h1 className='font-primary text-xl font-medium text-[#181818] mb-3'>{item.post}</h1>
              {item.postimg&&
              <img className='w-full h-[250px] object-cover	' src={item.postimg} />
              }
            </div>
          </div>
          ))}
        </ScrollToBottom>

      </div>
      {postModal&&
    <div className='w-full lg:h-screen bg-[rgba(0,0,0,.4)] absolute top-[60%] lg:top-0 left-0 z-50 lg:flex justify-center items-center'>
    <div className='w-full lg:w-1/4 p-5  bg-white rounded-2xl shadow-lg'>
      <h1 className='font-primary text-lg lg:text-2xl font-bold text-primary'>Post Title</h1>
      <input onChange={(e)=>setPost(e.target.value)} className='font-primary w-full py-2 border border-solid rounded-md border-primary  text-xl px-5 text-primary block mt-5 mb-5' type='input' placeholder='Headding'/>
      <input onChange={handlePostPhotoFile} className='font-primary text-md lg:text-xl text-primary block mt-5 mb-2 lg:mb-5 w-full' type='file'/>
      {postImg
      &&
      <img className='w-full h-[200px] '  src={postImg}/>
      }
      <button onClick={handlePostImgUpload} className='font-primary p-1 lg:py-3 lg:px-5 bg-primary rounded-bl-lg text-md lg:text-xl text-white  mt-5 inline-block'>Upload</button>
      <button onClick={()=>setPostModal(false)} className='font-primary p-1 lg:py-3 lg:px-5 bg-red-500 rounded-bl-lg text-md lg:text-xl text-white ml-2 lg:ml-5 mt-2 lg:mt-5 inline-block'>Cancel</button>
        
    </div>
    </div>
  }
    </div>
  )
}

export default NewsFeed