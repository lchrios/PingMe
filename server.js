const
    { Server } = require("socket.io"),
    server = new Server(8000);

class Server {

    constructor(port) {
        var sequenceNumberByClient = new Map();

        // event fired every time a new client connects:
        this.server.on("connection", (socket) => {
            console.info(`Client connected [id=${socket.id}]`);
            // initialize this client's sequence number
            this.sequenceNumberByClient.set(socket, 1);

            // when socket disconnects, remove it from the list:
            socket.on("disconnect", () => {
                this.sequenceNumberByClient.delete(socket);
                console.info(`Client gone [id=${socket.id}]`);
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