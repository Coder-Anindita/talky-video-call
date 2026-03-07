import {Server} from "socket.io"

let connections={}//will track which users are in which room
let messages={}//store all chat messages for each room
let timeOnline={}// will record what time each user connected



const connectToSocket=(server)=>{
    const io=new Server(server,{
        cors:{
            origin:"*",
            credentials:true//allow cors origin

        }
    })

    io.on("connection",(socket)=>{//Listens for when any new user connects
        console.log("User connected:",socket.id);
        timeOnline[socket.id]=Date.now()//Records the exact timestamp when this user connected
        socket.on("join-call",(path)=>{//Listens for when this user wants to join a specific room
            if(!connections[path]){//if path does not exist crreate a path with no users
                connections[path]=[]
            }

            connections[path].push(socket.id)//Adds this user's ID to that room
            socket.join(path)//add socket to that room

            console.log(`${socket.id} joined ${path}`)

            connections[path].forEach(id=>{
                io.to(id).emit("user-joined",socket.id,connections[path])//Goes through every user in the room and sends them a "user-joined" message
            })


            if (messages[path]) {
                messages[path].forEach(msg => {
                    socket.emit("chat-message", msg)//If there are already messages in this room, send all of them to the new user so they can see the chat history
                })
            }

        })

        
        socket.on("signal", (toId, message) => {
            io.to(toId).emit("signal", socket.id, message);
        });

        socket.on("send-message",(data)=>{//Listens for when a user sends a chat message
            const {path,message}=data//Pulls out the room name and message text from the data.
            if(!messages[path]){
                messages[path]=[]//If there's no message history for this room yet, create an empty array to store them
            }
            const msgData={
                sender:socket.id,
                text:message,
                time:Date.now()
            }
            messages[path].push(msgData);//Saves this message to the room's message history
            io.to(path).emit("chat-message", msgData)//Sends this message to every user currently in the room
        })

        socket.on("disconnect",()=>{//Listens for when this user disconnects
            const onlineTime=Date.now()-timeOnline[socket.id]//Calculates how long this user was online by subtracting their join time from the current time
            delete timeOnline[socket.id]//Removes this user from the time tracker since they're gone.

            for(const path in connections){//Loops through every room to find and remove this user
                connections[path]=connections[path].filter(id=>id!==socket.id)
                io.to(path).emit("user-left",socket.id);//Tells everyone still in that room that this user has left

                if (connections[path].length === 0) {
                    delete connections[path]
                    delete messages[path]
                    //If the room is now empty, delete the room and its message history to free up memory.
                } 
            }
              
        })
    })
    return io
}
export default connectToSocket