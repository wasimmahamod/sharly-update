import React,{useEffect, useState} from 'react'
import {BsSearch,BsThreeDotsVertical} from 'react-icons/bs';
import { getDatabase, ref, onValue, remove,set,push} from "firebase/database";
import { useSelector } from 'react-redux';



const BlockList = () => {
  const db = getDatabase();
  let data=useSelector((state)=>state.userLoginInfo.userInfo)
  let [blockList,setBlockList]=useState([])
  useEffect(()=>{
    const starCountRef = ref(db, 'block/');
    onValue(starCountRef, (snapshot) => {
      let arr=[]
      snapshot.forEach((item)=>{
        if(data.uid==item.val().blockbyid){
          arr.push({
            block:item.val().block,
            blockid:item.val().blockid,
            blockimg:item.val().blockimg,
            id:item.key
          })
        }else if(data.uid==item.val().blockid){
          arr.push({
            blockby:item.val().blockby,
            blockbyid:item.val().blockbyid,
            blockbyimg:item.val().blockbyimg,
            id:item.key
          })
        }
      })
      setBlockList(arr)
    });
  },[])

  let handleUnblock=(item)=>{
    set(push(ref(db, 'friend/')), {
      sendername:item.block,
      senderid:item.blockid,
      senderimg:item.blockimg,
      recivername:data.displayName,
      reciverid:data.uid,
      reciverimg:data.photoURL,
    }).then(()=>{
      remove(ref(db, 'block/'))
    })
  }

  return (
    <div className=' relative shadow-lg	w-full p-5	'>
    <BsThreeDotsVertical className='absolute top-5 right-3 text-xl'/>
    <h2 className='font-primary font-semibold text-md mb-4'>Block List</h2>
    <div className='w-full h-[200px] overflow-y-scroll  '>

    {blockList.map((item)=>(
      <div className='flex  w-full items-center gap-x-4  py-3.5 border-b '>
        <div className='w-[70px] h-[70px] rounded-full overflow-hidden '>
          <img src={item.blockimg} alt="" />
          <img src={item.blockbyimg} alt="" />
        </div>
      <div className='w-[50%]'>
        <h2 className='font-primary font-semibold text-md'>{item.block}</h2>
        <h2 className='font-primary font-semibold text-md'>{item.blockby}</h2>
      <h2 className='font-primary font-normal text-sm'>Hi Guys, Wassup!</h2>
      </div>
        <div >
          {item.blockid
          &&
        <button onClick={()=>handleUnblock(item)} className='font-primary font-normal text-sm  p-2 rounded-br-xl ml-5 shadow-lg  text-white bg-primary'>Unblock</button>
          }
        </div>
    </div>
    ))}
    </div>
    </div>
  )
}

export default BlockList