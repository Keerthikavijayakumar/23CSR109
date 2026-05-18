const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
const FILE = "notifications.json";

function getNotification() {
    const data = fs.readFileSync(FILE);
    return JSON.parse(data);
}

function saveNotifications(data){
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

app.get("/notifications", (req, res) => {
    const notifications = getNotifications();
    res.json(notifications);
});

app.post("/notifications", (req, res) => {
    const notifications = getNotifications();
    
});