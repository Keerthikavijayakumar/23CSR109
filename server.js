const express = require("express");
const cors = require("cors");
const fs = require("fs");
const Log = require("./utils/logger");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
const FILE = "notifications.json";

function getNotifications() {

    try {

        const data = fs.readFileSync(FILE);

        return JSON.parse(data);

    } catch (err) {

        Log(
            "backend",
            "error",
            "db",
            "Failed to read notifications file"
        );

        return [];
    }
}

function saveNotifications(data) {

    try {

        fs.writeFileSync(
            FILE,
            JSON.stringify(data, null, 2)
        );

    } catch (err) {

        Log(
            "backend",
            "fatal",
            "db",
            "Failed to save notifications"
        );
    }
}

app.get("/", async (req, res) => {

    await Log(
        "backend",
        "info",
        "route",
        "Home route accessed"
    );
    res.send("Campus Notification Server Running");
});

app.get("/notifications", async (req, res) => {

    await Log(
        "backend",
        "info",
        "route",
        "GET /notifications called"
    );

    const notifications = getNotifications();
    res.json(notifications);
});


app.post("/notifications", async (req, res) => {

    try {

        const {
            title,
            message,
            department
        } = req.body;

        await Log(
            "backend",
            "debug",
            "controller",
            "Received new notification request"
        );

        if (!title || !message || !department) {

            await Log(
                "backend",
                "warn",
                "middleware",
                "Missing notification fields"
            );

            return res.status(400).json({
                error: "All fields required"
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

        await Log(
            "backend",
            "info",
            "service",
            "Notification created successfully"
        );

        res.status(201).json({
            success: true,
            data: newNotification
        });
    } catch (err) {

        await Log(
            "backend",
            "error",
            "handler",
            err.message
        );
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
});

app.delete("/notifications/:id", async (req, res) => {

    try {

        const id = req.params.id;

        let notifications = getNotifications();

        notifications = notifications.filter(
            n => n.id != id
        );

        saveNotifications(notifications);

        await Log(
            "backend",
            "info",
            "service",
            `Notification deleted: ${id}`
        );


        res.json({
            success: true,
            message: "Notification deleted"
        });

    } catch (err) {

        await Log(
            "backend",
            "error",
            "handler",
            err.message
        );

        res.status(500).json({
            error: "Delete failed"
        });
    }
});

app.listen(3000, async () => {

    console.log(
        "Server running at http://localhost:3000"
    );

    await Log(
        "backend",
        "info",
        "service",
        "Server started on port 3000"
    );
});