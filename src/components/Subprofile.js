import React,{useState,useEffect} from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { getDatabase, ref, onValue} from "firebase/database";



const Subprofile = () => {
  const db = getDatabase();
  let data=useSelector((state)=>state.userLoginInfo.userInfo)
  let [userInfoList,setUserInfoList]=useState([])
  let [coverList,setCoverList]=useState([])


  useEffect(()=>{
    const starCountRef = ref(db, 'userInfo/');
    onValue(starCountRef, (snapshot) => {
      let arr=[]
      snapshot.forEach((item)=>{
        if(data.uid==item.val().adminid){
          arr.push({...item.val(),id:item.key})
        }
      })
      setUserInfoList(arr)
    });
  },[])

  useEffect(()=>{
    const starCountRef = ref(db, 'cover/');
    onValue(starCountRef, (snapshot) => {
      let arr=[]
      snapshot.forEach((item)=>{
        if(data.uid==item.key){
          arr.push({...item.val(),id:item.key})
        }
      })
      setCoverList(arr)
    });
  },[])
  return (
    <div className='w-full border border-solid   rounded-md  pb-5'>
        {/* cover photo */}
    <div>
      {coverList.map((item)=>(
        <img className='w-full h-30 rounded-md' src={item.coverimg} alt="" />
      ))}

    </div>
    {/* profile photo */}
    <div>
        <img className='w-[70px] h-[70px] mt-[-40px] rounded-full overflow-hidden mx-auto ' src={data.photoURL} alt="" />
    </div>
    <div className='text-center'>
      
        <h3 className=' font-medium text-xl  font-primary'>
        <Link to='/profile'>
          {data.displayName}
        </Link>
          </h3>
          {userInfoList.map((item)=>(
        <h5 className='font-normal text-sm  font-primary mt-2'> {item.title}</h5>
          ))}
          <Link to='/profile'>
          <button className='hidden md:block w-full font-primary text-md font-medium text-whtie bg-primary text-white  py-2 rounded-md mt-3 '>
            My Profile</button>
          </Link>
    </div>

    </div>
  )
}

export default Subprofile