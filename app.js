const express = require("express");
const fs = require("fs");
const app = express();

const PORT = 5000;
app.listen(process.env.PORT || PORT, () => console.log("Server is running...!"))

app.use(express.static("frontend"));
app.use(express.json());
app.use(express.urlencoded());


app.get("/getUsers", (req, res) => {
    let users = fs.readFileSync("./dataServer/users.json");
    res.send(users);
})

app.post("/addNewUser", (req, res) => {
    let newUser = req.body;
    let users = JSON.parse(fs.readFileSync("./dataServer/users.json"));
    users.push(newUser);
    fs.writeFileSync("./dataServer/users.json", JSON.stringify(users));
    res.send("Add new user successfully...!");
})