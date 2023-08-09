import React, { useEffect, useRef, useState } from "react";
import { useStateProvider } from "@/context/StateContext";
import { FaStop, FaPlay, FaTrash, FaMicrophone, FaPauseCircle } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import WaveSurfer from "wavesurfer.js";
import { ADD_AUDIO_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import { reducerCases } from "@/context/constants";

function CaptureAudio({ setShowAudioRecorder }) {
  const [{ userInfo, currentChatUser, socket }, dispatch] = useStateProvider();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [waveForm, setWaveForm] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [currrentPlaybackTime, setCurrrentPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [renderedAudio,setRenderedAudio] = useState(null)

  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const waveFormRef = useRef(null);

  const handleStartRecording =()=>{
    setRecordingDuration(0)
    setCurrrentPlaybackTime(0)
    setTotalDuration(0)
    setIsRecording(true)
    setRecordedAudio(null);
    navigator.mediaDevices.getUserMedia({audio:true}).then((stream)=>{
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current=mediaRecorder;
      audioRef.current.srcObject = stream;

      const chunks=[];
      mediaRecorder.ondataavailable  =(e)=>chunks.push(e.data)
      mediaRecorder.onstop = ()=>{
        const blob = new Blob(chunks,{type:"audio/ogg; codecs=opus"});
        const audioURL = URL.createObjectURL(blob);
        const audio = new Audio(audioURL);
        setRecordedAudio(audio);
        waveForm.load(audioURL);
      };

      mediaRecorder.start();

    }).catch(error=>{
      console.log("Error accessing microphone : ",error)
    })
  };

  useEffect(()=>{
    const wavesurfer=WaveSurfer.create({
      container:waveFormRef.current,
      waveColor:"#ccc",
      progressColor:"#4a9eff" ,
      cursorColor : "#7ae3c3",
      barWidth:2,
      height:30,
      responsive:true,
    })
    setWaveForm(wavesurfer)

    wavesurfer.on("finish",()=>{
      setIsPlaying(false)
    })

    return ()=>{
      wavesurfer.destroy();
    }
  },[])


  useEffect(()=>{
    if(waveForm){
      handleStartRecording();
    }
  },[waveForm])

  const formatTime = (time)=>{
    if(isNaN(time))return "00:00";
    const minutes = Math.floor(time/60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`
  }

  
  
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      waveForm.stop();
  
      const audiochunks = [];
      mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
        audiochunks.push(event.data);
      });
  
      mediaRecorderRef.current.addEventListener("stop", () => {
        const audioBlob = new Blob(audiochunks, { type: "audio/mp3" });
        const audioFile = new File([audioBlob], "recording.mp3");
        setRenderedAudio(audioFile);
      });
    }
  };
  

  const handlePlayRecording = () => {
    if(recordedAudio){
      waveForm.stop();
      waveForm.play();
      recordedAudio.play();
      setIsPlaying(true)
    }
  };
  const handlePauseRecording = () => {
      waveForm.stop();
      recordedAudio.pause();
      setIsPlaying(false);
  };


  useEffect(()=>{
    if(recordedAudio){
      const updatePlaybackTime = ()=>{
        setCurrrentPlaybackTime(recordedAudio.currentTime);
      }
      recordedAudio.addEventListener("timeupdate",updatePlaybackTime);
      return ()=>{
        recordedAudio.removeEventListener("timeupdate",updatePlaybackTime);
      }
    }
  },[recordedAudio])


  

  useEffect(()=>{
    let interval;
    if(isRecording){
      interval=setInterval(()=>{
        setRecordingDuration((prevDuration)=>{
          setTotalDuration(prevDuration+1);
          return prevDuration+1;
        });
      },1000);
    }

    return ()=>{
      clearInterval(interval)
    };
  },[isRecording])


  
  const sendRecording = async ()=>{
    try {
      const formData = new FormData();
      formData.append("audio",renderedAudio)
      const response =await axios.post(ADD_AUDIO_MESSAGE_ROUTE,formData,{
        headers:{
          'Content-Type':"multipart/form-data"
        },params:{
          from:userInfo.id,
          to:currentChatUser.id,
        }
      })

      if(response.status===201){
        socket.current.emit("send-msg", {
          to: currentChatUser?.id,
          from: userInfo?.id,
          message: response.data.message,
        });
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage: {
            ...response.data.message,
          },
          fromSelf: true,
        });
      }

    } catch (error) {
      console.log(error);
    }
  }


  const handleDeleteRecording = ()=>{
    setShowAudioRecorder(false)
  }

  return (
    <div className="flex text-2xl w-full justify-end items-center">
      <div className="pt-1">
        <FaTrash className={"text-panel-header-icon cursor-pointer"} onClick={handleDeleteRecording} />
      </div>
      <div className="mx-4 py-2 text-white text-lg flex gap-3 justify-center items-center bg-search-input-container-background rounded-full drop-shadow-lg">
        {isRecording ? (
          <div className="text-red-500 animate-pulse">
            Recording 
            <span> {recordingDuration}s</span>
          </div>
        ) : (
          <div>
            {recordedAudio && (
              <>
                {!isPlaying ? (
                  <FaPlay onClick={handlePlayRecording} />
                ) : (
                  <FaStop onClick={handlePauseRecording} />
                )}
              </>
            )}
          </div>
        )}
        <div className="w-60" ref={waveFormRef} hidden={isRecording} />
        {
          recordedAudio && isPlaying && (
            <span>{formatTime(currrentPlaybackTime)}</span>
          )}
          {
            recordedAudio &&  !isPlaying && <span>
              {formatTime(totalDuration)}
            </span>
          }
          <audio ref={audioRef} hidden/>

          <div className="mr-4">
            {!isRecording ? <FaMicrophone className="text-red-500" onClick={handleStartRecording}/>:<FaPauseCircle className="text-red-500" onClick={handleStopRecording} />}
          </div>
          <div className="">
            <MdSend className="text-panel-header-icon cursor-pointer mr-4" title="Send" onClick={sendRecording}/>
          </div>
      </div>
    </div>
  );
}

export default CaptureAudio;
