angular.module('app', ['ionic']);

// models

// ng-model holding values from view/html
creds = {
    name: "user",
    password: "password",
    email : "temp_email@temp.com"
};

function home() {
    window.location = "index.html";
}


function adventure() {
    window.location = "adventure.html";
}

function adventureDetails(activityId) {
    window.location = "adventure_details.html?activityId="+activityId;
}

function selectDate(activityId) {
    window.location = "select_date.html?activity_id="+activityId;
}

function yourDetails() {
    window.location = "user_details.html";
}

function orderSummary(orderTId) {
    window.location = "order_summary.html?orderTId="+orderTId;
}

function congrats() {
    window.location = "congrats.html";
}

function signup() {
    window.location = "signup.html";
}
function signin() {
    window.location = "signin.html";
}

function forgotpassword() {
    window.location = "forgot_password.html";
}
