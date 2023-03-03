import React, { useState } from 'react'
import {MdError} from 'react-icons/md'
import {AiFillEyeInvisible,AiFillEye} from 'react-icons/ai'
import { getAuth, createUserWithEmailAndPassword,sendEmailVerification ,updateProfile  } from "firebase/auth";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ProgressBar } from  'react-loader-spinner'
import { getDatabase, ref, set ,push} from "firebase/database";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Singup = () => {
  const auth = getAuth();
  let navigate=useNavigate()
  const db = getDatabase();
  let [email,setEmail]=useState('')
  let [name,setName]=useState('')
  let [password,setPassword]=useState('')
  let [emailerr,setEmailerr]=useState('')
  let [nameerr,setNameerr]=useState('')
  let [passworderr,setPassworderr]=useState('')
  let [passwordShow,setPasswordShow]=useState(false)
  let [loader,setLoader]=useState(false)
  let handleEmail=(e)=>{
    setEmail(e.target.value)
    setEmailerr('')
  }
  let handleName=(e)=>{
    setName(e.target.value)
    setNameerr('')
  }
  let handlePassword=(e)=>{
    setPassword(e.target.value)
    setPassworderr('')
  }
  let handleSubmit=()=>{
    if(!email){
      setEmailerr('Please Enter Your Email')
    }else if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
      setEmailerr('Invalid Email')
    }
     if(!name){
      setNameerr('Please Enter Your Name')
    }
    var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if(!password){
      setPassworderr('Please Enter Your Password')
    }else if(!password.match(passw)){
      setPassworderr('Plase Enter a Strong Password')
    }
  

    if(email&&name&&password&&/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)&&password.match(passw)){
      createUserWithEmailAndPassword(auth, email, password)
      .then((user) => {
          sendEmailVerification(auth.currentUser)
          .then(() => {
              updateProfile(auth.currentUser, {
                  displayName: name, photoURL: 'images/user.jpg'
                }).then(() => {
                  toast.success("Registration Successful ");
                  setLoader(true)
                  setEmail('')
                  setPassword('')
                  setName('')
                  setTimeout(() => {
                      navigate('/form')
                      
                  }, 2000);
                  
                  set(ref(db, 'user/'+user.user.uid), {
                      name:name,
                      email:email,
                      img:'images/user.jpg',
                    })
                }).then(()=>{
                  setName('')
                  setPassword('')
                  setEmail('')
                })
                .catch((error) => {
                  console.log(error.code)
                });
             
          });
      })
      .catch((error) => {
          if(error.code.includes('auth/email-already-in-use')){
              setEmailerr('Email Already In use')
          }
          console.log(error.code)
      });
    }

  }

  return (
    <>
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
    <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            />
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div
          className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
        </div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-xl mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">Create and account</h1>
              
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="relative">
                  <input onChange={handleEmail} type="email" value={email} className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Email address" />
                  {emailerr&&
                  <div>
                  <p className='text-red-500 font-primary text-sm mt-1'>
                  {emailerr}</p>
                  <MdError className='absolute top-3 right-0 text-red-500'/>
                  </div>
                  }
                  <label for="email" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 font-primary peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Email Address</label>
                </div>
                <div className="relative">
                  <input onChange={handleName}  value={name} type="text" className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Email address" />
                  {nameerr&&
                   <div>
                   <p className='text-red-500 font-primary text-sm mt-1'>
                   {nameerr}</p>
                   <MdError className='absolute top-3 right-0 text-red-500'/>
                   </div>
                  }
                  <label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base font-primary peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Name</label>
                </div>
                <div className="relative">
                  <input onChange={handlePassword} value={password} type={passwordShow?'text':'password'} className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Password" />
                  {passworderr&&
                   <div>
                   <p className='text-red-500 font-primary text-sm mt-1'>
                   {passworderr}</p>
                   <MdError className='absolute top-3 right-0 text-red-500'/>
                   </div>
                  }
                  <label for="password" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 font-primary peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Password</label>
                  {passwordShow ?
                  <AiFillEye onClick={()=>setPasswordShow(!passwordShow)} className='absolute top-3 right-4 text-xl'/>
                  :
                  <AiFillEyeInvisible onClick={()=>setPasswordShow(!passwordShow)}  className='absolute top-3 right-4 text-xl'/>
                  }
                </div>
                <div className="relative">
                  {loader
                  ?
                  <ProgressBar
                  height="80"
                  width="80"
                  ariaLabel="progress-bar-loading"
                  wrapperStyle={{}}
                  wrapperClass="progress-bar-wrapper"
                  borderColor = 'blue'
                  barColor = 'green'
                  />
                  :
                  <button onClick={handleSubmit} className="bg-blue-500 text-white rounded-md px-2 py-1">Submit</button>
                   }
                 
                </div>
                <p className='font-primary text-primary text-sm text-center mt-8 normal'>Already  have an account ? <Link to='/login'  className='text-[#EA6C00]'>Sign In</Link></p> 
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
        </>
  )
}

export default Singup