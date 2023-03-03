import React, { useState, useEffect } from 'react'
import { getDatabase, ref, onValue, set, update } from "firebase/database";
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment/moment';
import { BsThreeDots } from 'react-icons/bs'

const MyPost = () => {
    let data = useSelector((state) => state.userLoginInfo.userInfo)
    const db = getDatabase();
    let [postlist, setPostList] = useState([])
    let [userInfolist, setUserInfoList] = useState([])

    useEffect(() => {
        const starCountRef = ref(db, 'post/');
        onValue(starCountRef, (snapshot) => {
            let arr = []
            snapshot.forEach((item) => {
                if (data.uid == item.val().adminid) {
                    arr.push(item.val())
                }
            })
            setPostList(arr)
        });
    }, [])
    useEffect(() => {
        const starCountRef = ref(db, 'userInfo/');
        onValue(starCountRef, (snapshot) => {
            let arr = []
            snapshot.forEach((item) => {
                if (data.uid == item.val().adminid) {
                    arr.push(item.val())
                }
            })
            setUserInfoList(arr)
        });
    }, [])
    return (
        <div>
              <h2 className='font-primary text-2xl font-bold text-primary mt-4'>My Profile</h2>
          <h4 className='font-primary text-lg font-medium mt-2 mb-4'>Total Post : {postlist.length}</h4>
            <div className='h-[300px] overflow-y-scroll border border-solid p-3'>
                {postlist.length == 0
                    ?
                    <h3 className='bg-red-500 text-white font-bold text-xl font-primary px-5 py-2'>No Post Available</h3>
                    :
                    postlist.map((item) => (
                        <div className='border-b border-solid'>
                            <div className='flex items-center gap-x-4 pt-8 pb-4 relative '>
                                <img className='w-[60px] h-[60px] rounded-full overflow-hidden' src={data.photoURL} />
                                <div>
                                    <h4 className='font-primary text-lg font-medium text-primary '>{item.admin}</h4>
                                    {userInfolist.map((item)=>(

                                    <p className='font-primary text-xs font-normal text-primary '>{item.title}</p>
                                    ))}

                                    <p className='font-primary font-normal text-xs mt-2 text-[#7B8FA1]'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
                                </div>
                                <BsThreeDots className='absolute top-8 right-0' />
                            </div>
                            <div className='mb-5'>
                                <h1 className='font-primary text-xl font-medium text-[#181818] mb-3'>{item.post}</h1>
                                {item.postimg &&
                                    <img className=' h-[250px] object-cover	' src={item.postimg} />
                                }
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default MyPost