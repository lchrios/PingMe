const
    {Server} = require("socket.io"),
    server = new Server(8000);

// * Map containing the currently connected clients
let clients = new Map();
let hist_clients = new Map();


server.on("connection", (socket) => {
    console.info(`Client connected [id=${socket.id}]`);
    // * save client to directory
    clients.set(socket.id, {
        "socket": socket,
        "username": "User"+(clients.size+1)
    });
    
    // * Save historic clients
    if (!hist_clients.has(socket.id)) {
        hist_clients.set(socket.id, { "lastConn": new Date().toISOString() });
    }

    // * when socket disconnects, remove it from the list, update hist_clients:
    socket.on("disconnect", () => {
        clients.delete(socket.id);
        hist_clients.set(socket.id, { "lastConn": new Date().toISOString() })
        console.info(`Client gone [id=${socket.id}]`);
    });

    socket.on("username", (username) => {
        clients.set(socket.id, {
            "socket": socket,
            "username": username
        })
        socket.emit("username", username)
    });

    socket.on("msg", (data) => {
        console.info(clients.get(socket.id).username + ">");
        console.info(data);
    });

    socket.on("to", (data) => {
        // * Check if client exists
        if (clients.has(data.to)) {
            clients.get(data.to).socket.emit("from", {"from": clients.get(socket.id).username , "message": data.message});
        } else {
            socket.emit("error", "There is no connected client with that id: "+data.to);
        }
    });

    socket.on("connUsers", (data) => {
        console.log(clients.get(socket.id).username + " requested for connected users...");

        let connUsers = []; 
        for (let [socketId, socketData] of clients.entries()) {
            if (socket.id !== socketId) {
                connUsers.push({
                    "username": clients.get(socketId).username,
                    "socketId": socketId
                })
            }
        }

        socket.emit("connUsers", {
            "num_users": clients.size,
            "users": connUsers
        });
    })
});

/*
    * msg - Messaging Client2Server
    * msg - Messaging Server2Client
    * to  - Messaging Client2Server2Client
 */