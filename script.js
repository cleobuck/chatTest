
(() => {

    //defining shortcut function for getElemenById
    let element = (id) => {
        return document.getElementById(id);
    }

    //get Elements 
    let status = element("status")
    let messages = element("messages")
    let textarea = element("textarea")
    let username = element("username")
    let clearBtn = element("clear")

    //set scroll 




    //Set default status



    let statusDefault = status.textContent;
    let setStatus = (s) => {
        //set status
        status.textContent= s;
        
        if (s !== statusDefault) {
            let delay = setTimeout(() => {
                setStatus(statusDefault);
            }, 4000);
        }
    }

    //connect to socket.io
    let socket = io.connect("http://10.203.0.100:4000");

    //check for connection 
    if(socket !== undefined) {
        console.log("connected to socket....")
        // Handle Output
        socket.on("output", data => {  // emit from server line 47

            if (data.length) {
                for( let i=0; i< data.length; i++) {
                    //build out message div
                    let message = document.createElement("div");
                    let span = document.createElement("span");
                    span.innerHTML = data[i].date
                    message.setAttribute("class", "chat-message");
                    message.textContent = data[i].name+": " +data[i].message;
                    message.appendChild(span);
                    messages.appendChild(message);
                     // scroll at bottom 
                    messages.scrollTop = messages.scrollHeight-messages.clientHeight;
                }
            }
        })

        //get status from Server
        socket.on("status", data => {
            //get message status
            setStatus((typeof data === "object")? data.message: data);
            //if status is clear, clear text 
            if (data.clear) {
                textarea.value = "";
            }
        });

        //hande input
        let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

        textarea.addEventListener("keydown", (event) => {
            if(event.which === 13 && event.shiftKey == false) {

                //Emit to server input
                socket.emit("input", {
                    name:username.value,
                    message:textarea.value, 
                    date: new Date().toLocaleDateString('fr-FR', options)
                });
                event.preventDefault();
                
                 // scroll at bottom 
                messages.scrollTop = messages.scrollHeight-messages.clientHeight;
            }
        })

        //Handle Chat clear 
        clearBtn.addEventListener("click", () => {
            socket.emit("clear");
        })

        // Clear Message
        socket.on('cleared', () => {
        messages.textContent = '';
        });
    }
})()



let scroll = document.getElementById("messages");

scroll.scrollTop = scroll.scrollHeight-scroll.clientHeight;
