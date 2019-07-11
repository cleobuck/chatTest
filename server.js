const mongo = require("mongoose")
const client = require("socket.io").listen(4000).sockets;

   
    //connect to mongo 
mongo.connect('mongodb+srv://cleobuck:password123456@cluster0-rcisw.mongodb.net/chatApp?retryWrites=true&w=majority', {useNewUrlParser: true});

    let db = mongo.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.on('open', () => {
    console.log("Mongoose connected")

    //connect to Socket.io
    client.on("connection", socket => {
        let chat = db.collection("chats");

        //Create function to send status
        sendStatus = (s) => {
            socket.emit("status", s); // --------- emit to on event from index 87
        }

        //get chats from mongo collection
        chat.find().limit(100).sort({id:1}).toArray((err, res) => {
            if (err) {
                throw err;
            }

            //emit the messages to html file when loaded again
            socket.emit("output", res)
            
        })

        //Handle input events - ------------------------------emit from index line 100
        socket.on("input", data => {
            let name = data.name;
            let message = data.message;

            //check for name and message 
            if(name == "" || message =="") {
                //Send error status
                sendStatus("Please enter a name and message")
            } else {
                //insert message
                chat.insertOne({name: name, message: message}, ()=> {
                    socket.emit("output", [data]) // ---------------on from line 73

                    //Send status object
                    

                    sendStatus({
                        message: "Message sent",
                        clear: true
                    })
                })
            }
        })
            //Handle clear 
            socket.on("clear", (data) => {
            //remove all chats from collection
            chat.remove({}, () => {
                socket.emit("cleared");
            });
        })
    }) 
});

    //check if connection is working:
