
const random = require("random");
const
    io = require("socket.io-client"),
    ioClient = io.connect("http://localhost:8000");

//ioClient.emit("username", "Chris");

class Client {

    constructor(url) {
        var connUsers = {};
        var toSend = "";

        this.ioClient = io.connect(url);
        this.ioClient.on("message", (data) => {
            console.info(data)
        });
        
        this.oClient.on("alert", (data) => {
            console.warn(data)
        });
        
        this.ioClient.on("from", (data) => {
            console.log(data.from + " > Me : " + data.message);
        })
        
        this.ioClient.on("username", (username) => console.log("Successfully logged in as: " + username))
        
        this.ioClient.on("connUsers", (data) => {
            connUsers = data.users;
        
            if (data.users.length == 0) {
                return;
            }
            // * Once connUsers is populated
            data.users.forEach(user => {
                console.log(`Me > ${user.username}: `)
                console.log(toSend);
                this.ioClient.emit("to", {
                    "to": user.socketId,
                    "message": toSend
                });
            }); 
        
        });
        
    }

    sendMessageToServer = (message) => {
        console.log("Me > Server:");
        console.log(message);
        ioClient.emit("msg", message);
    }
    
    sendMessage = (message) => {
        toSend = message;
        ioClient.emit("connUsers");
    }
    
    // * Testing communication temporal method
    setInterval(repetitions){
        if (random.boolean()) {
            sendMessageToServer({
                "zombies": 100,
                "survivors": 3,
                "message": "Ayudenos que petateamos."
            });
        } else {
            sendMessage("Que show bro, rolen comida");
        }
        this.setInterval(repetitions-1);
    }
}
