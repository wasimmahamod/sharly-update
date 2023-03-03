import React,{useState} from 'react'
import Container from '../../components/Container'
import Navbar from '../../components/Navbar'
import Subprofile from '../../components/Subprofile'
import { FaUserEdit } from 'react-icons/fa'
import { FiLogOut } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { getAuth, signOut, updateProfile,onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {userLoginInfo} from '../../slices/userSlice'
import { useSelector } from 'react-redux'

const Setting = () => {
    const auth = getAuth();
    let dispatch=useDispatch()
    let navigate=useNavigate()
    let [nameChangeModal,setNameChangeModal]=useState(false)
    let [logOutModal,setLogoutModal]=useState(false)
    let [changeNameValue,setChangeNameValue]=useState('')
    let data=useSelector((state)=>state.userLoginInfo.userInfo)
    console.log(data)

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

      let handleNameChange=()=>{
        updateProfile(auth.currentUser, {
            displayName: changeNameValue,
          }).then(()=>{
            setNameChangeModal(false)
          })
      }
      onAuthStateChanged(auth, (user) => {
        dispatch(userLoginInfo(user))
        localStorage.setItem('userInfo', JSON.stringify(user))
    
      });
    return (
        <div>
            <Navbar active="setting" />
            <Container>
                <div className='lg:flex justify-between mt-10'>
                    <div className='w-full lg:w-[30%]'>
                        <Subprofile />
                    </div>
                    <div className='w-full lg:w-[65%]'>
                        <div className='p-5 border border-solid rounded-md w-full lg:w-[50%]'>
                            <div>
                            <div className='flex gap-x-3 items-center'>
                                <FaUserEdit className='text-2xl' />
                                <h2 className='font-primary text-xl font-medium'>Edit Profile Name</h2>
                            </div>
                            <button onClick={()=>setNameChangeModal(true)} className='font-primary py-2 px-3 bg-primary rounded-md text-md text-white  mt-5 '>Change</button>
                            </div>
                            <div className=' mt-5 bg-white rounded-bl-lg'>
                               <div className='flex items-center gap-x-3'>
                                <FiLogOut className='text-2xl'/>
                               <h1 className='font-primary text-xl font-medium '>LogOut </h1>
                               </div>
                               <div className='flex'>
                               <button onClick={()=>setLogoutModal(true)} className='font-primary py-2 px-3 bg-primary rounded-md text-md text-white  mt-5 '>LogOut</button>
                               
                               </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        {
            nameChangeModal&&
            <div className='w-full lg:h-screen bg-[rgba(0,0,0,.4)]  absolute top-2/4 lg:top-0 left-0 lg:flex justify-center items-center z-50'>
            <div className='bg-white w-full lg:w-1/4 p-5 rounded-lg shadow-lg '>
              <h1 className='font-primary font-medium text-xl mb-5'>Edit Name </h1>
                <input onChange={(e)=>setChangeNameValue(e.target.value)} className='font-primary w-full border border-solid p-2 mb-4' type="text" defaultValue={data.displayName}/>
              <button onClick={handleNameChange}  className='bg-primary text-sm font-primary p-2 text-white rounded-md'>Update</button>
              <button onClick={()=>setNameChangeModal(false)} className='bg-red-500 text-sm font-primary p-2 text-white rounded-md ml-2'>Cancle</button>
  
            </div>
          </div>
        }
        {
            logOutModal&&
            <div className='w-full lg:h-screen bg-[rgba(0,0,0,.4)]  absolute top-2/4 lg:top-0 left-0 lg:flex justify-center items-center z-50'>
            <div className='bg-white w-full lg:w-1/4 p-5 rounded-lg shadow-lg '>
              <h1 className='font-primary font-medium text-xl mb-5'>Are You Sure ? </h1>
              <button onClick={handleLogOut}  className='bg-primary text-sm font-primary p-2 text-white rounded-md'>Yes</button>
              <button onClick={()=>setLogoutModal(false)} className='bg-red-500 text-sm font-primary p-2 text-white rounded-md ml-2'>Cancle</button>
  
            </div>
          </div>
        }
        </div>
    )
}

export default Setting