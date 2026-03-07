import io from "socket.io-client";// connects your browser to the socket server
import React, { useEffect } from 'react'
import { useRef,useState } from 'react';
import { MdCallEnd } from "react-icons/md";

import { FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash, FaDesktop, FaComments } from "react-icons/fa";
import { MdOutlineScreenShare } from "react-icons/md";
import { MdOutlineStopScreenShare } from "react-icons/md";
import Badge from "@mui/material/Badge";
import TextField from "@mui/material/TextField";
import "../Video/VideoMeet.css"
import { useNavigate } from "react-router-dom";
const server_url="http://localhost:3000";  //websockets server
import server from "../../enviroment";

let connections={}//persist even if the component re-renders as it is declared outside.
//Stores all WebRTC peer connections. Declared outside the component so it survives re-renders. Example: connections["abc123"] = RTCPeerConnection


const peerConfigConnections={
    "iceServers":[
        {"urls":"stun:stun.l.google.com:19302"}//Google's free STUN server is used here
    ]
}//Your devices does not have a public ip but has a private ip so outside world directly cannot reach you
//a STUN server tells your device “this is how the internet sees you”




function VideoMeet() {

    const socketRef=useRef();  //Stores Socket.IO connection
    const socketIdRef=useRef(); //Used to store current socketId
    const localVideoRef=useRef(); //to store refernce to video tag

    let [videoAvailable,setVideoAvailable]=useState(true);//harware permission access
    let [audioAvailable,setAudioAvailable]=useState(true);
    let [video,setVideo]=useState(false);//checks if video is on or off
    let [audio,setAudio]=useState(false);

    let [screen,setScreen]=useState();// Is screen sharing active
    let [screenAvailable,setScreenAvailable]=useState();//Tracks whether the browser supports screen sharing.

    let [showModal,setShowModal]=useState(false);//Controls whether the chat modal/popup is visible
    
    let [messages,setMessages]=useState([]); //chat history of current room you are in
    let [message,setMessage]=useState("");//current typed message
    let [newMessage,setNewMessage]=useState(0);//notification count

    let [askForUsername,setAskForUsername]=useState(true);//to controll the lobby screen
    let [username,setUsername]=useState("");//stores what the user typed


    const videoRef=useRef([]) //references to other participants' video streams.
    let [videos,setVideos]=useState([]);//store multiple user streams
    //     videos = [
    //     {
    //         socketId: "abc123",       // who this video belongs to
    //         stream: MediaStream,      // their actual camera/mic stream
    //         autoPlay: true,           // start playing automatically
    //         playsinline: true         // play inside the page, not fullscreen
    //     },
    //     {
    //         socketId: "xyz789",
    //         stream: MediaStream,
    //         autoPlay: true,
    //         playsinline: true
    //     }
    // ]
    //Both always contain the same data,
    //but videoRef is readable anywhere without going stale.

    const makeOffer = (id) => {
            // ✅ only proceed if connection exists and is stable
            if(!connections[id]) return
            if(connections[id].signalingState !== "stable") return

            connections[id].createOffer().then((description) => {
                // ✅ check again after async createOffer finishes
                if(connections[id].signalingState !== "stable") return

                connections[id].setLocalDescription(description)
                .then(() => {
                    socketRef.current.emit("signal", id, JSON.stringify({
                        "sdp": connections[id].localDescription
                    }))
                })
                .catch(e => console.log(e))
            })
            .catch(e => console.log(e))
    }

    
   
    const getPermissions = async () => {//An async function that asks the browser for camera and mic access.

        try {
            const stream = await navigator.mediaDevices.getUserMedia({//Browser API and stream contains video and audio tracks
            video: true,
            audio: true
            });
            //Browser pops up "Allow camera and mic?"
            // If allowed, returns a stream containing both video and audio tracks.
            //If permission is **denied**, it throws an error and jumps straight to the `catch` block. It never reaches the lines below it.

            setVideoAvailable(true);
            setAudioAvailable(true);//Marks that the user's device has working camera and mic


            window.localStream = stream;//Saves the stream globally so other functions can access it without passing it around
            //avoiding rerenders and accessibility issues

            if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;//src is the stream for the video tag now video tag and show the live video feed
            }
        } 
        catch (err) {
            //If the user blocks the camera, or has no camera
            console.error("Permission denied or error:", err);//If the user clicks "Block" on the camera permission dialog, or the device has no camera, getUserMedia throws an error.
        }
    };




    useEffect(()=>{
        getPermissions();//request for camera and mic access once when the component first loads
        return () => {
            if (window.localStream) {
                window.localStream.getTracks().forEach(track => track.stop());//We stop media tracks on component unmount to release camera resources.
            }
        };

    },[])//runs only once when the component first mounts




    const getUserMediaSuccess=(stream)=>{
        // Replace your old stream with the new one
        // Update ALL peer connections with the new stream
        // 1. Stop old stream
        // 2. Set new stream locally
        // 3. Loop through ALL connections and push new stream to everyone
        // 4. Create new offer and send it to everyone
        try{
            window.localStream.getTracks().forEach(track=>track.stop())
            //Stops the OLD stream's tracks before replacing with the new one. Prevents memory leaks

        }catch(e){
            console.log(e);
        }
        window.localStream=stream//Replaces the old stream with the new one 
        localVideoRef.current.srcObject=stream//updates the local video tag




        for(let id in connections){
            if(id === socketIdRef.current) continue
            connections[id].addStream(window.localStream)
            makeOffer(id)
        }
        stream.getTracks().forEach(track=>track.onended=()=>{//If a track suddenly stops (e.g. user unplugs camera), run this code.
            setVideo(false)
            setAudio(false)

            try{
                let tracks=localVideoRef.current.srcObject.getTracks()
                tracks.forEach(track=>track.stop())
            }catch(e){
                console.log(e)
            }
            let blackSilence=(...args)=>new MediaStream([black(...args),silence()])
            //Replaces the dead stream with a fake black video + silent audio stream. This keeps the WebRTC connection alive even when no real media is flowing.
            window.localStream=blackSilence()
            localVideoRef.current.srcObject=window.localStream;


            for(let id in connections){
                if(id === socketIdRef.current) continue
                connections[id].addStream(window.localStream)
                makeOffer(id)  // use safe version
            }

        })

    }



    //Web Audio API
    let silence=()=>{
        let ctx=new AudioContext()//Creates an **audio playground in the browser. Think of it like opening a music studio. Everything audio related happens inside this context.
        let oscillator=ctx.createOscillator()//Creates a **sound wave generator**. By default it generates a sine wave (like a pure tone/beep)
        let dst=oscillator.connect(ctx.createMediaStreamDestination())
        //creates a **destination** — like a recording output, converts audio into a MediaStream that WebRTC can use.
        oscillator.start();//Starts the oscillator running
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0],{enabled:false})
        //gets the actual audio track from the stream
        //disables it so it produces pure silence.
    }


    //canvas API
    let black=({width=640,height=480}={})=>{
        let canvas=Object.assign(document.createElement("canvas"),{width,height})
        canvas.getContext("2d").fillRect(0,0,width,height)
        

        let stream=canvas.captureStream();//Turns the canvas into a **live video stream**. Whatever is drawn on the canvas becomes a video feed.
        return Object.assign(stream.getVideoTracks()[0],{enabled:false})//Gets the video track from the stream and disables it, producing a black frame.

    }





    let getUserMedia=()=>{
        if((video && videoAvailable)|| (audio && audioAvailable)){
            navigator.mediaDevices.getUserMedia({video:video,audio:audio})
            .then(stream=>{
                if(!video){
                    const blackTrack=black()
                    stream.addTrack(blackTrack)
                }
                getUserMediaSuccess(stream)
            })
            
            .catch((e)=>console.log(e));
        }

        //Its only job:
        // 1. Should I get a stream? YES or NO
        // 2. If YES → request stream → pass to getUserMediaSuccess
        // 3. If NO  → just stop current tracks
        else{//If neither video nor audio is needed
            try{
                let tracks=localVideoRef.current.srcObject.getTracks();
                tracks.forEach(track=>track.stop())//// stop current tracks to release camera/mic
            }
            catch(e){
                console.log(e)

            }
            // create black silent stream as placeholder
            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoRef.current.srcObject = window.localStream

            // update all peer connections with black silent stream


            for(let id in connections){
                if(id === socketIdRef.current) continue
                connections[id].addStream(window.localStream)
                makeOffer(id)  // use safe version
            }
        }
    }

    useEffect(()=>{
        if(video!== undefined && audio !== undefined){
            getUserMedia();
        }
    },[audio,video])//runs everytime video/audio toggles


    let gotMessageFromServer=(fromId,message)=>{

        // It handles TWO types of signals

        // signal received
        //         │
        //         ├── contains "sdp"?  → handle offer/answer
        //         └── contains "ice"?  → handle network path

        //         Type 1 — SDP Signal
        // ```
        // SDP = Session Description Protocol
        //     = the "terms of the video call" document
        //     = contains codec info, stream info, media info
        // ```

        // Two subtypes:
        // ```
        // sdp.type = "offer"   → someone wants to connect to you
        // sdp.type = "answer"  → someone accepted your connection request
        // ```

        // ---

        // ### Type 2 — ICE Signal
        // ```
        // ICE = Interactive Connectivity Establishment
        //     = network path information
        //     = helps two peers find each other on the internet
        // ```

        // ---

        // ### Full flow
        // ```
        // OFFER flow (someone calling you):

        // Other peer creates offer
        //         │
        //         ▼
        // server forwards it to you
        //         │
        //         ▼
        // gotMessageFromServer fires
        //         │
        //         ▼
        // signal.sdp exists ✅
        //         │
        //         ▼
        // setRemoteDescription()     save their offer on your side
        //         │
        //         ▼
        // signal.sdp.type === "offer"
        //         │
        //         ▼
        // createAnswer()             you accept the call
        //         │
        //         ▼
        // setLocalDescription()      save your answer your side
        //         │
        //         ▼
        // emit("signal") back        send answer to them
        //         │
        //         ▼
        // 🎥 video starts flowing
        // ```
        // ```
        // ICE flow (finding network path):

        // Other peer finds a network path
        //         │
        //         ▼
        // server forwards ICE candidate to you
        //         │
        //         ▼
        // gotMessageFromServer fires
        //         │
        //         ▼
        // signal.ice exists ✅
        //         │
        //         ▼
        // addIceCandidate()          add their network path
        //         │
        //         ▼
        // WebRTC now knows how to reach them directly
        //         │
        //         ▼
        // 🎥 direct P2P connection established


        let signal=JSON.parse(message)//Parses the JSON string back to an object
        if(fromId!== socketIdRef.current){//Ignore signals that came from yourself
            if(signal.sdp){
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(()=>{
                    if(signal.sdp.type==="offer"){//If the signal was an "offer" (someone wants to connect)
                        connections[fromId].createAnswer().then((description)=>{
                            connections[fromId].setLocalDescription(description).then(()=>{
                                socketRef.current.emit("signal",fromId,JSON.stringify({"sdp":connections[fromId].localDescription}))//create an "answer" and send it back
                            }).catch((e)=>{
                                console.log(e);
                            })
                        }).catch((e)=>{
                            console.log(e);
                        })
                    }
                }).catch((e)=>{
                    console.log(e)
                })
            }
            if(signal.ice){
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch((e)=>{console.log(e)})
                //If the signal contains ICE candidate data (network path information), add it to the connection
            }
        }
    }
    let addMessage=(data)=>{
        setMessages(prevMessages => [...prevMessages, data])
        // if chat modal is closed, increment notification count
        
        if(socketIdRef.current!==data.sender){
            if (showModal === false) {
                setNewMessage(prev => prev + 1)
            
            
            } 
            else{
                setNewMessage(0);
            }
        }
        
    }

    let connectToSocket=()=>{
    // It does 5 things in order
    // ```
    // 1. Opens socket connection to server
    // 2. Sets up signal listener (WebRTC)
    // 3. Joins the call room
    // 4. Sets up chat listener
    // 5. Sets up user joined/left listeners
        socketRef.current=io.connect(server,{secure:false})//opens a WebSocket connection
        socketRef.current.on("signal",gotMessageFromServer)
        socketRef.current.on("connect",()=>{//fires when the socket connection is established
            // Once connected to server:
            // - Joins the room using current URL as room ID
            // - Saves your own socket ID for future reference
            socketRef.current.emit("join-call",window.location.href)//join call mai data hai ,current url of the call acts as a unique room ID
            socketIdRef.current=socketRef.current.id//socket id ko socket ref mai save karo
            socketRef.current.on("chat-message",addMessage)//Listens for incoming chat messages and adds them to the messages array.
            socketRef.current.on("user-left",(id)=>{
                setVideos((videos)=>videos.filter((video)=>video.socketId!==id))//When someone leaves, remove their video tile from the screen.
            })
            socketRef.current.on("user-joined",(id,clients)=>{//id:Socket Id of the user who just joined,//clients :array of all users currently in the room including you
                clients.forEach((socketListId)=>{//loops through every user and create a peer connections to them
                    if(socketListId === socketIdRef.current) return
                    if(connections[socketListId]) return
                    connections[socketListId]=new RTCPeerConnection(peerConfigConnections)//creates webRTC connection object with stun config
                    connections[socketListId].onicecandidate=(event)=>{
                        if(event.candidate!==null){
                            socketRef.current.emit("signal",socketListId,JSON.stringify({"ice":event.candidate}))
                        }
                    }
                    connections[socketListId].onaddstream=(event)=>{//This fires when the remote peer's media stream starts arriving over the P2P connection. event.stream is their video/audio stream.
                        let videoExists=videoRef.current.find(video=>video.socketId===socketListId)//If a video tile already exists for this socket ID, we update just the stream within it
                        if(videoExists){
                            setVideos(videos=>{
                                const updatedVideos=videos.map(video=>{
                                    return video.socketId===socketListId?{...video,stream:event.stream}:video
                                })
                                videoRef.current=updatedVideos;
                                return updatedVideos
                            })
                        }
                        else{//If this is a new participant, create a new video object and add it to the array.
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
                        let blackSilence=(...args)=>new MediaStream([black(...args),silence()])
                        window.localStream=blackSilence()
                        connections[socketListId].addStream(window.localStream)
                    }
                })
                if(id === socketIdRef.current){
                    for(let id2 in connections){
                        if(id2 === socketIdRef.current) continue
                        
                        makeOffer(id2)  // use safe version
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

    let getDisplayMedia=()=>{
        if(screen){
            navigator.mediaDevices.getDisplayMedia({
                video:true,
                audio:true
            })
            .then(stream=>{
                localVideoRef.current.srcObject=stream
                window.localStream=stream

                for(let id in connections){
                    if(id===socketIdRef.current)continue
                    connections[id].addStream(stream)
                    makeOffer(id)
                }
                stream.getTracks().forEach(track=>{
                    track.onended=()=>{
                        setScreen(false)
                    }
                })
            })
            .catch((e)=>{console.log(e)})
        }
        else{
            getUserMedia()
        }

    }

    useEffect(()=>{
        if(screen!==undefined){
            getDisplayMedia()
        }
    },[screen])

    


    const connect=()=>{
        getMedia()
        connectToSocket();
        setAskForUsername(false);
    }

    let sendMessage=()=>{
        if(message.length===0){
            return
        }
        let messageData={message:message,path:window.location.href,username:username}
        socketRef.current.emit("send-message",messageData);
        console.log(messages);
        setMessage("");
    }

    let routeTo=useNavigate();

    let handleOnEndCall=()=>{
        try{
            let tracks=localVideoRef.current.srcObject.getTracks()
            tracks.forEach(track=>track.stop())

        }catch(e){

        }
        routeTo("/home")
        

    }




  return (
    
    <div className="container-fluid">

        {askForUsername === true ? (

            <div className="lobby-container">

            <div className="lobby-card">

                <h2 className="lobby-title">Join Meeting</h2>

                <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="preview-video"
                ></video>
                <div>
                    <button className="lobby-btn" onClick={() => setVideo(prev => !prev)}>
                        {video ? <FaVideo /> : <FaVideoSlash />}
                    </button>

                    <button className="lobby-btn" onClick={() => setAudio(prev => !prev)}>
                        {audio ? <FaMicrophone /> : <FaMicrophoneSlash />}
                    </button>

                </div>

                <TextField id="outlined-basic" label="Enter Username" variant="outlined" value={username} onChange={e=>setUsername(e.target.value)} />

                <button
                    type="submit"
                    className="text-center px-3 py-2 mx-3 my-2 rounded get-started "
                    onClick={connect}
                    >
                    Join Meeting
                    </button>

            </div>

        </div>

            ) : (

            <div className="row">

                <h2 className="col-12">Meeting Room</h2>
                {showModal? <div className="chat-room">
                    <h2 className="chatBox">Chat Box</h2>
                    <div className="chat-container">
                        <div className="chat-message">
                            {messages.length>0 ? messages.map((item,index)=>{
                                return(
                                    <div key={index} className="chat">
                                        <p className="sender">{item.username}</p>
                                        <p className="text">{item.text}</p>
                                        <p className="time">{new Date(item.time).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true
                                            })}</p>

                                    </div>
                                )
                            }):<div>
                                <p className="noMessage">No messages</p>
                                </div>}

                        </div>
                    </div>
                    <div className="chat-text-area">
                        <TextField id="outlined-basic" label="Enter your chat" variant="outlined" value={message} onChange={e=>setMessage(e.target.value)} />
                        
                            <button
                            type="submit"
                            className="text-center px-3 py-2 mx-3 my-2 rounded get-started "
                            onClick={sendMessage}
                            >
                            Send
                            </button>
                            
                        
                    </div>


                </div>
                :

                <div></div>}
                {/* Local video */}
                <div className="col-12">
                    <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className="userVideo"
                    ></video>
                </div>

                {/* Remote videos */}
                <div className="conferenceView">
                {videos.map((video)=>(
                    <div key={video.socketId} className="col-md-3">

                        

                        <video
                            data-socket={video.socketId}
                            ref={(ref)=>{
                                if(ref && video.stream){
                                    ref.srcObject = video.stream
                                }
                            }}
                            autoPlay
                            playsInline
                            style={{width:"100%"}}
                        ></video>

                    </div>
                ))}
                </div>
            <div
            className="d-flex justify-content-center align-items-center"
            style={{
                position: "fixed",
                bottom: "0",
                left: "0",
                width: "100%",
                backgroundColor: "#28c52e",
                padding: "10px",
                gap: "25px",
                
            }}
            >

            <button className="control-btn" onClick={() => setVideo(prev => !prev)}>
                {video ? <FaVideo /> : <FaVideoSlash />}
            </button>

            <button className="control-btn" onClick={() => setAudio(prev => !prev)}>
                {audio ? <FaMicrophone /> : <FaMicrophoneSlash />}
            </button>

            <button className="control-btn" onClick={() => setScreen(prev => !prev)}>
                {screen? <MdOutlineScreenShare />:<MdOutlineStopScreenShare />}
            </button>

            <button className="control-btn">
                <Badge badgeContent={newMessage} max={999} color="primary" onClick={()=>setShowModal(prev=>!prev)}>
                    <FaComments />
                </Badge>
            </button>
            
            <button className="control-btn call-end" onClick={handleOnEndCall}>
                <MdCallEnd />
            </button>
            </div>

            </div>

            )}

    </div>
  )
}

export default VideoMeet