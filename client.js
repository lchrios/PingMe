


//ioClient.emit("username", "Chris");

class Client {

    constructor(url) {
        this.random = require("random");
        const io = require("socket.io-client");
        this.ioClient = io.connect(url);
        this.room = this.ioClient;
        this.username = prompt("What's your name?");

        //Updates the username if reconnecting
        this.ioClient.emit("updateUser", username);
        
        var connUsers = {};
        var toSend = "";      
        
        this.ioClient.on("username", (username) => console.log("Successfully logged in as: " + username))
        
        //INCOMING
        //fetch
        this.ioClient.on("fetch", (data) => {
            for (var alert in data){
                const date = new Date(alert.timestamp);
                console.log(date + ": " + alert.msg);
            }
        });

        //from, receives to
        this.ioClient.on("from", (msg) => {
           console.log(msg);
        });

        //users
        this.ioClient.on("users", (data) => {
            console.log("User list:");
            for (var user in data){
                console.log(user.username + ": " + user.socketId);
            }
        });

        //alert
        this.ioClient.on("alert", (data) => {
            //Falta alert
            console.warn(data)
        });


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

    fetchAlerts = () => {
        ioClient.emit("fetch");
    }

    SendMessageToClient = (ioClient, message, receiverSocket) => {
        const date = + new Date();
        var obj = new Object();
        obj.to = receiverSocket;
        obj.msg = message;
        obj.timestamp = date;
        var json = JSON.stringify(obj);
        ioClient.emit("to", json, ioClient);
    }

    SendMessageToGroup = (ioClient, message, group) => {
        const date = + new Date();
        var obj = new Object();
        obj.group = group;
        obj.msg = message;
        obj.timestamp = date;
        var json = JSON.stringify(obj);
        ioClient.emit("group", json);
    }

    getUsers = () => {
        ioClient.emit("users");
    }

    sendAlert = (ioClient, alert, danger) => {
        const date = + new Date();
        var obj = new Object();
        obj.reporter = ioClient;
        obj.alert = alert;
        obj.danger = danger;
        obj.timestmp = date;
        var json = JSON.stringify(obj);
        ioClient.emit("alert", json);
    }
}
const client = new Client("http://localhost:8000");