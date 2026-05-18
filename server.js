const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const FILE = "notifications.json";

function getNotifications() {
    try {
        const data = fs.readFileSync(FILE, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function saveNotifications(data) {
    fs.writeFileSync(
        FILE,
        JSON.stringify(data, null, 2)
    );
}


app.get("/", (req, res) => {
    res.send("Campus Notification Server Running");
});

app.get("/notifications", (req, res) => {

    const notifications = getNotifications();

    res.status(200).json(notifications);
});

app.post("/notifications", (req, res) => {

    const {
        title,
        message,
        department
    } = req.body;

    if (!title || !message || !department) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    const notifications = getNotifications();

    const newNotification = {
        id: Date.now(),
        title,
        message,
        department,
        createdAt: new Date()
    };

    notifications.push(newNotification);

    saveNotifications(notifications);

    res.status(201).json({
        success: true,
        data: newNotification
    });
});

app.delete("/notifications/:id", (req, res) => {

    const id = req.params.id;

    let notifications = getNotifications();

    notifications = notifications.filter(
        (item) => item.id != id
    );

    saveNotifications(notifications);

    res.json({
        success: true,
        message: "Notification deleted"
    });
});

app.listen(3000, () => {

    console.log(
        "Server running on http://localhost:3000"
    );
});