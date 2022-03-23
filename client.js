
const random = require("random");
const
    io = require("socket.io-client"),
    ioClient = io.connect("http://localhost:8000");

//ioClient.emit("username", "Chris");

class Client {

    constructor(url) {
        this.ioClient = io.connect("http://localhost:8000");
        this.ioClient.on("message", (data) => {
            console.info(data)
        });
    }
}

// * Global server variable
var connUsers = {};

var toSend = "";

ioClient.on("message", (data) => {
    console.info(data)
})

ioClient.on("alert", (data) => {
    console.warn(data)
});

ioClient.on("from", (data) => {
    console.log(data.from + " > Me : " + data.message);
})

ioClient.on("username", (username) => console.log("Successfully logged in as: " + username))

ioClient.on("connUsers", (data) => {
    //console.info(`Currently connected users [${data.num_users}]:`);
    connUsers = data.users;

    if (data.users.length == 0) {
        return;
    }
    // * Once connUsers is populated
    data.users.forEach(user => {
        console.log(`Me > ${user.username}: `)
        console.log(toSend);
        ioClient.emit("to", {
            "to": user.socketId,
            "message": toSend
        });
    }); 

});


let sendMessageToServer = (message) => {
    console.log("Me > Server:");
    console.log(message);
    ioClient.emit("msg", message);
}

let sendMessage = (message) => {
    toSend = message;
    ioClient.emit("connUsers");
}

// * Testing communication temporal method
setInterval(() => {
    if (random.boolean()) {
        sendMessageToServer({
            "zombies": 100,
            "survivors": 3,
            "message": "Ayudenos que petateamos."
        });
    } else {
        sendMessage("Que show bro, rolen comida");
    }
    
}, 1000 * random.int(1, 10))