$(document).ready(() => {

    SDK.User.loadNav();

    $("#createUser-button").click(() => {
        console.log("test om det virker");

        const username = $("#inputUsername").val();
        const password = $("#inputPassword").val();

        SDK.User.create(username, password, (err, data) => {
            if (err && err.xhr.status === 401) {
                $(".form-group").addClass("has-error");
            }
            else if (err){
                console.log("Der skete røv og nøgler")
            } else {
                window.location.href = "create-user.html";
            }
        });

    });

});