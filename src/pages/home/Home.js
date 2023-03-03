import React, { useEffect, useState } from 'react'
import Container from '../../components/Container';
import Navbar from '../../components/Navbar';
import Subprofile from '../../components/Subprofile';
import UserList from './../../components/UserList';
import NewsFeed from './../../components/NewsFeed';
import Friendrequest from './../../components/Friendrequest'
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector} from 'react-redux'
import {userLoginInfo} from '../../slices/userSlice'


const Home = () => {
  const auth = getAuth();
  let navigate=useNavigate()
  let dispatch=useDispatch()
  let data=useSelector((state)=>state.userLoginInfo.userInfo)
  let [emailVerify,setEmailVerify]=useState(false)


  onAuthStateChanged(auth, (user) => {
    if (user.emailVerified) {
     setEmailVerify(true)
    }
    dispatch(userLoginInfo(user))
    localStorage.setItem('userInfo',JSON.stringify(user))

  });

  useEffect(()=>{
    if(!data){
      navigate('/login')
    }
  },[])
  return (

<>
{emailVerify?
<div>
<Navbar active='home'/>
<Container>
<div className='lg:flex gap-x-5 mt-5'>
<div className='w-full lg:w-[20%]'>
  <Subprofile/>

</div>
<div className='mt-2 flex justify-center gap-x-2 lg:hidden'>
  <button className='bg-primary p-2 rounded-md text-white font-primary'>Friend Request </button>
  <button className='bg-primary p-2 rounded-md text-white font-primary'>User List</button>
</div>
<div className='w-full lg:w-[45%]'>
  <NewsFeed/>
</div>
<div className='w-full lg:w-[30%]'>

 <UserList/>
  <Friendrequest/>
</div>
</div>
</Container>
</div>
:
<div className='absolute top-0 left-0 w-full h-full bg-primary flex justify-center items-center '>
<h2 className='font-primary text-2xl font-bold text-white'>Please Verify Your Email </h2>
</div>
}

</>
  )
}

export default Home