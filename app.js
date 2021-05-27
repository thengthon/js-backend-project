const express = require("express");
const app = express();
let users = [
    {   name: {
            "firstName": "chum",
            "lastName": "yoeurn",
            "username": "chumyoeurn"
        },
        password: "123chum",
        email: "chumyoeurn@gmail.com",
        isInDarkMode: false,
        conversations: [],
        chatWith: []
    },
    {
        name: {
            firstName: "chumm",
            lastName: "yoeurn",
            username: "chumyoeurn"
        },
        password: "123chumm",
        email: "chumyoeurn@gmail.com",
        isInDarkMode: false,
        conversations: [],
        chatWith: []
    },
    {
        name: {
            firstName: "thon",
            lastName: "theng",
            username: "thontheng"
        },
        password: "123thon",
        email: "thontheng@gmail.com",
        isInDarkMode: true,
        conversations: [],
        chatWith: []
    }
];
let conversations = [];

app.listen(process.env.PORT || 5000, () => console.log("Server is running...!"))

app.use(express.static("frontend"));
app.use(express.json());
app.use(express.urlencoded());

// --------- Login --------------------------------------------------------------
app.post("/getUsers", (req, res) => {
    let userReq = req.body;
    let username = userReq.username;
    let password = userReq.password;
    
    let isValidUser = false;
    for (let user of users){
        let usernameServer = user.name.username;
        let passwordServer = user.password;
        if (username === usernameServer && password === passwordServer){
            res.send(user);
        }
    }
    res.send("false");
})

// --------- Register --------------------------------------------------------
app.post("/addNewUser", (req, res) => {
    let newUser = req.body;

    let isNewUser = true;
    for (let user of users){
        let usernameServer = user.name.username;
        if (newUser.name.username === usernameServer){
            isNewUser = false;
        };
    };
    if (isNewUser){
        users.push(newUser);
        res.send("true");
    } else{
        res.send("false");
    };
});
// ---------------------------------------------------------------------------
// -------- Dark Mode ---------------------------------------------------------
app.post("/dark", (req, res) => {
    let data = req.body;
    let username = data.username;
    let value = data.isDarkMode;
    for (let user of users){
        let usernameServer = user.name.username;
        if (username === usernameServer){
            user.isInDarkMode = value;
        }
    }
    res.send("Make change successfully...!");
})
// ---------------------------------------------------------------------------
// -------- Response FirstNames ----------------------------------------------
app.post("/getFirstnames", (req, res) => {
    let myFirstName = req.body.name;

    let firstNames = [];
    let firstNameExist = [];

    for (let user of users){
        if (user.name.firstName === myFirstName){
            firstNameExist = user.chatWith;
        } else{
            firstNames.push(user.name.firstName);
        }
    };
    let message = {
        "all" : firstNames,
        "exist" : firstNameExist
    }
    res.send(message);
})
// ---------------------------------------------------------------------------

// -------- Add new conversation ---------------------------------------------
app.post("/addNewConversation", (req, res) => {
    let data = req.body;
    let senderFirst = data.sender;
    let receiverFirst = data.receiver;

    let newData = {
        "id" : conversations.length + 1,
        "starter" : { "name" : senderFirst, "id" : -1},
        "receiver" : { "name" : receiverFirst, "id" : -1},
        "messages" : []
    };
    conversations.push(newData);

    for (let user of users){
        let firstNameServer = user.name.firstName;
        if (firstNameServer === senderFirst){
            user.conversations.push(conversations.length);
            user.chatWith.push(receiverFirst);
        };
        if (firstNameServer === receiverFirst){
            user.conversations.push(conversations.length);
            user.chatWith.push(senderFirst);
        };
    }

    res.send("Create new conversation successfully...!");
})
// --------------------------------------------------------------------------
// -------- Send conversation ------------------------------------------------
app.post("/getConversation", (req, res) => {
    let names = req.body;
    let sender = names.sender;
    let receiver = names.receiver;

    for (let conv of conversations){
        let starterServer = conv.starter.name;
        let receiverServer = conv.receiver.name;
        if (((sender === starterServer) && (receiver === receiverServer)) || ((sender === receiverServer) && (receiver === starterServer))){
            if (sender === starterServer){
                conv.starter.id = conv.messages.length - 1;
            } else{
                conv.receiver.id = conv.messages.length - 1;
            };
            res.send(conv.messages);
        };
    }
})
// --------------------------------------------------------------------------
// ------- Send New Message Only ---------------------------------------------
app.post("/updateConversation", (req, res) => {
    let names = req.body;
    let sender = names.sender;
    let receiver = names.receiver;

    for (let conv of conversations){
        let starterServer = conv.starter.name;
        let receiverServer = conv.receiver.name;
        
        if (((sender === starterServer) && (receiver === receiverServer)) || ((sender === receiverServer) && (receiver === starterServer))){
            let id = -1;
            if (sender === starterServer){
                id = conv.starter.id;
            } else{
                id = conv.receiver.id;
            };
            // -----------------------------------------
            let newMessages = conv.messages.slice(id+1, conv.messages.length)
            res.send(newMessages);
            // -----------------------------------------

            if (sender === starterServer){
                conv.starter.id = conv.messages.length - 1;
            } else{
                conv.receiver.id = conv.messages.length - 1;
            };
        };
    };
})
// ---------------------------------------------------------------------------

// -------- Store New Message ------------------------------------------------
app.post("/addNewMessage", (req, res) => {
    let data = req.body;
    let sender = data.sender;
    let receiver = data.receiver;
    let message = data.message;

    for (let conv of conversations){
        let starterServer = conv.starter.name;
        let receiverServer = conv.receiver.name;
        if (((sender === starterServer) && (receiver === receiverServer)) || ((sender === receiverServer) && (receiver === starterServer))){
            message.id = conv.messages.length;
            conv.messages.push(message);
            console.log(conv.messages);
        };
    }
    res.send("ok");
})
// ---------------------------------------------------------------------------