// _______CONSTANT VARIABLES____________________________________
const URL = "https://cambo-chat.herokuapp.com";
let myFirstName = "";
let myLastName = "";
let allPlayers = [];
let isShowSetting = false;
let showOption = true;

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
                myFirstName = result.name.firstName;
                myLastName = result.name.lastName;
                allPlayers = result.chatWith;

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

                // ---- Display older partners ------------------------------------------
                let existedPartner = result.chatWith;
                displayUsers(existedPartner, existedPartner);
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

    document.querySelector(".fa-signal").style.color = "#185adb";
    document.querySelector(".fa-share-alt").style.color = "#29bb89";
    document.querySelector(".fa-shield").style.color = "#e1701a";
    document.querySelector(".fa-gears").style.color = "#ffb037";
    document.querySelector(".fa-sign-out").style.color = "#ff005c";

    document.querySelector(".headerProfile").style.borderBottom = "1px solid white";
    document.querySelector(".chat_search").style.borderBottom = "1px solid white";
    document.querySelector(".middleHead").style.borderBottom = "1px solid white";
    document.querySelector(".middle").style.borderRight = "1px solid white";
    document.querySelector(".middle").style.borderLeft = "1px solid white";
    document.querySelector(".sms").style.borderTop = "1px solid white";

    search.style.background = "rgb(85, 85, 85)";
    search.style.color = "#fff";

    sms.style.background = "rgb(85, 85, 85)";
    sms.style.color = "#fff";
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

    document.querySelector(".headerProfile").style.borderBottom = "1px solid gray";
    document.querySelector(".chat_search").style.borderBottom = "1px solid gray";
    document.querySelector(".middleHead").style.borderBottom = "1px solid gray";
    document.querySelector(".middle").style.borderRight = "1px solid gray";
    document.querySelector(".middle").style.borderLeft = "1px solid gray";
    document.querySelector(".sms").style.borderTop = "1px solid gray";

    // search.style.placeholderColor = "#fff";
    search.style.background = "#fff";
    search.style.color = "#000";
    // sms.style.placeholderColor = "#fff";
    sms.style.background = "#fff";
    sms.style.color = "#000";
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

// ------ Style and Emoji ----------------------------------------------------
let style = document.querySelector(".styles");
style.addEventListener("click", () => {
    if (showOption){
        document.querySelector(".btns").style.display = "flex";
        showOption = false;
    } else{
        document.querySelector(".btns").style.display = "none";
        showOption = true;
    }
})

// ------------ Search Contact -----------------------------------------------
function displayUsers(users, exist){
    let ul = document.querySelector(".containerUsers");
    ul.remove();

    let newUl = document.createElement("ul");
    newUl.className = "containerUsers";

    for (let user of users){
        let li = document.createElement("li");
        let div = document.createElement("div");
        let name = document.createElement("span");
        let add = document.createElement("span");
        let i = document.createElement("i");
    
        i.className = "fa fa-user-circle";
        add.className = "add";

        name.textContent = user;
        add.textContent = "+";
    
        li.appendChild(div);

        if (!exist.includes(user)){
            li.appendChild(add);
        }
        div.appendChild(i);
        div.appendChild(name);

        newUl.appendChild(li);
    }
    document.querySelector(".leftSide").appendChild(newUl);
}

let searchBox = document.querySelector("#search");
searchBox.addEventListener("click", () => {
    axios.post("/getFirstnames", {"name" : myFirstName}).then((response) => {
        let data = response.data;
        let firstNames = data.all;
        let existFirstNames = data.exist;
        searchBox.addEventListener("keyup", () => {
            let matchUsers = [];
            let searchValue = document.querySelector("#search").value;
            for (let firstName of firstNames){
                if ((firstName.includes(searchValue)) && (searchValue !== "")){
                    matchUsers.push(firstName);
                } else if( searchValue === ""){
                    matchUsers = allPlayers;
                }
            }
            displayUsers(matchUsers, existFirstNames);

            let container = document.querySelector(".containerUsers");
            container.addEventListener("click", (event) => {
                let isAdd = event.target.classList[0] === "add";
                if (isAdd){
                    let name = event.target.parentNode.firstChild.lastChild.textContent
                    let allDisplayUsers = document.querySelectorAll(".containerUsers li");
                    for (let user of allDisplayUsers){
                        let displayUsername = user.firstChild.lastChild.textContent;
                        if (displayUsername !== name){
                            user.remove();
                        }
                    }
                    allPlayers.push(name);
                    displayUsers(allPlayers, allPlayers);

                    document.querySelector("#search").value = "";
                    document.querySelector(".partner").textContent = name;

                    let message = {
                        "sender" : myFirstName,
                        "receiver" : name
                    }
                    axios.post("/addNewConversation", message).then((res) => console.log(res.data));
                }
            })
        })
    })

})