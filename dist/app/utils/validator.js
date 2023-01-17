import { ErrorApi } from '../services/errorHandler.js';
class Validator {
    static checkEmailPattern(email, req, res) {
        const emailIsValid = this.emailPattern.test(email);
        if (!emailIsValid)
            throw new ErrorApi(`Format of the email is not valid`, req, res, 400);
        return emailIsValid;
    }
    static checkPasswordPattern(password, req, res) {
        const passwordIsSecure = this.passwordPattern.test(password);
        if (!passwordIsSecure)
            throw new ErrorApi(`Password not secure : min 6 characters, an upper case and a special character`, req, res, 400);
        return passwordIsSecure;
    }
}
Validator.emailPattern = /^[\w-.]*[\w]+@[\w-]*[\w].[a-z]{2,}$/;
Validator.passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/;
export { Validator };
