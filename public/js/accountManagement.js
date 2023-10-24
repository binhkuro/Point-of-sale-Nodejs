function lockUser(email) {
    fetch("/lock-user", {
        method: "put",
        body: JSON.stringify({
            email: email
        }),
        headers: {
            'Content-type': "application/json"
        }
    })
    .then(() => location.reload())
}

function resendEmail(email) {
    console.log(email)
    fetch("/resend-email", {
        method: "post",
        body: new URLSearchParams({
            'email': email
        })
    })
}