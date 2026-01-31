import io from "socket.io-client";
import React, { useEffect } from 'react'
import { useRef,useState } from 'react';
const server_url="http://localhost:3000";  //websockets server
let connections={}//persist even if the component re-renders as it is declared outside
const peerConfigConnections={
    "iceServers":[
        {"urls":"stun:stun.l.google.com:19302"}
    ]
}//Your devices does not have a public ip but has a private ip so outside world directly cannot reach you
//a STUN server tells your device “this is how the internet sees you”


function VideoMeet() {

    const socketRef=useRef();  //Stores Socket.IO connection
    const socketIdRef=useRef(); //Used to store current socketId
    const localVideoRef=useRef(); //to store refernce to video tag
    let [videoAvailable,setVideoAvailable]=useState(true);//harware permission access
    let [audioAvailable,setAudioAvailable]=useState(true);
    let [video,setVideo]=useState();//checks if video is on or off
    let [audio,setAudio]=useState();
    let [screen,setScreen]=useState();// Is screen sharing active
    let [showModal,setShowModal]=useState();
    let [screenAvailable,setScreenAvailable]=useState();
    let [messages,setMessages]=useState([]); //chat history
    let [message,setMessage]=useState("");//current typed message
    let [newMessage,setNewMessage]=useState(0);//notification count
    let [askForUsername,setAskForUsername]=useState(true);//to controll the lobby screen
    let [username,setUsername]=useState("");
    const videoRef=useRef([]) //references to other participants' video streams.
    let [videos,setVideos]=useState([]);//store multiple user streams
    
    // if(isChrome()===false)
    const getPermissions = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({//Browser API and stream contains video and audio tracks
        video: true,
        audio: true
        });

        setVideoAvailable(true);
        setAudioAvailable(true);

        window.localStream = stream; //store the video audio stream globally

        if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;//src is the stream for the video tag now video tag and show the live video feed
        }
    } 
    catch (err) {
    
        console.error("Permission denied or error:", err);
    }
};

    useEffect(()=>{
        getPermissions();//reqest for camera and mic access and do the needful
        return () => {
            if (window.localStream) {
                window.localStream.getTracks().forEach(track => track.stop());//We stop media tracks on component unmount to release camera resources.
            }
        };

    },[])

    const getUserMediaSuccess=(stream)=>{

    }
    let getUserMedia=()=>{
        if((video && videoAvailable)|| (audio && audioAvailable)){
            navigator.mediaDevices.getUserMedia({video:video,audio:audio})
            .then(()=>{})
            .then((stream)=>{})
            .catch((e)=>console.log(e));
        }

        //1. Get new media stream with updated constraints
        //2. Update window.localStream
        //3. Update all peer connections with new stream
        //4. Update local video element
        else{
            try{
                let tracks=localVideoRef.current.srcObject.getTracks();
                tracks.forEach(track=>track.stop())
            }
            catch(e){

            }
        }
    }

    useEffect(()=>{
        if(video!== undefined && audio !== undefined){
            getUserMedia();
        }
    },[audio,video])//runs everytime video/audio toggles
    let gotMessageFromServer=()=>{
    }
    let addMessage=()=>{
    }

    let connectToSocket=()=>{
        socketRef.current=io.connect(server_url,{secure:false})
        socketRef.current.on("signal",gotMessageFromServer)
        socketRef.current.on("connect",()=>{
            socketRef.current.emit("join-call",window.location.href)//join call mai data hai current url of the call
            socketIdRef.current=socketRef.current.id//socket id ko socket ref mai save karo
            socketRef.current.on("chat-message",addMessage)//notification wala chart jo bahar se aaya hai
            socketRef.current.on("user-left",(id)=>{
                setVideo((videos)=>videos.filter((video)=>video.socketId!==id))//jo left hogaya uska hatado video ke array mai se
            })
            socketRef.current.on("user-joined",(id,clients)=>{//id:Socket Id of the user who just joined,//clients :array of all users currently in the room including you
                clients.forEach((socketListId)=>{//loops through every user and create a peer connections to them
                    connections[socketListId]=new RTCPeerConnection(peerConfigConnections)//creates webRTC connection object with stun config
                    connections[socketListId].onicecandidate=(event)=>{
                        if(event.candidate!==null){
                            socketRef.current.emit("signal",socketListId,JSON.stringify({"ice":event.candidate}))
                        }
                    }
                    connections[socketListId].onaddstream=(event)=>{
                        let videoExists=videoRef.find(video=>video.socketId===socketListId)
                        if(videoExists){
                            setVideo(videos=>{
                                const updateVideos=videos.map(video=>{
                                    video.socketId===socketListId?{...video,stream:event.stream}:video
                                })
                                videoRef.current=updatedVideos;
                                return updatedVideos
                            })
                        }
                        else{
                            let newVideo={
                                socketId:socketListId,
                                stream:event.stream,
                                autoPlay:true,
                                playsinline:true

                            }
                            setVideos(videos=>{
                                const updatedVideos=[...videos,newVideo]
                                videoRef.current=updatedVideos;
                                return updatedVideos
                            })
                        }
                        
                    }
                    if(window.localStream!==undefined && window.localStream!==null){
                        connections[socketListId].addStream(window.localStream);
                    }
                    else{
                        // let blackSlience
                    }
                })
                if(id===socketIdRef.current){
                    for(let id2 in connections){
                        if(id2===socketIdRef.current)continue
                        try{
                            connections[id2].addStream(window.localStream)
                        }
                        catch(e){}
                        connections[id2].createOffer().then((description)=>{
                            connections[id2].setLocalDescription(description)
                            .then(()=>{
                                socketRef.current.emit("signal",id2,JSON.stringify({"sdp":connections[id2].localDescription}))
                            })
                            .catch(e=>{console.log(e)})
                        })
                    }
                }
            })

        })
    }
    const getMedia=()=>{
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        //connectToSocketServer();
    }

    const connect=()=>{
        setAskForUsername(false);
    }
  return (
    
    <div>
        {askForUsername===true ?
            <div>
                <h1>Enter into lobby</h1>
                
                <input type='text' value={username} onChange={(e)=>{setUsername(e.target.value)}} ></input>
                <button className='btn btn-primary' onClick={connect}>Connect</button>
                <div>
                    <video ref={localVideoRef} autoPlay muted></video>
                </div>

            </div>:<div></div>
        }
    </div>//use this in sockets list
  )
}

export default VideoMeet