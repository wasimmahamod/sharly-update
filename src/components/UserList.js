import React,{useEffect, useState} from 'react'
import {BsSearch,BsThreeDotsVertical} from 'react-icons/bs';
import { getDatabase, ref, onValue,set,push} from "firebase/database";
import { useSelector } from 'react-redux';


const UserList = () => {
  const db = getDatabase();
  let data=useSelector((state)=>state.userLoginInfo.userInfo)
  let [userList,setUserList]=useState([])
  let [friendRequestList,setFriendRequestList]=useState([])
  let [friendList,setFriendList]=useState([])
  let [filterUserList,setFilterUserlist]=useState([])
  useEffect(()=>{
    const starCountRef = ref(db, 'user/');
    onValue(starCountRef, (snapshot) => {
      let arr=[]
      snapshot.forEach((item)=>{
        if(data.uid!=item.key){

          arr.push({...item.val(),id:item.key})
        }
      })
      setUserList(arr)
    });
  },[])

  let handleFriendRequest=(item)=>{
    set(push(ref(db, 'friendrequest/')), {
      sendername:data.displayName,
      senderid:data.uid,
      senderimg:data.photoURL,
      recivername:item.name,
      reciverid:item.id,
      reciverimg:item.img,
    })
  }

  useEffect(()=>{
    const starCountRef = ref(db, 'friendrequest/');
    onValue(starCountRef, (snapshot) => {
      let arr=[]
      snapshot.forEach((item)=>{
          arr.push(item.val().senderid+item.val().reciverid)
      })
      setFriendRequestList(arr)
    });
  },[])
  useEffect(()=>{
    const starCountRef = ref(db, 'friend/');
    onValue(starCountRef, (snapshot) => {
      let arr=[]
      snapshot.forEach((item)=>{
          arr.push(item.val().senderid+item.val().reciverid)
      })
      setFriendList(arr)
    });
  },[])

  let handleSearch=(e)=>{
    let arr=[]
  userList.filter((item)=>{
    if(item.name.toLowerCase().includes(e.target.value.toLowerCase())){
      arr.push(item)
    }
    setFilterUserlist(arr)
    })
    
  }
  return (
    <div className=' relative shadow-lg	w-full p-5	'>
    <BsThreeDotsVertical className='absolute top-5 right-3 text-xl'/>
    <h2 className='font-primary font-semibold text-md mb-4'>Add to your feed</h2>
    <input onChange={handleSearch} className='w-full rounded-xl py-2 pl-5 placeholder:font-primary text-base drop-shadow-lg	' type="text" placeholder='Search'/>
    <div className='w-full h-[200px] overflow-y-scroll  '>
    {filterUserList.length==0?
    userList.map((item)=>(
      <div className='flex  w-full items-center gap-x-4  py-3.5 border-b '>
        <div className='w-[70px] h-[70px] rounded-full overflow-hidden '>
          <img src={item.img} alt="" />
        </div>
      <div className='w-[50%]'>
      <h2 className='font-primary font-semibold text-md'>{item.name}</h2>
      <h2 className='font-primary font-normal text-sm'>Hi Guys, Wassup!</h2>
      </div>
        <div >
        {friendList.includes(data.uid+item.id)||friendList.includes(item.id+data.uid)
        ?
        <button className='font-primary font-normal text-sm  p-2 rounded-br-xl ml-5 shadow-lg  text-white bg-primary'>F</button>
        :
        friendRequestList.includes(data.uid+item.id)||friendRequestList.includes(item.id+data.uid)
        ?
        <button className='font-primary font-normal text-sm  p-2 rounded-br-xl ml-5 shadow-lg  text-white bg-primary'>P</button>
        :
        <button onClick={()=>handleFriendRequest(item)} className='font-primary font-normal text-sm  p-2 rounded-br-xl ml-5 shadow-lg  text-white bg-primary'>Add</button>
        }
        {
        }
        </div>
    </div>
    )):
    filterUserList.map((item)=>(
      <div className='flex  w-full items-center gap-x-4  py-3.5 border-b '>
        <div className='w-[70px] h-[70px] rounded-full overflow-hidden '>
          <img src={item.img} alt="" />
        </div>
      <div className='w-[50%]'>
      <h2 className='font-primary font-semibold text-md'>{item.name}</h2>
      <h2 className='font-primary font-normal text-sm'>Hi Guys, Wassup!</h2>
      </div>
        <div >
        {friendList.includes(data.uid+item.id)||friendList.includes(item.id+data.uid)
        ?
        <button className='font-primary font-normal text-sm  p-2 rounded-br-xl ml-5 shadow-lg  text-white bg-primary'>F</button>
        :
        friendRequestList.includes(data.uid+item.id)||friendRequestList.includes(item.id+data.uid)
        ?
        <button className='font-primary font-normal text-sm  p-2 rounded-br-xl ml-5 shadow-lg  text-white bg-primary'>P</button>
        :
        <button onClick={()=>handleFriendRequest(item)} className='font-primary font-normal text-sm  p-2 rounded-br-xl ml-5 shadow-lg  text-white bg-primary'>Add</button>
        }
        {
        }
        </div>
    </div>
    ))
    }

    </div>
    </div>
  )
}

export default UserList