const express = require("express");
const app = express();
const fs = require("fs");
const userPath = "./dataServer/users.json";
const conversationPath = "./dataServer/conversations.json";

app.listen(process.env.PORT || 5000, () => console.log("Server is running...!"))

app.use(express.static("frontend"));
app.use(express.json());
// app.use(express.urlencoded());

// --------- Login --------------------------------------------------------------
app.post("/getUsers", (req, res) => {
    let userReq = req.body;
    let username = userReq.username;
    let password = userReq.password;
    
    let isValidUser = false;
    let users = JSON.parse(fs.readFileSync(userPath));
    for (let user of users){
        let usernameServer = user.name.username;
        let passwordServer = user.password;
        if (username === usernameServer && password === passwordServer){
            user.chatWith.id = user.chatWith.people.length -1;
            res.send(user);
        }
    }
    res.send("false");
    fs.writeFileSync(userPath, JSON.stringify(users));
})

// --------- Register --------------------------------------------------------
app.post("/addNewUser", (req, res) => {
    let newUser = req.body;

    let isNewUser = true;
    let users = JSON.parse(fs.readFileSync(userPath));
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
    fs.writeFileSync(userPath, JSON.stringify(users));
});
// ---------------------------------------------------------------------------
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
    res.send("Make change successfully...!");
    fs.writeFileSync(userPath, JSON.stringify(users));
})
// ---------------------------------------------------------------------------
// -------- Response FirstNames ----------------------------------------------
app.post("/getFirstnames", (req, res) => {
    let myFirstName = req.body.name;

    let firstNames = [];
    let firstNameExist = [];

    let users = JSON.parse(fs.readFileSync(userPath));
    for (let user of users){
        if (user.name.firstName === myFirstName){
            for (let one of user.chatWith.people){
                firstNameExist.push(one.name);
            };
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
            user.chatWith.people.push({name : receiverFirst, id : user.chatWith.people.length});
            user.chatWith.id = user.chatWith.people.length -1;
        };
        if (firstNameServer === receiverFirst){
            user.conversations.push(conversations.length);
            user.chatWith.people.push({name : senderFirst, id : user.chatWith.people.length});
        };
    }
    fs.writeFileSync(userPath, JSON.stringify(users));
    res.send("Create new conversation successfully...!");
})
// --------------------------------------------------------------------------
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
// --------------------------------------------------------------------------
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
// ---------------------------------------------------------------------------
// ------- Send New Contact Only ---------------------------------------------
app.post("/updateContacts", (req, res) => {
    let fName = req.body.name;
    
    let users = JSON.parse(fs.readFileSync(userPath));
    for (let user of users){
        let fNameServer = user.name.firstName;
        
        if (fName === fNameServer){
            let newContact = [];
            let id = user.chatWith.id;
            // -----------------------------------------
            for (let one of user.chatWith.people){
                if (one.id > id){
                    newContact.push(one.name);
                }
            };
            res.send(newContact);
            // -----------------------------------------
            
            user.chatWith.id = user.chatWith.people.length -1;
        };
    };
    fs.writeFileSync(userPath, JSON.stringify(users));
})
// ---------------------------------------------------------------------------

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
    res.send("ok");
    fs.writeFileSync(conversationPath, JSON.stringify(conversations));
})
// ---------------------------------------------------------------------------