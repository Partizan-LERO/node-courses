const keys = require('../keys');

module.exports = function (to, token) {
    return {
        to,
        from: keys.EMAIL_FROM,
        subject: 'Reset password',
        html: `<h1>Forgot password?</h1>
                <p>If you've forgotten your password, click this link:</p>
                <p><a href="${keys.BASE_URL}/auth/password/${token}">Reset password</a></p>
                <p>If it were not you, just ignore this letter</p>
                <hr/>
                <a href="${keys.BASE_URL}">Courses application</a>
        `,
    }
};