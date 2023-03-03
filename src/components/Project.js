import React, { useEffect, useState } from 'react'
import { MdOutlineCloudUpload ,MdOutlineCloseFullscreen} from 'react-icons/md'
import { getStorage, ref, uploadBytes,getDownloadURL } from "firebase/storage";
import { getDatabase, push, ref as dref, set ,onValue} from "firebase/database";
import { useSelector } from 'react-redux';


const Project = () => {
    const db = getDatabase();
    const storage = getStorage();
    let [projectModal,setProjectModal]=useState(false)
    let [porjectImg,setProjectImg]=useState(null)
    let [porjectList,setProjectList]=useState([])
    let data = useSelector((state) => state.userLoginInfo.userInfo)

    let handleProjectFile=(e)=>{
        const storageRef = ref(storage, e.target.files[0].name);
        uploadBytes(storageRef, e.target.files[0]).then((snapshot) => {
            getDownloadURL(storageRef).then((downloadURL) => {
                setProjectImg(downloadURL)
              });
        });
    }

    let handleUploadProject=()=>{
        set(push(dref(db, 'project/')), {
            admin:data.displayName,
            adminid:data.uid,
            porjectimg:porjectImg,
          }).then(()=>{
            setProjectModal(false)
          })
    }
    useEffect(()=>{
        const starCountRef = dref(db, 'project/');
        onValue(starCountRef, (snapshot) => {
        let arr=[]
        snapshot.forEach((item)=>{
        if(data.uid==item.val().adminid){
            arr.push({...item.val(),id:item.key})
        }
        })
        setProjectList(arr)
        });
    },[])
    return (
        <div className='mt-10 relative'>
            <div className='flex gap-x-5 items-center'>
                <h3 className='font-primary font-medium text-primary text-2xl mb-5'>Project</h3>
                <p className='font-primary font-normal text-[#747474] text-md mb-5'>3 of 12</p>
            </div>
            <div className='flex gap-x-2 flex-wrap'>
                <div class="flex justify-center w-[250px] h-[250px] ">
                        <div className='w-full h-[150px] relative group'>
                            <img className='w-full h-full' src='images/p1.png' alt="" />
                            <div className='w-full h-full group-hover:h-full bg-[rgba(0,0,0,.7)] absolute top-0 left-0 flex justify-center items-center ease-linear duration-300'>
                            <MdOutlineCloudUpload onClick={()=>setProjectModal(true)} className='text-3xl text-white ' />
                        </div>
                        <div class="mt-3">
                            <h5 class="text-xl font-medium mb-2 inline-block font-primary text-primary ">Upload Your Project</h5>
                          
                        </div>
                    </div>
                   
                </div>
                {porjectList.map((item)=>(
                <div class="flex justify-center w-[250px] h-[250px]">
                    <div className='w-full h-[150px] relative group'>
                            <img className='w-full h-full' src={item.porjectimg} alt="" />
                        </div>
                </div>

                ))}
            
            </div>
            {projectModal &&
            <div className='w-full h-full  bg-[rgba(0,0,0,.7)] absolute top-0 left-0 lg:flex justify-center items-center p-5'>
                <MdOutlineCloseFullscreen onClick={()=>setProjectModal(false)} className='text-red-500 text-3xl absolute top-3 right-3'/>
               <div>
               <h3 className='font-primary font-medium text-2xl text-white '>Upload Your Project </h3>
                <input onChange={handleProjectFile} className='font-primary mt-5 text-md lg:text-xl text-white block w-full' type="file"/>
                
                <img className='w-[100px] h-[70px]' src={porjectImg}/>
                <button onClick={handleUploadProject} className='font-primary mt-2 md:mt-5 text-md lg:text-xl text-white bg-primary p-1 md:p-2 rounded-md' >Upload</button>
               </div>
            </div>
        }
        </div>
    )
}

export default Project