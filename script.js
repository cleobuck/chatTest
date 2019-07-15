    //defining shortcut function for getElemenById
    const element = (id) => {
        return document.getElementById(id);
    }

    let username = ""
    let logOutButton = element("logout")
    let logInButton = element("log")

    // Configuration Firebase
    const config = {
        apiKey: "AIzaSyBOlkfKuDBJWc3pp44hrAlW3rTqQ5dq_pM",
        authDomain: "becodechat.firebaseapp.com",
        databaseURL: "https://becodechat.firebaseio.com",
        projectId: "becodechat",
        storageBucket: "",
        messagingSenderId: "32762023347",
        appId: "1:32762023347:web:4a4ffa0f3e405d67"
    };
    firebase.initializeApp(config)

    /////////////////////////////
    // Connection avec Github
    /////////////////////////////
    
    // Connection button
    logInButton.addEventListener('click', () => {
        let provider = new firebase.auth.GithubAuthProvider();

        firebase.auth().signInWithPopup(provider).then(result => {
            // This gives you a GitHub Access Token. You can use it to access the GitHub API.
            let token = result.credential.accessToken;
            // The signed-in user info.
            loggedIn(result.user.providerData[0])
            console.log(result)
        }).catch(error => {
            console.log(error.message)
        });
    })

    // Verify is already connected
    firebase.auth().onAuthStateChanged((user) => {
        if (user){
            console.log(user)
            loggedIn(user.providerData[0])
        } else {
            console.log("no user signed in")
        }
    })

    // Logged in function
    const loggedIn = user => {
        if (!user.displayName){
            username = user.email
        } else {
            username = user.displayName
        }

        logOutButton.innerText = username+' (déconnecter)';
        logOutButton.className = '';

        logInButton.className = 'hidden';
    }

    /////////////////////////////
    // Déconnection de Github
    /////////////////////////////

    logOutButton.addEventListener('click', () => {
        firebase.auth().signOut().then(() => {
            loggedOut()
        }).catch (err => {
            console.error('Une erreur est survenue lors de la déconnection')
            console.error(err)
        })
    })

    const loggedOut = () => {
        username = "";
        logOutButton.innerText = ''
        logOutButton.className = 'hidden';

        logInButton.className = ''
    }

    ////////////////////
    // L'écran de chat
    ////////////////////

    //get Elements 
    let status = element("status")
    let messages = element("messages")
    let textarea = element("textarea")
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
    let socket = io.connect();

    //check for connection 
    if(socket !== undefined) {
        socket.on("connect_error", () => {
            let errorMsg = document.getElementById("chat-error")
            if (!errorMsg){
                console.log("Lost connection to Socket")
    
                let message = document.createElement("div");
                message.className = "chat-message"
                message.id = "chat-error"
                message.textContent = "Connection lost";
                message.style.backgroundColor = 'red'
                messages.appendChild(message);
            }
        })

        socket.on("connect", () => {
            console.log("Connected to Socket")
            let errorMsg = document.getElementById("chat-error")
            if(errorMsg){
                errorMsg.remove()
            }
        })
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
                let date = new Date()
                let timeStamp = date.toLocaleDateString()+' '+date.toLocaleTimeString()

                socket.emit("input", {
                    name:username,
                    message:textarea.value, 
                    date: timeStamp
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




let scroll = document.getElementById("messages");

scroll.scrollTop = scroll.scrollHeight-scroll.clientHeight;
