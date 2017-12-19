$(document).ready(() => {


    Parse.$ = jQuery;
    Parse.initialize("...", "...");

    $('.form-logout').on('submit', function (e) {
        // Prevent Default Submit Event
        e.preventDefault();

        console.log("Performing submit");

        //logout current user
        if ( Parse.User.current() ) {
            Parse.User.logOut();

            // check if really logged out
            if (Parse.User.current())
                console.log("Failed to log out!");
        }

        // do redirect
        //window.location.replace("Sign_In.html");
        // or
        window.location.href = "login.html";
    });
});