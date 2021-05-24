const express = require("express");
const fs = require("fs");
const app = express();

app.listen(process.env.PORT || 5000, () => console.log("Server is running...!"))

app.use(express.static("frontend"));
app.use(express.json());
app.use(express.urlencoded());

// --------- Login --------------------------------------------------------------
app.post("/getUsers", (req, res) => {
    let userReq = req.body;
    let username = userReq.username;
    let password = userReq.password;
    
    let users = JSON.parse(fs.readFileSync("./dataServer/users.json"));
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
    let users = JSON.parse(fs.readFileSync("./dataServer/users.json"));
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
        fs.writeFileSync("./dataServer/users.json", JSON.stringify(users));
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
    let users = JSON.parse(fs.readFileSync("./dataServer/users.json"));
    for (let user of users){
        let usernameServer = user.name.username;
        if (username === usernameServer){
            user.isInDarkMode = value;
        }
    }
    fs.writeFileSync("./dataServer/users.json", JSON.stringify(users));
    res.send("Make change successfully...!");
})

// -------- Response FirstNames ----------------------------------------------
app.post("/getFirstnames", (req, res) => {
    let myFirstName = req.body.name;
    console.log(myFirstName);
    let users = JSON.parse(fs.readFileSync("./dataServer/users.json"));
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
    let conversations = JSON.parse(fs.readFileSync("./dataServer/conversations.json"));
    let newData = {
        "id" : conversations.length + 1,
        "starter" : senderFirst,
        "receiver" : receiverFirst,
        "messages" : []
    };
    conversations.push(newData);
    fs.writeFileSync("./dataServer/conversations.json", JSON.stringify(conversations));

    let users = JSON.parse(fs.readFileSync("./dataServer/users.json"));
    for (let user of users){
        let firstNameServer = user.name.firstName;
        if (firstNameServer === senderFirst){
            user.conversations.push(conversations.length);
            user.chatWith.push(receiverFirst);
        }
        if (firstNameServer === receiverFirst){
            user.conversations.push(conversations.length);
            user.chatWith.push(senderFirst);
        }
    }
    fs.writeFileSync("./dataServer/users.json", JSON.stringify(users));

    res.send("Create new conversation successfully...!");
})