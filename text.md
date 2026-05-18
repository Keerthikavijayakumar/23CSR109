# Project Structure

```text id="jlwmhe"
109/
│
├── node_modules/
│
├── public/
│   ├── index.html
│   ├── script.js
│   └── style.css
│
├── utils/
│   └── logger.js
│
├── .gitignore
├── notifications.json
├── package-lock.json
├── package.json
└── server.js
```

---

# 1. package.json

Replace your `package.json` with:

```json id="q7f5qh"
{
  "name": "campus-notification-system",
  "version": "1.0.0",
  "description": "Campus Notification Microservice with Logging Middleware",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "author": "Keerthi",
  "license": "ISC",
  "dependencies": {
    "axios": "^1.8.4",
    "cors": "^2.8.5",
    "express": "^4.21.2"
  }
}
```

---

# 2. notifications.json

Create:

```json id="ll6kzx"
[]
```

---

# 3. .gitignore

```gitignore id="lgidg8"
node_modules
.env
```

---

# 4. utils/logger.js

IMPORTANT:
Replace:

* `YOUR_BEARER_TOKEN`

```javascript id="rkp4mb"
const axios = require("axios");

const TOKEN = "YOUR_BEARER_TOKEN";

const validStacks = [
    "backend",
    "frontend"
];

const validLevels = [
    "debug",
    "info",
    "warn",
    "error",
    "fatal"
];

const validPackages = [
    "cache",
    "controller",
    "cron_job",
    "db",
    "domain",
    "handler",
    "repository",
    "route",
    "service",
    "auth",
    "config",
    "middleware",
    "utils",
    "api",
    "component",
    "hook",
    "page",
    "state",
    "style"
];

async function Log(stack, level, packageName, message) {

    try {

        if (!validStacks.includes(stack)) {
            throw new Error("Invalid stack");
        }

        if (!validLevels.includes(level)) {
            throw new Error("Invalid level");
        }

        if (!validPackages.includes(packageName)) {
            throw new Error("Invalid package");
        }

        const response = await axios.post(
            "http://4.224.186.213/evaluation-service/logs",

            {
                stack,
                level,
                package: packageName,
                message
            },

            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("LOG CREATED:", response.data);

    } catch (err) {

        console.log(
            "LOG ERROR:",
            err.response?.data || err.message
        );
    }
}

module.exports = Log;
```

---

# 5. server.js

```javascript id="7uwoy9"
const express = require("express");
const cors = require("cors");
const fs = require("fs");

const Log = require("./utils/logger");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const FILE = "notifications.json";


// READ FILE
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


// SAVE FILE
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


// HOME ROUTE
app.get("/", async (req, res) => {

    await Log(
        "backend",
        "info",
        "route",
        "Home route accessed"
    );

    res.send("Campus Notification Server Running");
});


// GET NOTIFICATIONS
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


// ADD NOTIFICATION
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


// DELETE NOTIFICATION
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


// SERVER START
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
```

---

# 6. public/index.html

```html id="tvb6ax"
<!DOCTYPE html>
<html>

<head>

    <title>Campus Notifications</title>

    <link rel="stylesheet" href="style.css">

</head>

<body>

    <h1>Campus Notification System</h1>

    <input
        type="text"
        id="title"
        placeholder="Notification Title"
    >

    <input
        type="text"
        id="department"
        placeholder="Department"
    >

    <textarea
        id="message"
        placeholder="Notification Message"
    ></textarea>

    <button onclick="addNotification()">
        Add Notification
    </button>

    <hr>

    <div id="notifications"></div>

    <script src="script.js"></script>

</body>
</html>
```

---

# 7. public/script.js

```javascript id="rkms76"
async function fetchNotifications() {

    const res = await fetch("/notifications");

    const data = await res.json();

    let output = "";

    data.reverse().forEach(n => {

        output += `
            <div class="card">

                <h2>${n.title}</h2>

                <h4>${n.department}</h4>

                <p>${n.message}</p>

                <small>
                    ${new Date(n.createdAt)
                        .toLocaleString()}
                </small>

                <br><br>

                <button onclick="deleteNotification(${n.id})">
                    Delete
                </button>

            </div>
        `;
    });

    document.getElementById(
        "notifications"
    ).innerHTML = output;
}


async function addNotification() {

    const title =
        document.getElementById("title").value;

    const department =
        document.getElementById("department").value;

    const message =
        document.getElementById("message").value;


    const response = await fetch(
        "/notifications",

        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                title,
                department,
                message
            })
        }
    );


    if (response.ok) {

        alert("Notification Added");

        fetchNotifications();

    } else {

        alert("Failed to Add");
    }
}


async function deleteNotification(id) {

    await fetch(`/notifications/${id}`, {
        method: "DELETE"
    });

    fetchNotifications();
}


fetchNotifications();
```

---

# 8. public/style.css

```css id="l5v4dq"
body {

    font-family: Arial;

    margin: 30px;

    background: #f5f5f5;
}


h1 {

    color: #333;
}


input,
textarea {

    width: 300px;

    padding: 10px;

    margin: 10px 0;

    display: block;

    border-radius: 5px;

    border: 1px solid #ccc;
}


button {

    padding: 10px 20px;

    border: none;

    background: black;

    color: white;

    border-radius: 5px;

    cursor: pointer;
}


.card {

    background: white;

    padding: 15px;

    margin-top: 15px;

    border-radius: 10px;

    box-shadow: 0 0 5px rgba(0,0,0,0.1);
}
```

---

# 9. Install Dependencies

Open terminal inside project folder.

Run:

```bash id="3e9s8n"
npm install
```

---

# 10. Start Project

```bash id="g67ikg"
npm start
```

OR

```bash id="zmr7of"
node server.js
```

---

# 11. Open Browser

```text id="4klsqt"
http://localhost:3000
```

---

# 12. Git Commands

```bash id="4uw4dg"
git init
git add .
git commit -m "Campus notification system with logging middleware"
git branch -M main
git remote add origin https://github.com/Keerthikavijayakumar/23CSR109.git
git push -u origin main
```

---

# 13. Postman Testing

## GET Notifications

```text id="fxgq9j"
GET http://localhost:3000/notifications
```

---

## POST Notification

```text id="zck2c4"
POST http://localhost:3000/notifications
```

Body:

```json id="7cz8m4"
{
  "title": "Holiday",
  "message": "College closed tomorrow",
  "department": "CSE"
}
```

---

# Final Important Step

Inside:

```text id="cqlt7n"
utils/logger.js
```

Replace:

```javascript id="7ogjlwm"
const TOKEN = "YOUR_BEARER_TOKEN";
```

with your actual token from the test server auth API.
