import React,{useEffect, useState} from 'react'
import {BsSearch,BsThreeDotsVertical} from 'react-icons/bs';
import { getDatabase, ref, onValue,set,push, remove} from "firebase/database";
import { useSelector } from 'react-redux';


const FriendRequest = () => {
  const db = getDatabase();
  let data=useSelector((state)=>state.userLoginInfo.userInfo)
  let [friendrequestList,setFriendRequestList]=useState([])
  useEffect(()=>{
    const starCountRef = ref(db, 'friendrequest/');
    onValue(starCountRef, (snapshot) => {
      let arr=[]
      snapshot.forEach((item)=>{
        if(data.uid!=item.val().senderid){
          arr.push({...item.val(),id:item.key})
        }
      })
      setFriendRequestList(arr)
    });
  },[])

  let handleFriendAccept=(item)=>{
    set(push(ref(db, 'friend/')), {
      ...item
    }).then(()=>{
      remove(ref(db, 'friendrequest/'+item.id))
    })
  }



  return (
    <div className=' relative shadow-lg	w-full p-5	'>
    <BsThreeDotsVertical className='absolute top-5 right-3 text-xl'/>
    <h2 className='font-primary font-semibold text-md mb-4'>Friend Request</h2>
    <div className='w-full h-[200px] overflow-y-scroll  '>

    {friendrequestList.map((item)=>(
      <div className='flex  w-full items-center gap-x-4  py-3.5 border-b '>
        <div className='w-[70px] h-[70px] rounded-full overflow-hidden '>
          <img src={item.senderimg} alt="" />
        </div>
      <div className='w-[50%]'>
      <h2 className='font-primary font-semibold text-md'>{item.sendername}</h2>
      <h2 className='font-primary font-normal text-sm'>Hi Guys, Wassup!</h2>
      </div>
        <div >
        <button onClick={()=>handleFriendAccept(item)} className='font-primary font-normal text-sm  p-2 rounded-br-xl ml-5 shadow-lg  text-white bg-primary'>Accept</button>
        </div>
    </div>
    ))}
    </div>
    </div>
  )
}

export default FriendRequest