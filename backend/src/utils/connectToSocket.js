import {Server} from "socket.io"

let connections={}
let messages={}
let timeOnline={}



const connectToSocket=(server)=>{
    const io=new Server(server,{
        cors:{
            origin:"*",
            credentials:true

        }
    })

    io.on("connection",(socket)=>{
        console.log("User connected:",socket.id);
        timeOnline[socket.id]=Date.now()
        socket.on("join-call",(path)=>{
            if(!connections[path]){//if path does not exist crreate a path with no users
                connections[path]=[]
            }

            connections[path].push(socket.id)
            socket.join(path)//add socket to that room

            console.log(`${socket.id} joined ${path}`)

            connections[path].forEach(id=>{
                io.to(id).emit("user-joined",socket.id,connection[path])
            })


            if (messages[path]) {
                messages[path].forEach(msg => {
                    socket.emit("chat-message", msg)
                })
            }

        })

        socket.on("send-message",(data)=>{
            const {path,message}=data
            if(!message[path]){
                messages[path]=[]
            }
            const msgData={
                sender:socket.id,
                text:message,
                time:Date.now()
            }
            message[path].push(msgData);
            io.to(path).emit("chat-message", msgData)
        })

        socket.on("disconnect",()=>{
            const onlineTime=Date.now()-timeOnline[socket.id]
            delete timeOnline[socket.id]

            for(const path in connections){
                connections[path]=connections[path].filter(id=>id!==socket.id)
                io.to(path).emit("user-left",socket.id);

                if (connections[path].length === 0) {
                    delete connections[path]
                    delete messages[path]
                } 
            }
              
        })
    })
    return io
}
export default connectToSocket