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