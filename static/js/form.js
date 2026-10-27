async function saveItem(type) {

    const form = document.querySelector("form");

    const studentName =
        form.elements["studentName"].value.trim();

    const itemName =
        form.elements["itemName"].value.trim();

    const category =
        form.elements["category"].value;

    const description =
        form.elements["description"].value.trim();

    const contact =
        form.elements["contact"].value.trim();

    let date;
    let location;

    if (type.toLowerCase() === "lost") {

        date =
            form.elements["dateLost"].value;

        location =
            form.elements["locationLost"].value.trim();

    } else {

        date =
            form.elements["dateFound"].value;

        location =
            form.elements["locationFound"].value.trim();

    }

    // Check all fields

    if (
        studentName === "" ||
        itemName === "" ||
        category === "" ||
        date === "" ||
        location === "" ||
        description === "" ||
        contact === ""
    ) {

        alert("Please fill in all fields.");

        return;
    }


    // Data to send to Flask

    const item = {

        type: type.toLowerCase(),

        studentName: studentName,

        itemName: itemName,

        category: category,

        date: date,

        location: location,

        description: description,

        contact: contact

    };


    try {

        const response = await fetch("/api/items", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(item)

        });


        const result = await response.json();


        if (!response.ok) {

            alert(
                "Error: " +
                (result.message || "Could not submit report.")
            );

            return;
        }


        // Success

        alert(
            "Report submitted successfully!\n\n" +
            "Your report is waiting for staff approval."
        );


        // Clear form

        form.reset();


    } catch (error) {

        console.error(error);

        alert(
            "Could not connect to Flask.\n\n" +
            "Please make sure the Flask server is running."
        );

    }

}