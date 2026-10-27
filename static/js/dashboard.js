document.addEventListener(
    "DOMContentLoaded",
    function () {

        const loggedIn =
            localStorage.getItem("adminLoggedIn");

        if (loggedIn !== "true") {

            alert("Please login as staff first.");

            window.location.href = "/admin";

            return;

        }

        loadDashboard();

    }
);


async function loadDashboard() {

    try {

        const response =
            await fetch("/api/items");

        const items =
            await response.json();


        const total =
            items.length;

        const pending =
            items.filter(item =>
                item.status === "Pending"
            ).length;

        const approved =
            items.filter(item =>
                item.status === "Approved"
            ).length;

        const claimed =
            items.filter(item =>
                item.status === "Claimed"
            ).length;


        document.getElementById("total-items")
            .textContent = total;

        document.getElementById("pending-count")
            .textContent = pending;

        document.getElementById("approved-count")
            .textContent = approved;

        document.getElementById("claimed-count")
            .textContent = claimed;


        const container =
            document.getElementById("dashboard-items");

        container.innerHTML = "";


        if (items.length === 0) {

            container.innerHTML =
                "<p style='text-align:center;'>No reports available.</p>";

            return;

        }


        items.forEach(function (item) {

            const card =
                document.createElement("div");

            card.className = "item-card";


            card.innerHTML = `

                <h3>
                    ${safeText(item.itemName)}
                </h3>

                <p>
                    <strong>Type:</strong>
                    ${item.type === "lost" ? "Lost" : "Found"}
                </p>

                <p>
                    <strong>Status:</strong>

                    <span style="
                        font-weight: bold;
                        color: ${statusColor(item.status)};
                    ">
                        ${item.status}
                    </span>

                </p>

                <p>
                    <strong>Student:</strong>
                    ${safeText(item.studentName)}
                </p>

                <p>
                    <strong>Category:</strong>
                    ${formatCategory(item.category)}
                </p>

                <p>
                    <strong>Location:</strong>
                    ${safeText(item.location)}
                </p>

                <p>
                    <strong>Date:</strong>
                    ${safeText(item.date)}
                </p>

                <p>
                    <strong>Description:</strong>
                    ${safeText(item.description)}
                </p>

                <p>
                    <strong>Contact:</strong>
                    ${safeText(item.contact)}
                </p>

                <div class="dashboard-buttons">

                    ${
                        item.status === "Pending"
                        ? `
                            <button
                                onclick="approveItem(${item.id})"
                                style="background-color: #28a745;"
                            >
                                Approve
                            </button>
                        `
                        : ""
                    }

                    ${
                        item.status === "Approved"
                        ? `
                            <button
                                onclick="claimItem(${item.id})"
                                style="background-color: #007bff;"
                            >
                                Mark as Claimed
                            </button>
                        `
                        : ""
                    }

                    ${
                        item.status !== "Claimed"
                        ? `
                            <button
                                onclick="deleteItem(${item.id})"
                                style="background-color: #dc3545;"
                            >
                                Delete
                            </button>
                        `
                        : ""
                    }

                </div>

            `;

            container.appendChild(card);

        });

    } catch (error) {

        console.error(error);

        alert("Unable to load dashboard data.");

    }

}


async function approveItem(id) {

    if (!confirm("Approve this report?")) {
        return;
    }

    await updateStatus(id, "Approved");

}


async function claimItem(id) {

    if (!confirm(
        "Confirm that the student's college ID and ownership have been verified?"
    )) {
        return;
    }

    await updateStatus(id, "Claimed");

}


async function updateStatus(id, status) {

    try {

        const response =
            await fetch(`/api/items/${id}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    status: status
                })

            });


        const result =
            await response.json();


        if (result.success) {

            alert(
                status === "Approved"
                    ? "Report approved successfully!"
                    : "Item marked as Claimed."
            );

            loadDashboard();

        } else {

            alert(result.message);

        }

    } catch (error) {

        console.error(error);

        alert("Unable to update item.");

    }

}


async function deleteItem(id) {

    if (!confirm(
        "Are you sure you want to delete this report?"
    )) {
        return;
    }


    try {

        const response =
            await fetch(`/api/items/${id}`, {

                method: "DELETE"

            });


        const result =
            await response.json();


        if (result.success) {

            alert("Report deleted successfully.");

            loadDashboard();

        } else {

            alert(result.message);

        }

    } catch (error) {

        console.error(error);

        alert("Unable to delete item.");

    }

}


function statusColor(status) {

    if (status === "Pending") {
        return "orange";
    }

    if (status === "Approved") {
        return "green";
    }

    if (status === "Claimed") {
        return "blue";
    }

    return "black";

}


function formatCategory(category) {

    if (!category) {
        return "Other";
    }

    return category.charAt(0).toUpperCase()
        + category.slice(1);

}


function safeText(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value || "";

    return div.innerHTML;

}


function logout() {

    localStorage.removeItem("adminLoggedIn");

    window.location.href = "/admin";

}