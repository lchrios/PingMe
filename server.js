const { io } = require("socket.io-client");

class Server {

    constructor(port) {
        this.server = require("socket.io")(port);
        this.sequenceNumberByClient = new Map();
        this.registeredUsers = new Map();
        this.disconectedUsers = new Array();


        // event fired every time a new client connects:
        this.server.on("connection", (socket) => {
            console.info(`Client connected [id=${socket.id}]`);
            // initialize this client's sequence number
            this.sequenceNumberByClient.set(socket, 1);
            
            //See if the user already is registered
            socket.on("updateUser", (username) => {
                if (username in this.registeredUsers){
                    socket.id = this.registeredUsers.get(username);
                }else{
                    this.registeredUsers.set(username, socket.id);
                }
            });

            if (socket.id in this.disconectedUsers){
                index = this.disconectedUsers.indexOf(socket.id);
                this.disconectedUsers.splice(index, 1);
            }


            // when socket disconnects, remove it from the list:
            socket.on("disconnect", () => {
                this.sequenceNumberByClient.delete(socket);
                console.info(`Client gone [id=${socket.id}]`);
                this.disconectedUsers.push(socket.id);
            });

            socket.on("fetch", () => {
                //Fetch json from firebase and send it to client
            });

            socket.on("to", (json) => {
                const date = new Date(json.timestamp);
                let msg = date + " - " + socket.id +": " + json.msg;
                socket.to(json.to).emit("from", msg)
            });

            socket.on("group", (json) => {
                const date = new Date(json.timestamp);
                let msg = date + " - " + socket.id +": " + json.msg;
                socket.to(json.group).emit("from", msg);
            });

            socket.on("users", () => {
                
                const usernames = Array.from(this.registeredUsers.keys());
                const userSockets = Array.from(this.sequenceNumberByClient.keys());
                
                const mapArrays = (options, values) => {
                    const res = [];
                    for(let i = 0; i < options.length; i++){
                       res.push({
                          username: options[i],
                          socketId: values[i]
                       });
                    };
                    return res;
                 };
                const userJson = JSON.stringify(mapArrays(usernames, userSockets));
                socket.to(socket).emit("users", userJson);
            });

            socket.on("alert", (json) => {
                let results = [];
                this.registeredUsers.forEach((socketId, username)=>{
                    if (socketId in this.disconectedUsers){
                        results.push( { reporter:json.reporter, alert:json.alert, danger:json.danger, timestamp:json.timestamp });
                    }else{
                        socket.to(socketId).emit("alert", json);
                    }
                });
                JSON.stringify(results)
                //Upload the json to Firebase
            });
        });
    }

    setInterval(repetitions) {
        for (const client of this.sequenceNumberByClient.entries()) {
            client.emit("seq-num", repetitions);
            this.setInterval(repetitions-1);
        }
    }
}


const server = new Server(8000);
