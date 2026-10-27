// Staff Login

function adminLogin(event) {

    event.preventDefault();


    const username =
        document.getElementById("adminUsername")
            .value
            .trim();


    const password =
        document.getElementById("adminPassword")
            .value;


    // Demo login

    const correctUsername = "admin";

    const correctPassword = "admin123";


    if (
        username === correctUsername &&
        password === correctPassword
    ) {

        localStorage.setItem(
            "adminLoggedIn",
            "true"
        );


        alert(
            "Login successful!"
        );


        window.location.href =
            "/dashboard";

    } else {

        alert(
            "Invalid username or password."
        );

    }

}
