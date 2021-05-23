
// _______CONSTANT VARIABLES____________________________________
const URL = "http://localhost:5000";
let isShowSetting = false;

let preDisplay = document.querySelector(".login");

function hideShow(pre, next, display){
    pre.style.display = "none";
    next.style.display = display;
    preDisplay = next;
}

let goRegister = document.querySelector(".goRegister");
goRegister.addEventListener("click", () => {
    preDisplay = document.querySelector(".login");
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
        let messsage = {
            "username" : username.value,
            "password" : password.value
        };
        axios.post(URL + "/getUsers", messsage).then((response) => {
            let result = response.data;
            if (result){
                let goUserPage = document.querySelector(".userPage");
                preDisplay = document.querySelector(".authentication");

                document.querySelector(".headerProfile h1").textContent = username.value;
                if (result.isInDarkMode){
                    setDarkMode();
                    document.querySelector("#dark").checked = "true";
                };

                hideShow(preDisplay, goUserPage, "grid");
                username.value = "";
                password.value = "";
            } else {
                window.alert("Username or password is incorrect.");
            }
        });
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
            "isInDarkMode" : false,
            "conversations" : []
        };
        axios.post(URL + "/addNewUser", newUser).then((response) => {
            if (response.data){
                window.alert("User is created.\n" + "Your username is : " + fName.value + lName.value);
                fName.value = "";
                lName.value = "";
                email.value = "";
                password.value = "";
                confirmPwd.value = "";
                let goLoginPage = document.querySelector(".login");
                hideShow(preDisplay, goLoginPage, "block");
            } else{
                window.alert("User is existed");
            }
        })
    } else {
        window.alert("Missing or invalid data...!");
    }
}

let RegisterBtn = document.querySelector(".registerBtn");
RegisterBtn.addEventListener("click", register);

// ---------------------------------------------------------------
let signoutMenu = document.querySelector(".logout");
signoutMenu.addEventListener("click", () => {
    if (window.confirm("Are you loging out?")){
        let loginPage = document.querySelector(".authentication");
        preDisplay = document.querySelector(".userPage");
        hideShow(preDisplay, loginPage, "block");
    }
})

// ---------------------------------------------------------------
let goSettingBtn = document.querySelector(".fa-navicon");
goSettingBtn.addEventListener("click", () => {
    if (!isShowSetting){
        let setting = document.querySelector(".rightSide");
        setting.style.display = "none";
        isShowSetting = true;

        document.querySelector(".userPage").style.gridTemplateColumns = "25% 75%";
    } else{
        let setting = document.querySelector(".rightSide");
        setting.style.display = "block";
        isShowSetting = false;

        document.querySelector(".userPage").style.gridTemplateColumns = "25% 50% 25%";
    };
})

// ---------------------------------------------------------------------------------------
function setDarkMode(){
    document.querySelector(".userPage").style.color = "#fff";
    document.querySelector(".leftSide").style.background = "rgba(0, 0, 0, 0.788)";
    document.querySelector(".middle").style.background = "rgba(0, 0, 0, 0.85)";
    document.querySelector(".rightSide").style.background = "rgba(0, 0, 0, 0.788)";
    let leftLi = document.querySelectorAll(".containerUsers li");
    let rightItems = document.querySelectorAll(".item");
    let itemsP = document.querySelectorAll(".item p");
    let itemsI = document.querySelectorAll(".item i");
    let search = document.querySelector("#search");
    let sms = document.querySelector("#sms");
    for (let li of leftLi){
        li.style.background = "rgb(85, 85, 85)";
    };
    for (let item of rightItems){
        item.style.background = "rgb(85, 85, 85)";
    }
    for (let p of itemsP){
        p.style.color = "#fff";
    }
    for (let i of itemsI){
        i.style.color = "#fff";
    }

    // search.style.placeholderColor = "#fff";
    search.style.background = "rgb(85, 85, 85)";
    // sms.style.placeholderColor = "#fff";
    sms.style.background = "rgb(85, 85, 85)";
}
function unDarkMode(){
    document.querySelector(".userPage").style.color = "#000";
    document.querySelector(".leftSide").style.background = "rgba(128, 128, 128, 0.103)";
    document.querySelector(".middle").style.background = "rgba(128, 128, 128, 0.103)";
    document.querySelector(".rightSide").style.background = "rgba(128, 128, 128, 0.103)";
    let leftLi = document.querySelectorAll(".containerUsers li");
    let rightItems = document.querySelectorAll(".item");
    let itemsP = document.querySelectorAll(".item p");
    let itemsI = document.querySelectorAll(".item i");
    let search = document.querySelector("#search");
    let sms = document.querySelector("#sms");
    for (let li of leftLi){
        li.style.background = "rgba(214, 211, 211, 0.795)";
    };
    for (let item of rightItems){
        item.style.background = "rgba(214, 211, 211, 0.795)";
    }
    for (let p of itemsP){
        p.style.color = "";
    }
    for (let i of itemsI){
        i.style.color = "";
    }

    // search.style.placeholderColor = "#fff";
    search.style.background = "#fff";
    // sms.style.placeholderColor = "#fff";
    sms.style.background = "#fff";
}
let darkMode = document.querySelector("#dark");
darkMode.addEventListener("click", () => {
    let isDark = document.querySelector("#dark").checked;
    if (isDark){
        setDarkMode();
    } else{
        unDarkMode();
    }
    let accUsername = document.querySelector(".headerProfile h1").textContent;
    let message = { 
        "isDarkMode" : isDark,
        "username" : accUsername
    };
    axios.post(URL + "/dark", message).then((response) => {
        console.log(response.data);
    });
})