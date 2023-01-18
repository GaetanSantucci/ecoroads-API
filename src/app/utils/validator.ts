import { ErrorApi } from '../services/errorHandler.js';
import { Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface Validator {
  emailPattern: RegExp;
  passwordPattern: RegExp;
}

class Validator {
  static emailPattern = /^[\w-.]*[\w]+@[\w-]*[\w].[a-z]{2,}$/;
  static passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/;

  static checkEmailPattern(email: string, req: Request, res: Response): boolean | Error {
    const emailIsValid = this.emailPattern.test(email)
    if (!emailIsValid) throw new ErrorApi(`Format of the email is not valid`, req, res, 400)
    return emailIsValid;
  }

  static checkPasswordPattern(password: string, req: Request, res: Response): boolean | Error {
    const passwordIsSecure = this.passwordPattern.test(password)
    if (!passwordIsSecure) throw new ErrorApi(`Password not secure : min 6 characters, an upper case and a special character`, req, res, 400)
    return passwordIsSecure;
  }
}

export { Validator }