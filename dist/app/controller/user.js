var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { ErrorApi } from '../services/errorHandler.js';
import { User } from '../datamapper/user.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import debug from 'debug';
const logger = debug('Controller');
import bcrypt from 'bcrypt';
//? ----------------------------------------------------------- GET ALL USERS
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersList = yield User.findAll();
        return res.status(200).json(usersList);
    }
    catch (err) {
        if (err instanceof Error)
            logger(err.message);
    }
});
//? ----------------------------------------------------------- CREATE USER
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, last_name, first_name } = req.body;
    try {
        const isExist = yield User.findUserIdentity(email);
        if (isExist)
            throw new ErrorApi(`User with email ${isExist.email} already exists`, req, res, 401);
        // regex to test if pattern valid
        // eslint-disable-next-line no-useless-escape
        const regexMail = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;
        const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/;
        // Make control before send data to create user
        const emailIsValid = regexMail.test(req.body.email);
        if (!emailIsValid)
            throw new ErrorApi(`Format of the email is not valid`, req, res, 400);
        const passwordIsSecure = regexPassword.test(req.body.password);
        if (!passwordIsSecure)
            throw new ErrorApi(`Password not secure : min 6 characters, an upper case and a special character`, req, res, 400);
        req.body.password = yield bcrypt.hash(password, 10);
        if (!last_name)
            throw new ErrorApi(`Lastname required`, req, res, 400);
        if (!first_name)
            throw new ErrorApi(`Firstname required`, req, res, 400);
        const createUser = yield User.create(req.body);
        if (createUser)
            return res.status(201).json(`User has signed up !`);
    }
    catch (err) {
        if (err instanceof Error)
            logger(err.message);
    }
});
//? ----------------------------------------------------------- LOGIN
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // on recupere mot de passe + email 
    const { email, password } = req.body;
    try {
        const userExist = yield User.findUserIdentity(email);
        if (!userExist)
            throw new ErrorApi(`User not found`, req, res, 401);
        // verify if password is the same with user.password
        const validPassword = yield bcrypt.compare(password, userExist.password);
        if (!validPassword)
            throw new ErrorApi(`Incorrect password`, req, res, 403);
        // delete user.password;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _a = `password`, remove = userExist[_a], user = __rest(userExist, [typeof _a === "symbol" ? _a : _a + ""]);
        // Create token JWT
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user, req);
        const userIdentity = Object.assign(Object.assign({}, user), { accessToken, refreshToken });
        return res.status(200).json(userIdentity);
    }
    catch (err) {
        if (err instanceof Error)
            logger(err.message);
    }
});
//? ----------------------------------------------------------- GET USER PROFILE
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = +req.params.userId;
        if (isNaN(userId))
            throw new ErrorApi(`Id must be a number`, req, res, 400);
        const user = yield User.findOne(userId);
        return res.status(200).json(user);
    }
    catch (err) {
        if (err instanceof Error)
            logger(err.message);
    }
});
//? ----------------------------------------------------------- LOGOUT
const signOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.status(200).json(`User has been disconnected !`);
    }
    catch (err) {
        if (err instanceof Error)
            logger(err.message);
    }
});
//? ----------------------------------------------------------- UPDATE USER
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = +req.params.userId;
        if (isNaN(userId))
            throw new ErrorApi(`Id must be a number`, req, res, 400);
        yield User.delete(userId);
        req.user = null;
        req.session.destroy();
        res.status(200).json("User successfully updated !");
    }
    catch (err) {
        if (err instanceof Error)
            logger(err.message);
    }
});
//? ----------------------------------------------------------- DELETE USER
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const userId = +req.params.userId;
        if (isNaN(userId))
            throw new ErrorApi(`Id must be a number`, req, res, 400);
        const user = yield User.findOne(userId);
        if (!user)
            throw new ErrorApi(`User doesn't exist`, req, res, 400);
        const isUser = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        if (isUser === userId /* || req.user?.role === 'admin' */) {
            const userDeleted = yield User.delete(userId);
            if (userDeleted)
                return res.status(200).json(`User has been deleted !`);
        }
        else
            throw new ErrorApi(`You cannot access this info !`, req, res, 401);
    }
    catch (err) {
        if (err instanceof Error)
            logger(err.message);
    }
});
export { getAllUsers, signUp, signIn, signOut, getUserProfile, updateUser, deleteUser };
