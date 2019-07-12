(() => {
    //defining shortcut function for getElemenById
    const element = (id) => {
        return document.getElementById(id);
    }

    let username
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
    
    // Boutton de connection
    logInButton.addEventListener('click', () => {
        let provider = new firebase.auth.GithubAuthProvider();

        firebase.auth().signInWithPopup(provider).then(result => {
            // This gives you a GitHub Access Token. You can use it to access the GitHub API.
            let token = result.credential.accessToken;
            // The signed-in user info.

            loggedIn(result.user.displayName)
            console.log(result)
        }).catch(error => {
            console.log(error.message)
        });
    })

    // Vérification si déjà connecté
    firebase.auth().onAuthStateChanged((result) => {
        if (result){
            console.log(result)
            // loggedIn(user.displayName)
        } else {
            console.log("no user signed in")
        }
    })

    // Fonction de connection
    const loggedIn = name => {
        username = name;
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
        username = null;
        logOutButton.innerText = ''
        logOutButton.className = 'hidden';

        logInButton.className = ''
    }

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
                    name:username,
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
