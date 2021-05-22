
// _______CONSTANT VARIABLES____________________________________
const URL = "https://cambo-chat.herokuapp.com";

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
function login(e){
    e.preventDefault();
    let username = document.querySelector("#fullName");
    let password = document.querySelector("#pwd");
    
    let isValid = username.checkValidity() && password.checkValidity();
    if (isValid){
        axios.get(URL + "/getUsers").then((response) => {
            let users = response.data;
            let isValidUser = false;
            for (let user of users){
                usernameServer = user.name.username;
                passwordServer = user.password;
                if (username.value === usernameServer && password.value === passwordServer){
                    let goUserPage = document.querySelector(".userPage");
                    preDisplay = document.querySelector(".authentication");
                    hideShow(preDisplay, goUserPage, "grid");
                    isValidUser = true;
                }
            }
            if (!isValidUser){
                window.alert("Username or password is incorrect.");
            }
        })
    } else {
        window.alert("Missing or invalid data.");
    }
}

let loginBtn = document.querySelector(".loginBtn");
loginBtn.addEventListener("click", login);

// ----------------------------------------------------------------
function register(e){
    e.preventDefault();
    let fName = document.querySelector("#fName");
    let lName = document.querySelector("#lName");
    let email = document.querySelector("#email");
    let password = document.querySelector("#registerPwd");
    let confirmPwd = document.querySelector("#confirmPwd");
    
    let isValidData = ((fName.checkValidity()) && (lName.checkValidity()) && (email.checkValidity()) && (confirmPwd.checkValidity()) && (password.checkValidity()) && (password.value === confirmPwd.value));
    if (isValidData){
        let newUser = {
            "name" : {
                "firstName" : fName.value,
                "lastName" : lName.value,
                "username" : fName.value + lName.value
            },
            "password" : password.value,
            "email" : email.value,
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
                    window.alert("User is created.\n" + "Your username is : " + fName.value + lName.value);
                    fName.value = "";
                    lName.value = "";
                    email.value = "";
                    password.value = "";
                    confirmPwd.value = "";
                    let goLoginPage = document.querySelector(".login");
                    hideShow(preDisplay, goLoginPage, "block");
                })
            } else {
                window.alert("User is existed")
            }
        })

    } else {
        window.alert("Missing or invalid data...!");
    }
}

let RegisterBtn = document.querySelector(".registerBtn");
RegisterBtn.addEventListener("click", register);