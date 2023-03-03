import React,{useEffect, useState} from 'react'
import {BsSearch,BsThreeDotsVertical} from 'react-icons/bs';
import { getDatabase, ref, onValue, remove,set,push,} from "firebase/database";
import { useSelector,useDispatch } from 'react-redux';
import { chatUserInfo } from '../slices/chatSlice';



const FriendMsg = () => {
  const db = getDatabase();
  let dispatch=useDispatch()
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

  let handleActiveMsg=(item)=>{
    console.log(item)
    if(data.uid==item.senderid){
      dispatch(chatUserInfo({
        name:item.recivername,img:item.reciverimg,status:'single',id:item.reciverid,
      }))
      localStorage.setItem('chatData',JSON.stringify({
        name:item.recivername,img:item.reciverimg,status:'single',id:item.reciverid,
      }))
    }else if(data.uid==item.reciverid){
      dispatch(chatUserInfo({
        name:item.sendername,img:item.senderimg,status:'single',id:item.senderid,
      }))
      localStorage.setItem('chatData',JSON.stringify({
        name:item.sendername,img:item.senderimg,status:'single',id:item.senderid,
      }))
    }
  }
  return (
    <div className=' relative shadow-lg	w-full p-5	'>
    <BsThreeDotsVertical className='absolute top-5 right-3 text-xl'/>
    <h2 className='font-primary font-semibold text-md mb-4'>Friend List</h2>
    <div className='w-full h-[200px] overflow-y-scroll  '>

    {friendList.map((item)=>(
      <div onClick={()=>handleActiveMsg(item)} className='flex  w-full items-center gap-x-4  py-3.5 border-b '>
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
        <button  className='font-primary font-normal text-sm  p-2 rounded-br-xl ml-5 shadow-lg  text-white bg-primary	'>Msg</button>
        </div>
    </div>
    ))}
    </div>
    </div>
  )
}

export default FriendMsg