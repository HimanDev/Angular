angular.module('app', ['ionic']);


function home() {
    window.location = "home.html";
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
