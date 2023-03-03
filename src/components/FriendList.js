import React,{useEffect, useState} from 'react'
import {BsSearch,BsThreeDotsVertical} from 'react-icons/bs';
import { getDatabase, ref, onValue, remove,set,push,} from "firebase/database";
import { useSelector } from 'react-redux';



const FriendList = () => {
  const db = getDatabase();
  let data=useSelector((state)=>state.userLoginInfo.userInfo)
  let [friendList,setFriendlist]=useState([])
  useEffect(()=>{
    const starCountRef = ref(db, 'friend/');
    onValue(starCountRef, (snapshot) => {
      let arr=[]
      snapshot.forEach((item)=>{
        if(data.uid==item.val().senderid||data.uid==item.val().reciverid){
          arr.push({...item.val(),id:item.key})
        }
      })
      setFriendlist(arr)
    });
  },[])

  let handleBlock=(item)=>{
    console.log(item)
    if(data.uid==item.senderid){
      set(push(ref(db, 'block/')), {
        block:item.recivername,
        blockid:item.reciverid,
        blockimg:item.reciverimg,
        blockby:item.sendername,
        blockbyid:item.senderid,
        blockbyimg:item.senderimg,
      }).then(()=>{
        remove(ref(db, 'friend/'+item.id))
      })
    }else if(data.uid==item.reciverid){
      set(push(ref(db, 'block/')), {
        blockby:item.recivername,
        blockbyid:item.reciverid,
        blockbyimg:item.reciverimg,
        block:item.sendername,
        blockid:item.senderid,
        blockimg:item.senderimg,
      }).then(()=>{
        remove(ref(db, 'friend/'+item.id))
      })
    }
  }

  return (
    <div className=' relative shadow-lg	w-full p-5	'>
    <BsThreeDotsVertical className='absolute top-5 right-3 text-xl'/>
    <h2 className='font-primary font-semibold text-md mb-4'>Friend List</h2>
    <div className='w-full h-[200px] overflow-y-scroll  '>

    {friendList.map((item)=>(
      <div className='flex  w-full items-center gap-x-4  py-3.5 border-b '>
        <div className='w-[70px] h-[70px] rounded-full overflow-hidden '>
          {data.uid==item.senderid
          ?
          <img src={item.reciverimg} alt="" />
          :
          <img src={item.senderimg} alt="" />
          }
        </div>
      <div className='w-[50%]'>
        {data.uid==item.senderid
        ?
        <h2 className='font-primary font-semibold text-md'>{item.recivername}</h2>
        :
        <h2 className='font-primary font-semibold text-md'>{item.sendername}</h2>
        }
      <h2 className='font-primary font-normal text-sm'>Hi Guys, Wassup!</h2>
      </div>
        <div >
        <button onClick={()=>handleBlock(item)} className='font-primary font-normal text-sm  p-2 rounded-br-xl ml-5 shadow-lg  text-white bg-primary	'>Block</button>
        </div>
    </div>
    ))}
    </div>
    </div>
  )
}

export default FriendList