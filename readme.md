college notification micreservice
For a recruitment task like **“Campus Notification Microservice”**, they usually expect:

* REST API creation
* CRUD operations
* Basic frontend integration
* Clean structure
* Git usage

You can build it very fast using:

* Frontend → HTML/CSS/JS or React
* Backend → Node.js + Express
* Storage → JSON or SQLite
* Testing → Postman

---

# Simple Architecture

```text id="crxz1k"
Frontend  --->  Express API  ---> notifications.json
```

---

# Features to Implement

## Minimum Features

* Add notification
* View notifications
* Delete notification

## Good Extra Features

* Filter by department
* Mark as important
* Timestamp
* Search

---

# Recommended Folder Structure

```text id="8bq8ez"
campus-notification/
│
├── server.js
├── package.json
├── notifications.json
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
```

---

# Step 1 — Install Packages

```bash id="wv0pmg"
npm init -y
npm install express cors
```

---

# Step 2 — notifications.json

```json id="79yj0v"
[]
```

---

# Step 3 — Backend (server.js)

```javascript id="jlwmqq"
const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const FILE = "notifications.json";

// Read notifications
function getNotifications() {
    const data = fs.readFileSync(FILE);
    return JSON.parse(data);
}

// Save notifications
function saveNotifications(data) {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

// GET all notifications
app.get("/notifications", (req, res) => {

    const notifications = getNotifications();

    res.json(notifications);
});

// POST notification
app.post("/notifications", (req, res) => {

    const notifications = getNotifications();

    const newNotification = {
        id: Date.now(),
        title: req.body.title,
        message: req.body.message,
        department: req.body.department,
        important: req.body.important || false,
        createdAt: new Date()
    };

    notifications.push(newNotification);

    saveNotifications(notifications);

    res.json({
        message: "Notification added",
        data: newNotification
    });
});

// DELETE notification
app.delete("/notifications/:id", (req, res) => {

    let notifications = getNotifications();

    notifications = notifications.filter(
        n => n.id != req.params.id
    );

    saveNotifications(notifications);

    res.json({
        message: "Notification deleted"
    });
});

app.listen(3000, () => {
    console.log("Server running at port 3000");
});
```

---

# Step 4 — Frontend (public/index.html)

```html id="t53k50"
<!DOCTYPE html>
<html>

<head>
    <title>Campus Notifications</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>

    <h1>Campus Notification System</h1>

    <input type="text" id="title" placeholder="Title">

    <input type="text" id="department"
           placeholder="Department">

    <textarea id="message"
              placeholder="Notification message">
    </textarea>

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

# Step 5 — Frontend Logic (public/script.js)

```javascript id="4gm5b2"
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

    document.getElementById("notifications")
            .innerHTML = output;
}

async function addNotification() {

    const title =
        document.getElementById("title").value;

    const department =
        document.getElementById("department").value;

    const message =
        document.getElementById("message").value;

    await fetch("/notifications", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            title,
            department,
            message
        })
    });

    fetchNotifications();
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

# Step 6 — CSS (public/style.css)

```css id="9qq3g8"
body {
    font-family: Arial;
    margin: 30px;
}

input, textarea {
    width: 300px;
    padding: 10px;
    margin: 10px 0;
    display: block;
}

button {
    padding: 10px 20px;
    cursor: pointer;
}

.card {
    border: 1px solid #ccc;
    padding: 15px;
    margin-top: 15px;
    border-radius: 10px;
}
```

---

# Step 7 — Run Project

```bash id="lbflw5"
node server.js
```

Open:

```text id="1m6w42"
http://localhost:3000
```

---

# Postman APIs

## GET Notifications

```text id="zjlwm7"
GET http://localhost:3000/notifications
```

---

## POST Notification

```text id="vhy2if"
POST http://localhost:3000/notifications
```

JSON Body:

```json id="36m6ek"
{
  "title": "Holiday Notice",
  "message": "College closed tomorrow",
  "department": "CSE"
}
```

---

# Interview Upgrades

If you finish early, add:

## Update Notification

```javascript id="jepjlwm"
PUT /notifications/:id
```

## Search

```javascript id="zznrrv"
/notifications?department=CSE
```

## Priority

```javascript id="wopv3o"
High / Medium / Low
```

## Authentication

Simple admin login.

---

# What Recruiters Usually Observe

They mainly check:

* API structure
* CRUD logic
* Clean code
* Folder organization
* JSON handling
* Frontend fetch API
* Git commits
* Error handling

Not advanced UI.

---

# Git Commands

```bash id="3t7rpo"
git init
git add .
git commit -m "Campus notification microservice completed"
```

---

# Best Thing About This Project

You can finish MVP in:

* 30–45 mins

and still have time for:

* polishing
* README
* extra features
* bug fixes.
