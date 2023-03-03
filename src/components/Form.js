import React, { useState } from 'react'
import { getDatabase, ref, set ,push} from "firebase/database";
import { Link, useNavigate } from 'react-router-dom';
import { ProgressBar } from  'react-loader-spinner'
import { getAuth } from 'firebase/auth';

const From = () => {
  const auth = getAuth();
  const db = getDatabase();
  let navigate=useNavigate()
  console.log(auth.currentUser)
  let [phoneNumber,setPhoneNumber]=useState('')
  let [title,setTitle]=useState('')
  let [addres,setAddres]=useState('')
  let [about,setAbout]=useState('')
  let [experience,setExperience]=useState('')
  let [experienceTitle,setExperienceTitle]=useState('')
  let [degree,setDegree]=useState('')
  let [schoolName,setSchollName]=useState('')
  let [loader,setLoader]=useState(false)

  let handleTitle=(e)=>{
    setTitle(e.target.value)
  }
  let handleAddres=(e)=>{
    setAddres(e.target.value)
  }
  let handleSubmit=(e)=>{
    e.preventDefault()
    set(push(ref(db, 'userInfo/')), {
      admin:auth.currentUser.displayName,
      adminid:auth.currentUser.uid,
      email: auth.currentUser.email,
      title : title,
      addres:addres,
      about:about,
      experience:experience,
      experienceTitle:experienceTitle,
      degree:degree,
      schoolName:schoolName,
      phone:phoneNumber,
    }).then(()=>{
      setLoader(true)
      setTitle('')
      setAddres('')
      setTimeout(() => {
        navigate('/login')
        
    }, 2000);

    })
  }
  return (
    <div>
        <form class="px-4 rounded mx-auto max-w-3xl w-full  inputs space-y-6">
      <div>
        <h1 class="text-2xl font-primary text-primary font-bold">Profile Setup </h1>
        <p class="text-gray-600 text-sm font-primary ">
          Changes you make will be visible to other users
        </p>
      </div>
      <div>
        <div class="w-full mt-3">
          <label className="font-primary text-md" >Phone Number</label>
          <input onChange={(e)=>setPhoneNumber(e.target.value)} class="border border-gray-400 px-4 py-2 rounded w-full focus:outline-none focus:border-teal-400" type='number'/>
        </div>
        <div class="w-full mt-2">
          <label className="font-primary text-md" for="firstname">Profile Title</label>
          <input onChange={handleTitle} class="border border-gray-400 px-4 py-2 rounded w-full focus:outline-none focus:border-teal-400"/>
        </div>
        <div class="w-full mt-2">
          <label className="font-primary text-md" >Addres</label>
          <input onChange={handleAddres} class="border border-gray-400 px-4 py-2 rounded w-full focus:outline-none focus:border-teal-400"/>
        </div>
        <div class="w-full mt-2">
          <label className="font-primary text-md" >About </label>
          <input onChange={(e)=>setAbout(e.target.value)} class="border border-gray-400 px-4 py-2 rounded w-full focus:outline-none focus:border-teal-400"/>
        </div>
        <div className='flex gap-x-2'>
        <div class="w-2/4 mt-2">
          <label className="font-primary text-md" >Experience </label>
          <input onChange={(e)=>setExperience(e.target.value)} class="border border-gray-400 px-4 py-2 rounded w-full focus:outline-none focus:border-teal-400"/>
        </div>
        <div class="w-2/4 mt-2">
          <label className="font-primary text-md" >Experience Title </label>
          <input onChange={(e)=>setExperienceTitle(e.target.value)} class="border border-gray-400 px-4 py-2 rounded w-full focus:outline-none focus:border-teal-400"/>
        </div>
        </div>
        <div className='flex gap-x-2'>
        <div class="w-2/4 mt-2">
          <label className="font-primary text-md" >Degree </label>
          <input onChange={(e)=>setDegree(e.target.value)} class="border border-gray-400 px-4 py-2 rounded w-full focus:outline-none focus:border-teal-400"/>
        </div>
        <div class="w-2/4 mt-2">
          <label className="font-primary text-md" >School/Collage Name </label>
          <input onChange={(e)=>setSchollName(e.target.value)} class="border border-gray-400 px-4 py-2 rounded w-full focus:outline-none focus:border-teal-400"/>
        </div>
        </div>
      </div>
      {loader ?
      <div className=''>
      <ProgressBar
          height="80"
          width="80"
          ariaLabel="progress-bar-loading"
          wrapperStyle={{}}
          wrapperClass="progress-bar-wrapper"
          borderColor = 'blue'
          barColor = 'green'
          />
      </div>
      :
      <button onClick={handleSubmit} className='bg-primary px-5 py-3 text-white rounded-md'>Submit</button>
      }
       <button  className='bg-blue-500 px-5 py-3 text-white rounded-md ml-3'>
        <Link to='/login'>Skip</Link>
        </button>
 
    </form>
    </div>
  )
}

export default From