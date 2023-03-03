import React from 'react'
import { useDispatch } from 'react-redux'
import {userLoginInfo} from '../../slices/userSlice'
import { useNavigate } from 'react-router-dom'
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';


const Logout = () => {
    const auth = getAuth();
    let dispatch=useDispatch()
    let navigate=useNavigate()


    let handleLogOut=()=>{
        signOut(auth)
        .then(() => {
          navigate('/login')
          dispatch(userLoginInfo(null))
          localStorage.removeItem('userInfo')
        })
        .catch((error) => {
          console.log(error)
        });
      
         
      }
  return (
    <>
    <Navbar active='logout'/>
    <div className=' bg-primary w-full h-screen z-50 flex justify-center items-center'>
    <div className='lg:w-3/12 p-10 bg-white rounded-bl-lg'>
      <h1 className='font-nunito text-2xl font-bold text-primary'>LogOut </h1>
      <button onClick={handleLogOut} className='font-nunito py-3 px-5 bg-primary rounded-bl-lg text-xl text-white  mt-5 inline-block'>LogOut</button>
      <button  className='font-nunito py-3 px-5 bg-red-500 rounded-bl-lg text-xl text-white ml-5  mt-5 inline-block'>
        <Link to='/home'>Cancel</Link>
      </button>
    </div>
  </div>
    </>
  )
}

export default Logout