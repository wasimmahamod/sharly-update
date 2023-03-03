import React from 'react'
import {AiOutlineHome,AiTwotoneSetting} from 'react-icons/ai'
import {CgProfile} from 'react-icons/cg'
import {BsMessenger} from 'react-icons/bs'
import {BiLogOut,BiHome,BiSearch} from 'react-icons/bi'
import { Link } from 'react-router-dom'
import Container from './Container'
const Navbar = ({active}) => {
  return (
      <div className='w-full py-3 px-5 lg:p-5 gap-x-5 shadow-md sticky top-0 left-0 bg-white z-50'>
    <Container>
        <div className='lg:flex lg:justify-between items-center'>
        <div className='lg:w-[10%]  flex lg:block justify-center  lg:mb-0 '>
            <img className='w-[60px]' src="images/logo.png" alt="" />
        </div>
        <div className='lg:w-[60%] flex justify-center mb-4 lg:mb-0'>
            <div className='flex gap-x-5'>
                <div className={active=='home'?"px-3 lg:px-5 relative after:bg-primary after:w-full after:h-1 after:absolute after:content-[''] after:bottom-[-10px] lg:after:bottom-[-23px] after:left-2/4 after:-translate-x-2/4 after:rounded-b-xl text-primary":'px-3 lg:px-5'} >
                <Link to='/home'>
                <div className='flex gap-x-2 items-center'>
                <AiOutlineHome className='text-2xl'/>
                <span className='font-primary text-md font-medium hidden lg:block'>Home</span>
                </div>
                </Link>
                </div>
                <div className={active=='profile'?"px-3 lg:px-5 relative after:bg-primary after:w-full after:h-1 after:absolute after:content-[''] after:bottom-[-10px] lg:after:bottom-[-23px] after:left-2/4 after:-translate-x-2/4 after:rounded-b-xl text-primary":'px-3 lg:px-5'}>
                <Link to='/profile'>
                <div className='flex gap-x-2 items-center'>
                <CgProfile className='text-2xl'/>
                <span className='font-primary text-md font-medium hidden lg:block'>Profile</span>
                </div>
                </Link>
                </div>
                <div className={active=='msg'?"px-3 lg:px-5 relative after:bg-primary after:w-full after:h-1 after:absolute after:content-[''] after:bottom-[-10px] lg:after:bottom-[-23px] after:left-2/4 after:-translate-x-2/4 after:rounded-b-xl text-primary":'px-3 lg:px-5'}>
                <Link to="/chat">
                <div className='flex gap-x-2 items-center'>
                <BsMessenger className='text-2xl'/>
                <span className='font-primary text-md font-medium hidden lg:block'>Message</span>
                </div>
                </Link>
                </div>
                <div className={active=='setting'?"px-3 lg:px-5 relative after:bg-primary after:w-full after:h-1 after:absolute after:content-[''] after:bottom-[-10px] lg:after:bottom-[-23px] after:left-2/4 after:-translate-x-2/4 after:rounded-b-xl text-primary":'px-3 lg:px-5'}>
                <Link to='/setting'>
                <div className='flex gap-x-2 items-center'>
                <AiTwotoneSetting className='text-2xl'/>
                <span className='font-primary text-md font-medium hidden lg:block'>Setting</span>
                </div>
                </Link>
                </div>
              
            </div>
        </div>
        <div className='lg:w-[15%]'>
            <div className='relative'>
        <input className='w-full rounded-full py-2 px-4  border border-solid' type="text" placeholder='Search' />
        <BiSearch className='text-xl absolute top-2.5 right-4'/>
            </div>
        </div>
        </div>
    </Container>
    </div>
  
  )
}

export default Navbar