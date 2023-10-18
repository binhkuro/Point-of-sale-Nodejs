const emailExistence = require('email-existence');

function checkEmailExistence(email) {
    return new Promise((resolve, reject) => {
        emailExistence.check(email, (error, exists) => {
            if (error) {
                reject(error);
            } else {
                resolve(exists);
            }
        });
    });
}

module.exports = {
    checkEmailExistence
};
