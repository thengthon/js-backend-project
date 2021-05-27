const express = require("express");
const fs = require("fs");
const app = express();
const conversationPath = "https://cambo-chat.herokuapp.com/dataServer/conversations.json";
const userPath = "https://cambo-chat.herokuapp.com/dataServer/users.json";

app.listen(process.env.PORT || 5000, () => console.log("Server is running...!"))

app.use(express.static("frontend"));
app.use(express.json());
app.use(express.urlencoded());

// --------- Login --------------------------------------------------------------
app.post("/getUsers", (req, res) => {
    let userReq = req.body;
    let username = userReq.username;
    let password = userReq.password;
    
    let users = JSON.parse(fs.readFileSync(userPath));
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
    let users = JSON.parse(fs.readFileSync(userPath));
    let isNewUser = true;
    for (let user of users){
        let usernameServer = user.name.username;
        let passwordServer = user.password;
        if (newUser.name.username === usernameServer && newUser.password === passwordServer){
            isNewUser = false;
        }
    }
    if (isNewUser){
        users.push(newUser);
        fs.writeFileSync(userPath, JSON.stringify(users));
        res.send("true");
    } else{
        res.send("false");
    }
})

// -------- Dark Mode ---------------------------------------------------------
app.post("/dark", (req, res) => {
    let data = req.body;
    let username = data.username;
    let value = data.isDarkMode;
    let users = JSON.parse(fs.readFileSync(userPath));
    for (let user of users){
        let usernameServer = user.name.username;
        if (username === usernameServer){
            user.isInDarkMode = value;
        }
    }
    fs.writeFileSync(userPath, JSON.stringify(users));
    res.send("Make change successfully...!");
})

// -------- Response FirstNames ----------------------------------------------
app.post("/getFirstnames", (req, res) => {
    let myFirstName = req.body.name;
    console.log(myFirstName);
    let users = JSON.parse(fs.readFileSync(userPath));
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
    console.log(message);
    res.send(message);
})

// -------- Add new conversation ---------------------------------------------
app.post("/addNewConversation", (req, res) => {
    let data = req.body;
    let senderFirst = data.sender;
    let receiverFirst = data.receiver;
    let conversations = JSON.parse(fs.readFileSync(conversationPath));
    let newData = {
        "id" : conversations.length + 1,
        "starter" : { "name" : senderFirst, "id" : -1},
        "receiver" : { "name" : receiverFirst, "id" : -1},
        "messages" : []
    };
    conversations.push(newData);
    fs.writeFileSync(conversationPath, JSON.stringify(conversations));

    let users = JSON.parse(fs.readFileSync(userPath));
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
    fs.writeFileSync(userPath, JSON.stringify(users));

    res.send("Create new conversation successfully...!");
})

// -------- Send conversation ------------------------------------------------
app.post("/getConversation", (req, res) => {
    let names = req.body;
    let sender = names.sender;
    let receiver = names.receiver;

    let conversations = JSON.parse(fs.readFileSync(conversationPath));
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
    fs.writeFileSync(conversationPath, JSON.stringify(conversations));
})
// ------- Send New Message Only ---------------------------------------------
app.post("/updateConversation", (req, res) => {
    let names = req.body;
    let sender = names.sender;
    let receiver = names.receiver;

    let conversations = JSON.parse(fs.readFileSync(conversationPath));
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
    fs.writeFileSync(conversationPath, JSON.stringify(conversations)); 
})

// -------- Store New Message ------------------------------------------------
app.post("/addNewMessage", (req, res) => {
    let data = req.body;
    let sender = data.sender;
    let receiver = data.receiver;
    let message = data.message;

    let conversations = JSON.parse(fs.readFileSync(conversationPath));
    for (let conv of conversations){
        let starterServer = conv.starter.name;
        let receiverServer = conv.receiver.name;
        if (((sender === starterServer) && (receiver === receiverServer)) || ((sender === receiverServer) && (receiver === starterServer))){
            message.id = conv.messages.length;
            conv.messages.push(message);
        };
    }
    fs.writeFileSync(conversationPath, JSON.stringify(conversations));
    res.send("ok");
})