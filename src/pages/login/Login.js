import React,{useState} from 'react'
import {MdError} from 'react-icons/md'
import {AiFillEyeInvisible,AiFillEye} from 'react-icons/ai'
import { Link } from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { ProgressBar } from  'react-loader-spinner'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import {userLoginInfo} from '../../slices/userSlice'

const Login = () => {
	const auth = getAuth();
    let navigate=useNavigate()
	let [email,setEmail]=useState('')
	let dispatch=useDispatch()
  let [password,setPassword]=useState('')
  let [emailerr,setEmailerr]=useState('')
  let [passworderr,setPassworderr]=useState('')
  let [passwordShow,setPasswordShow]=useState(false)
  let [loader,setLoader]=useState(false)

  let handleEmail=(e)=>{
    setEmail(e.target.value)
    setEmailerr('')
  }
  let handlePassword=(e)=>{
    setPassword(e.target.value)
    setPassworderr('')
  }
  let handleSubmit=()=>{
	if(!email){
		setEmailerr('Please Enter Your Email')
	  }
	  if(!password){
		setPassworderr('Please Enter Your Password')
	  }
	  if(email&& password){
		signInWithEmailAndPassword(auth, email, password)
		.then((user) => {
			console.log(user)
			toast.success("Login Successful ");
			setLoader(true)
			dispatch(userLoginInfo(user.user))
			localStorage.setItem('userInfo',JSON.stringify(user.user))
			setTimeout(() => {
				navigate('/home')
			}, 2000);
		})
		.catch((error) => {
		   if(error.code.includes('auth/wrong-password')){
			setPassworderr('Wrong Password')
		   }
		   if(error.code.includes('auth/invalid-email')){
			setEmailerr('Invalid Email')
		   }
		   if(error.code.includes('auth/user-not-found')){
			setEmailerr('Email Not Found Please Singup')
		   }
		});
	  }
  }
  return (
    <>
<div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
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
	<div class="relative py-3 sm:max-w-xl sm:mx-auto">
		<div
			class="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
		</div>
		<div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
			<div class="max-w-md mx-auto">
				<div>
				<h1 class="text-2xl font-semibold">LOGIN TO YOUR ACCOUNT </h1>
				</div>
				<div class="divide-y divide-gray-200">
					<div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
						<div class="relative">
							<input onChange={handleEmail} type="text" class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Email address" />
							{emailerr&&
							<div>
							<p className='text-red-500 font-primary text-sm mt-1'>
							{emailerr}</p>
							<MdError className='absolute top-3 right-0 text-red-500'/>
							</div>
							}
							<label for="email" class="absolute left-0 font-primary -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Email Address</label>
						</div>
						<div class="relative">
							<input onChange={handlePassword} type={passwordShow?'text':'password'} class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Password" />
							{passworderr&&
							<div>
							<p className='text-red-500 font-primary text-sm mt-1'>
							{passworderr}</p>
							<MdError className='absolute top-3 right-0 text-red-500'/>
							</div>
							}
							<label for="password" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 font-primary peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Password</label>
							{passwordShow ?
							<AiFillEye onClick={()=>setPasswordShow(!passwordShow)} className='absolute top-3 right-5 text-xl'/>
							:
							<AiFillEyeInvisible onClick={()=>setPasswordShow(!passwordShow)}  className='absolute top-3 right-5 text-xl'/>
							}
						</div>
						<div class="relative">
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
						<h3 className='font-primary text-lg text-red-500 cursor-pointer mt-2 '><Link to='/forgetpassword'>Forgot Password</Link> </h3>
						<p className='font-primary text-primary text-sm text-center mt-8 normal'>Don't   have an account ? <Link to='/'  className='text-[#EA6C00]'>Sign Up</Link></p> 
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
    </>
  )

}

export default Login