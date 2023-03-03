import React, { useState, useEffect } from 'react'
import { ImRocket } from 'react-icons/im'

import Navbar from '../../components/Navbar'
import Container from '../../components/Container'
import { BsThreeDots } from 'react-icons/bs'
import { BiEdit } from 'react-icons/bi'
import { GrClose } from 'react-icons/gr'
import { MdOutlineCloseFullscreen } from 'react-icons/md'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { FiEdit } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { userLoginInfo } from '../../slices/userSlice'
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { getDatabase, ref, set, onValue, push, update } from "firebase/database";
import { getStorage, ref as iref, uploadString, getDownloadURL } from "firebase/storage";
import ProfilePhoto from '../../components/ProfilePhoto'
import Subprofile from '../../components/Subprofile'
import Project from './../../components/Project';
import FriendList from './../../components/FriendList'
import BlockList from './../../components/Blocklist'
import MyPost from '../../components/MyPost'
import { Rings } from 'react-loader-spinner'

const Profile = () => {
  const auth = getAuth();
  const db = getDatabase();
  let navigate = useNavigate()
  let dispatch = useDispatch()
  const storage = getStorage();
  let data = useSelector((state) => state.userLoginInfo.userInfo)
  let [coverModalShow, setCoverModalShow] = useState(false)
  let [profileModalShow, setProfileModalShow] = useState(false)
  let [editTitleModal, seteditTitleModal] = useState(false)
  let [editEpModal, seteditEpModal] = useState(false)
  let [editEduModal, seteditEduModal] = useState(false)
  let [contactModal, setContactModal] = useState(false)
  let [aboutModal, setAboutModal] = useState(false)
  let [contactShow, setContactShow] = useState(false)
  let [titleEdit, setTitleEdit] = useState('')
  let [expEdit, setexpEdit] = useState('')
  let [phoneedit, setPhoneEdit] = useState('')
  let [emailEdit, setEmailEdit] = useState('')
  let [expTitleEdit, setexpTitleEdit] = useState('')
  let [eduEdit, seteduEdit] = useState('')
  let [eduSchoolEdit, seteduSchoolEdit] = useState('')
  let [bioEdit, setBioEdit] = useState('')
  let [CoverImg, setCoverImg] = useState(null)
  let [id, setId] = useState('')
  let [editProfile, setEditProfile] = useState(false)
  const [image, setImage] = useState('');
  const [cropData, setCropData] = useState("");
  const [cropper, setCropper] = useState('');

  const [coverList, setCoverList] = useState([]);
  const [userInfoList, setUserInfoList] = useState([]);
  let [loader, setLoader] = useState(false)
  let [emailVerify, setEmailverify] = useState(false)



  useEffect(() => {
    if (!data) {
      navigate('/login')
    }
  }, [])

  useEffect(() => {
    if (data.emailVerified == true) {
      setEmailverify(true)
    }
  }, [])
  onAuthStateChanged(auth, (user) => {
    dispatch(userLoginInfo(user))
    localStorage.setItem('userInfo', JSON.stringify(user))

  });



  const onChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    setLoader(true)
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());
      const storageRef = iref(storage, data.uid + 1);
      const message4 = cropper.getCroppedCanvas().toDataURL();
      uploadString(storageRef, message4, 'data_url').then((snapshot) => {
        getDownloadURL(storageRef).then((downloadURL) => {
          set(ref(db, 'cover/' + data.uid), {
            coverimg: downloadURL
          }).then(() => {
            set(push(ref(db, 'post/')), {
              admin: data.displayName,
              adminid: data.uid,
              adminphoto: data.photoURL,
              post: "Cover Update",
              postimg: downloadURL,
              date: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}- ${new Date().getHours()}  ${new Date().getMinutes()}`
            })
            setLoader(false)
            setCoverModalShow(false)
          })
        })
      })
    }
  };




  useEffect(() => {
    const starCountRef = ref(db, 'cover/');
    onValue(starCountRef, (snapshot) => {
      let arr = []
      snapshot.forEach((item) => {
        if (data.uid == item.key) {
          arr.push({ ...item.val(), id: item.key })
        }
      })
      setCoverList(arr)
    });
  }, [])
  useEffect(() => {
    const starCountRef = ref(db, 'userInfo/');
    onValue(starCountRef, (snapshot) => {
      let arr = []
      snapshot.forEach((item) => {
        if (data.uid == item.val().adminid) {
          arr.push({ ...item.val(), id: item.key })
        }
      })
      setUserInfoList(arr)
    });
  }, [])

  let handleTitleEdit = () => {
    update(ref(db, 'userInfo/' + id), {
      title: titleEdit
    }).then(() => {
      seteditTitleModal(false)
    })

  }
  let handleEPModal = (item) => {
    seteditEpModal(true)
  }
  let handleExpEdit = () => {
    update(ref(db, 'userInfo/' + id), {
      experience: expEdit,
      experienceTitle: expTitleEdit,

    }).then(() => {
      seteditEpModal(false)
    })
  }
  let handleEduModal = () => {
    seteditEduModal(true)
  }
  let handleduEdit = (item) => {
    update(ref(db, 'userInfo/' + id), {
      schoolName: eduEdit,
      degree: eduSchoolEdit,
    }).then(() => {
      seteditEduModal(false)
    })
  }
  let handleContactEdit = (item) => {
    update(ref(db, 'userInfo/' + id), {
      phone: phoneedit,
      email: emailEdit,
    }).then(() => {
      setContactModal(false)
    })
  }
  let handleBioEdit = (item) => {
    update(ref(db, 'userInfo/' + id), {
      about: bioEdit,
    }).then(() => {
      setAboutModal(false)
    })
  }

  let handleEditProfile = (item) => {
    setEditProfile(true)
    setId(item.id)
  }

  return (
    <div>
      {emailVerify
        ?
        <>
          <div className='px-2'>
            <Navbar active='profile' />
            <Container>
              <div className='lg:flex gap-x-5  mt-3'>
                <div className='w-full lg:w-[70%] '>
                  <div className=' relative'>
                    <div className='w-full  lg:h-[180px]'>
                      {coverList.map((item) => (
                        <img className='w-full h-full ' src={item.coverimg} />
                      ))}
                      {coverList.length == 0 &&
                        <img className='w-full h-full' src='images/profilecover.png' />
                      }
                    </div>
                    <div onClick={() => setCoverModalShow(true)} className='w-[130px] group h-[36px] hover:bg-primary hover:text-white bg-white rounded-md absolute top-5 right-5  ease-in-out duration-300 flex justify-center items-center cursor-pointer'>
                      <span className='flex font-primary text-sm items-center gap-x-2'>Edit Cover
                        <FiEdit className='text-black text-xl group-hover:text-white  group-hover:block ease-in-out duration-300' />
                      </span>
                    </div>
                  </div>
                  {/* profile and cover start */}
                  <div className='flex flex-wrap justify-between gap-x-5'>
                    <div className='mt-[-20px] lg:mt-0'>
                      <ProfilePhoto />

                    </div>
                    <div className='w-full lg:w-[75%] relative mt-2 lg:mt-6'>
                      <h2 className='font-primary font-bold text-xl '>{data.displayName}</h2>
                      <div className='relative'>
                        <div >
                          <div className='relative'>
                            {userInfoList.map((item) => (
                              <div>
                                <p className='font-primary font-normal text-base mt-3 '>{item.title}</p>

                              </div>
                            ))}

                          </div>
                          <div>
                            <p className='flex gap-x-2 items-center font-primary font-medium text-base  absolute top-12 lg:top-2 right-0'><ImRocket />Dhaka</p>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => setContactShow(!contactShow)} className='font-primary font-normal text-md lg:text-lg bg-primary p-1 lg:p-2  text-white rounded-md mt-3 ease-in-out'>Contact info</button>
                      {userInfoList.map((item) => (

                        <button onClick={() => handleEditProfile(item)} className='font-primary font-normal text-md lg:text-lg bg-primary p-1 lg:p-2  text-white rounded-md mt-3 ml-2'>Edit Profile</button>
                      )
                      )}
                      {contactShow &&
                        userInfoList.map((item) => (
                          <div className='relative py-5'>
                            <h4 className='font-primary font-medium text-sm text-primary'>Phone:{item.phone} </h4>
                            <h4 className='font-primary font-medium text-sm text-primary mt-3'>Email: {item.email}</h4>

                          </div>
                        ))
                      }
                      {/* about ========start */}
                      <div>
                        <div className=' border-y border-solid mt-5 py-5'>
                          <h4 className='font-nunito font-bold text-xl'>About</h4>
                          {userInfoList.map((item) => (
                            <p className='font-primary  text-md  mt-3'>{item.about} </p>
                          ))}
                        </div>
                      </div>
                      {/* about ========end */}
                      {/* project ========start */}
                      <Project />
                      {/* project ========end */}
                      {/* my post */}
                      <MyPost />
                      {/* my post */}
                    </div>
                  </div>
                </div>
                <div className='w-full lg:w-[35%]'>
                  <div className='text-center border border-solid py-5'>
                    <img className='w-[60px] h-[60px] rounded-full overflow-hidden mx-auto' src={data.photoURL} alt="" />
                    <h1 className='font-primary text-2xl font-medium '>{data.displayName}</h1>
                  </div>
                  <div className='h-[200px] border border-solid px-5 overflow-y-scroll'>
                    {/* experience start */}
                    <div className='mt-10'>
                      <h3 className='font-primary text-lg font-bold text-black mb-5'>Experience</h3>
                      <div className='flex gap-x-5 items-center'>
                        <div className='w-[70px] h-[70px] rounded-full overflow-hidden relative group'>
                          <img className='w-full' src='images/icon1.png' />

                        </div>
                        <div className='w-[88%] relative'>
                          {userInfoList.map((item) => (
                            <div className='relative'>
                              <h3 className='font-primary text-md font-medium text-black mb-1'>{item.experience}</h3>
                              <h5 className='font-primary text-md font-normal text-black mb-3'>{item.experienceTitle}</h5>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* experience start */}
                    <div className='mt-12 mb-12'>
                      <h3 className='font-primary text-lg font-bold text-black mb-5'>Education</h3>
                      <div className='flex gap-x-5'>
                        <div className='w-[70px] h-[70px] rounded-full overflow-hidden relative group'>
                          <img className='w-full' src='images/icon1.png' />

                        </div>
                        <div className='w-[88%] relative'>
                          {userInfoList.map((item) => (
                            <div className='relative'>

                              <h3 className='font-primary text-md font-medium text-black mb-1'>{item.schoolName}</h3>
                              <h5 className='font-primary text-md font-normal text-black mb-3'>{item.degree}</h5>

                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <FriendList />
                  <BlockList />
                </div>

              </div>

            </Container>
          </div>
          {coverModalShow &&
            <div className='lg:w-full lg:h-screen bg-[rgba(0,0,0,.4)] absolute top-[40%] lg:top-0 left-0 z-50 lg:flex justify-center items-center'>
              <div className='w-full lg:w-1/4 p-5  bg-white rounded-2xl shadow-lg'>
                <h1 className='font-nunito text-2xl font-bold text-primary'>Upload Your Cover Photo </h1>
                <input onChange={onChange} className='font-primary text-md text-primary block mt-5 mb-5 w-full' type='file' />
                {image &&
                  <div className='w-[100px] h-[50px] overflow-hidden mx-auto mb-2'>
                    <div className="img-preview w-full h-full" />
                  </div>
                }
                {image &&

                  <div className='w-full h-[100px]'>
                    <Cropper
                      style={{ height: '100%', width: "100%" }}
                      zoomTo={0.5}
                      initialAspectRatio={1}
                      preview=".img-preview"
                      src={image}
                      viewMode={1}
                      minCropBoxHeight={10}
                      minCropBoxWidth={10}
                      background={false}
                      responsive={true}
                      autoCropArea={1}
                      checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                      onInitialized={(instance) => {
                        setCropper(instance);
                      }}
                      guides={true}
                    />
                  </div>
                }
                <div className='flex items-center'>
                  {
                    loader ?
                      <Rings
                        height="80"
                        width="80"
                        color="#4fa94d"
                        radius="6"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                        ariaLabel="rings-loading"
                      />
                      :

                      <button onClick={getCropData} className='font-primary py-2 px-2 bg-primary rounded-bl-lg text-sm text-white  mt-5 inline-block'>Upload</button>
                  }
                  <button onClick={() => setCoverModalShow(false)} className='font-primary py-2 px-2 bg-red-500 rounded-bl-lg text-sm text-white ml-5  mt-5 inline-block'>Cancel</button>
                </div>
              </div>
            </div>
          }
          {editTitleModal &&
            <div className='absolute top-[25%] left-[50%] translate-x-[-50%] w-full h-screen  z-50 bg-[rgba(0,0,0,.4)] lg:flex justify-center items-center '>
              <div className='bg-white w-full lg:w-1/4  p-5  rounded-md'>
                <h1 className='font-primary font-bold text-xl mb-5'>Update Title </h1>
                {userInfoList.map((item) => (

                  <input onChange={(e) => setTitleEdit(e.target.value)} className='w-full py-2 px-3 border border-solid mb-2 rounded-md' type="text" defaultValue={item.title} />
                ))}
                <button onClick={handleTitleEdit} className='bg-primary text-sm font-primary p-2 text-white rounded-md'>Update</button>
                <button onClick={() => seteditTitleModal(false)} className='bg-red-500 text-sm font-primary p-2 text-white rounded-md ml-2'>Cancle</button>

              </div>
            </div>
          }
          {editEpModal &&
            <div className='w-full h-screen bg-[rgba(0,0,0,.4)]  absolute top-[25%] left-0 lg:flex justify-center items-center z-50 '>
              <div className='bg-white w-full lg:w-1/4 p-5 rounded-lg shadow-lg'>
                <h1 className='font-primary font-bold text-xl mb-5'>Update Expriance </h1>
                {userInfoList.map((item) => (
                  <div>
                    <input onChange={(e) => setexpEdit(e.target.value)} className='w-full py-2 px-3 border border-solid mb-2 rounded-md' type="text" defaultValue={item.experience} />
                    <input onChange={(e) => setexpTitleEdit(e.target.value)} className='w-full py-2 px-3 border border-solid mb-2 rounded-md' type="text" defaultValue={item.experienceTitle} />
                  </div>
                ))}
                <button onClick={handleExpEdit} className='bg-primary text-sm font-primary p-2 text-white rounded-md'>Update</button>
                <button onClick={() => seteditEpModal(false)} className='bg-red-500 text-sm font-primary p-2 text-white rounded-md ml-2'>Cancle</button>

              </div>
            </div>

          }
          {editEduModal &&
            <div className='w-full h-screen bg-[rgba(0,0,0,.4)]  absolute top-[25%] left-0 lg:flex justify-center items-center z-50'>
              <div className='bg-white w-full lg:w-1/4 p-5 rounded-lg shadow-lg '>
                <h1 className='font-primary font-bold text-xl mb-5'>Update Education </h1>
                {userInfoList.map((item) => (
                  <div>
                    <input onChange={(e) => seteduEdit(e.target.value)} className='w-full py-2 px-3 border border-solid mb-2 rounded-md' type="text" defaultValue={item.schoolName} />
                    <input onChange={(e) => seteduSchoolEdit(e.target.value)} className='w-full py-2 px-3 border border-solid mb-2 rounded-md' type="text" defaultValue={item.degree} />
                  </div>
                ))}
                <button onClick={handleduEdit} className='bg-primary text-sm font-primary p-2 text-white rounded-md'>Update</button>
                <button onClick={() => seteditEduModal(false)} className='bg-red-500 text-sm font-primary p-2 text-white rounded-md ml-2'>Cancle</button>

              </div>
            </div>
          }
          {contactModal &&
            <div className='w-full h-screen bg-[rgba(0,0,0,.4)]  absolute top-[25%] left-0 lg:flex justify-center items-center z-50'>
              <div className='bg-white w-full lg:w-1/4 p-5 rounded-lg shadow-lg '>
                <h1 className='font-primary font-bold text-xl mb-5'>Update Contact </h1>
                {userInfoList.map((item) => (
                  <div>
                    <h2 className='font-primary text-sm font-medium '>Phone:</h2>
                    <input onChange={(e) => setPhoneEdit(e.target.value)} className='w-full py-2 px-3 border border-solid mb-2 rounded-md' type="text" defaultValue={item.phone} />
                    <h2 className='font-primary text-sm font-medium '>Email:</h2>
                    <input onChange={(e) => setEmailEdit(e.target.value)} className='w-full py-2 px-3 border border-solid mb-2 rounded-md' type="text" defaultValue={item.email} />
                  </div>
                ))}

                <button onClick={handleContactEdit} className='bg-primary text-sm font-primary p-2 text-white rounded-md'>Update</button>
                <button onClick={() => setContactModal(false)} className='bg-red-500 text-sm font-primary p-2 text-white rounded-md ml-2'>Cancle</button>


              </div>
            </div>
          }
          {aboutModal &&
            <div className='w-full h-screen bg-[rgba(0,0,0,.4)]  absolute top-[25%] left-0 lg:flex justify-center items-center z-50'>
              <div className='bg-white w-full lg:w-1/4 p-5 rounded-lg shadow-lg '>
                <h1 className='font-primary font-bold text-xl mb-5'>Update BIO </h1>
                {userInfoList.map((item) => (
                  <div>
                    <h2 className='font-primary text-sm font-medium '>BIO:</h2>
                    <input onChange={(e) => setBioEdit(e.target.value)} className='w-full py-2 px-3 border border-solid mb-2 rounded-md' type="text" defaultValue={item.about} />
                  </div>
                ))}
                <button onClick={handleBioEdit} className='bg-primary text-sm font-primary p-2 text-white rounded-md'>Update</button>
                <button onClick={() => setAboutModal(false)} className='bg-red-500 text-sm font-primary p-2 text-white rounded-md ml-2'>Cancle</button>

              </div>
            </div>
          }
          {editProfile &&
            <div className='lg:w-full lg:h-screen absolute top-[25%] lg:top-0 left-0 bg-primary z-20 lg:flex justify-center items-center'>
              <div className='w-full lg:w-1/4 p-5 bg-white rounded-md relative'>
                <MdOutlineCloseFullscreen onClick={() => setEditProfile(false)} className='absolute top-2 right-2 text-2xl text-red-500' />
                <h2 className='font-primary text-xl font-medium mb-3'>Edit Your Profile </h2>
                <div className=' flex justify-between  border-y border-solid py-3 mt-2'>
                  <h3 className='font-primary text-md'>Title</h3>
                  <button onClick={() => seteditTitleModal(true)} className='font-primary text-sm'>Add</button>
                </div>
                <div className='border-y border-solid py-3 mt-2'>
                  <div className='flex justify-between  '>
                    <h3 className='font-primary text-md'>Bio</h3>
                    <button onClick={() => setAboutModal(true)} className='font-primary text-sm'>Add</button>
                  </div>
                  <h4 className='font-primary text-sm text-center mt-5'>Add a short bio to tell people more about yourself</h4>
                </div>
                <div className=' flex justify-between  border-y border-solid py-3 mt-2'>
                  <h3 className='font-primary text-md'>Experiance</h3>
                  <button onClick={handleEPModal} className='font-primary text-sm'>Add</button>
                </div>
                <div className=' flex justify-between  border-y border-solid py-3 mt-2'>
                  <h3 className='font-primary text-md'>Education</h3>
                  <button onClick={handleEduModal} className='font-primary text-sm'>Add</button>
                </div>
                <div className=' flex justify-between  border-y border-solid py-3 mt-2'>
                  <h3 className='font-primary text-md'>Contact</h3>
                  <button onClick={() => setContactModal(true)} className='font-primary text-sm'>Add</button>
                </div>
              </div>
            </div>

          }



        </>
        :
        <div className='absolute top-0 left-0 w-full h-full bg-primary flex justify-center items-center '>
          <h2 className='font-primary text-2xl font-bold text-white'>Please Verify Your Email </h2>
        </div>
      }
    </div>

  )
}

export default Profile