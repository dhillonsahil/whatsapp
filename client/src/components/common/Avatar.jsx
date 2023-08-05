import Image from "next/image";
import React,{useEffect, useState} from "react";
import {FaCamera} from "react-icons/fa"
import ContextMenu from "./ContextMenu";
import PhotoPicker from "./PhotoPicker";
import PhotoLibrary from "./PhotoLibrary";
import CapturePhoto from "./CapturePhoto";

function Avatar({type,image,setImage}) {
  const [hover,setHover]=useState(false)
  const [isContextMenuVisible, setIsContextMenuVisible] = useState()
  const [contextMenuCordinates, setContextMenuCordinates] = useState({
    x:0,
    y:0
  });

  
  const showContextMenu=(e)=>{
    e.preventDefault();
    setIsContextMenuVisible(true)
    setContextMenuCordinates({
      x:e.pageX,
      y:e.pageY
    });
  }

  const [grabPhoto,setGrabPhoto]=useState(false)
  const [showPhotoLibrary,setShowPhotoLibrary]=useState(false)
  const [showCapturePhoto,setShowCapturePhoto]=useState(false)

  const ContextMenuOptions =[
    {name:"Take Photo",callback:()=>{
      setShowCapturePhoto(true)
    }},
    {name:"Choose From Library",callback:()=>{
      setShowPhotoLibrary(true)
    }},
    {name:"Upload Photo",callback:()=>{
      setGrabPhoto(true);
    }},
    {name:"Remove Photo",callback:()=>{
      setImage("/default_avatar.png")
    }},
  ]

  const PhotoPickerChange = async(e)=>{
    const file = e.target.files[0]
    const reader = new FileReader()
    const data = document.createElement("img")
    reader.onload = function(event){
      data.src=event.target.result
      data.setAttribute("data-src",event.target.result)
    }
    reader.readAsDataURL(file)
    setTimeout(()=>{
      setImage(data.src);
    },100)
  }

  useEffect(()=>{
    if(grabPhoto){
      const data=document.getElementById("photo-picker")
      data.click()
      document.body.onfocus =(e)=>{
        setTimeout(()=>{
          setGrabPhoto(false)
        },1000)
      }
    }
  },[grabPhoto])
  return (
    <>
    <div className="flex items-center justify-center">
      {
        type==="sm" && (
          <div className="relative h-10 w-10">
            <Image src={image} alt="avatar" className="rounded-full" fill/>
          </div>
        )
      }
      {
        type==="lg" && (
          <div className="relative h-14 w-14">
            <Image src={image} alt="avatar" className="rounded-full" fill/>
          </div>
        )
      }
      {
        type==="xl" && (
          <div className="relative cursor-pointer z-0" onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} > 
          <div id="context-opener" className={`bg-photopicker-overlay-background h-60 w-60 absolute ${hover?"visible":"hidden"} z-10 top-0 left-0 flex items-center rounded-full justify-center flex-col text-center gap-2`} onClick={(e)=>showContextMenu(e)} >
            <FaCamera className="text-2xl" onClick={(e)=>showContextMenu(e)} id="context-opener" />
            <span id="context-opener" onClick={(e)=>showContextMenu(e)}>Change Image</span>
          </div>
          <div className="relative h-60 w-60 ">
            <Image src={image} alt="avatar" className="rounded-full" fill/>
          </div>
          </div>
        )
      }
    </div>{
      isContextMenuVisible && <ContextMenu options={ContextMenuOptions} cordinates={contextMenuCordinates} contextMenu={isContextMenuVisible} setContextMenu={setIsContextMenuVisible}/>
    }{
      showCapturePhoto && <CapturePhoto 
      setImage={setImage} hide={setShowCapturePhoto}/>
    }
    {showPhotoLibrary && <PhotoLibrary setImage={setImage} hidePhotoLibrary={setShowPhotoLibrary}/>}
    {grabPhoto && <PhotoPicker onChange={PhotoPickerChange} />}
    </>
  )
}

export default Avatar;
