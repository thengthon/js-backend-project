
// _______CONSTANT VARIABLES____________________________________
const URL = "http://localhost:5000";

let preDisplay = document.querySelector(".login");

function hideShow(pre, next, display){
    pre.style.display = "none";
    next.style.display = display;
    preDisplay = next;
}

let goRegister = document.querySelector(".goRegister");
goRegister.addEventListener("click", () => {
    let register = document.querySelector(".register");
    hideShow(preDisplay, register, "block");
});

let backBtn = document.querySelector(".backBtn");
backBtn.addEventListener("click", () => {
    let login = document.querySelector(".login");
    hideShow(preDisplay, login, "block");
});

let exitBtn = document.querySelector(".exitBtn");
exitBtn.addEventListener("click", () => {
    let exit = document.querySelector("body");
    exit.style.display = "none";
});

// ----------------------------------------------------------------
function login(){
    let username = document.querySelector("#fullName").value;
    let password = document.querySelector("#pwd").value;
    
    if (username !== "" && password !== ""){
        axios.get(URL + "/getUsers").then((response) => {
            let users = response.data;
            let isValidUser = false;
            for (let user of users){
                usernameServer = user.name.username;
                passwordServer = user.password;
                if (username === usernameServer && password === passwordServer){
                    let goUserPage = document.querySelector(".userPage");
                    preDisplay = document.querySelector(".authentication");
                    hideShow(preDisplay, goUserPage, "block");
                    isValidUser = true;
                }
            }
            if (!isValidUser){
                window.alert("Username or password is incorrect.");
            }
        })
    }
}

let loginBtn = document.querySelector(".loginBtn");
loginBtn.addEventListener("click", login);

// ----------------------------------------------------------------
function register(){
    let fName = document.querySelector("#fName").value;
    let lName = document.querySelector("#lName").value;
    let email = document.querySelector("#email").value;
    let password = document.querySelector("#registerPwd").value;
    let confirmPwd = document.querySelector("#confirmPwd").value;
    
    let isValidData = (confirmPwd !== "") && (password === confirmPwd) && (password.length >= 5);
    if (isValidData){
        let newUser = {
            "name" : {
                "firstName" : fName,
                "lastName" : lName,
                "username" : fName + lName
            },
            "password" : password,
            "email" : email,
            "conversations" : []
        };

        axios.get(URL + "/getUsers").then((response) => {
            let users = response.data;
            let isNewUser = true;
            for (let user of users){
                usernameServer = user.name.username;
                passwordServer = user.password;
                if (newUser.name.username === usernameServer && newUser.password === passwordServer){
                    isNewUser = false;
                }
            }
            if (isNewUser){
                axios.post(URL + "/addNewUser", newUser).then((response) => {
                    console.log(response.data);
                    window.alert("User is created.");
                    let goLoginPage = document.querySelector(".login");
                    hideShow(preDisplay, goLoginPage, "block");
                })
            } else {
                window.alert("User is existed.")
            }
        })

    } else {
        window.alert("Missing data...!");
    }
}

let RegisterBtn = document.querySelector(".registerBtn");
RegisterBtn.addEventListener("click", register);