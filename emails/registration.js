const keys = require('../keys');

module.exports = function (to) {
    return {
        to,
        from: keys.EMAIL_FROM,
        subject: 'Registration email',
        html: `<h1>Welcome to our shop!</h1>
                <p>Your account has been successfully created!</p>
                <hr/>
                <a href="${keys.BASE_URL}">Courses application</a>
        `,
    }
};