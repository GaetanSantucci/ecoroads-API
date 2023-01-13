var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ErrorApi } from '../services/errorHandler.js';
import { User } from '../datamapper/user.js';
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
        console.log('isExist: ', isExist);
        if (isExist)
            throw new ErrorApi(`User with email ${isExist.email} already exists`, req, res, 401);
        // regex to test if pattern valid
        const regexMail = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;
        const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/;
        // Make control before send data to create user
        const emailIsValid = regexMail.test(req.body.email);
        if (!emailIsValid)
            throw new ErrorApi("Format of the email is not valid", req, res, 400);
        const passwordIsSecure = regexPassword.test(req.body.password);
        if (!passwordIsSecure)
            throw new ErrorApi("Password not secure : min 6 characters, an upper case and a special character", req, res, 400);
        req.body.password = yield bcrypt.hash(password, 10);
        // if (password !== userExist['password']) throw new ErrorApi(`Name or password is wrong, please retry !`, req, res, 401);
        if (!last_name)
            throw new ErrorApi("Lastname required", req, res, 400);
        if (!first_name)
            throw new ErrorApi("Firstname required", req, res, 400);
        const createUser = yield User.create(req.body);
        console.log('createUser: ', createUser);
        if (createUser)
            return res.status(201).json("User has signed up !");
    }
    catch (err) {
        if (err instanceof Error)
            logger(err.message);
    }
});
//? ----------------------------------------------------------- LOGIN
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    try {
        const user = yield User.findUserIdentity(email);
        return res.json(user);
    }
    catch (err) {
        if (err instanceof Error)
            logger(err.message);
    }
});
//? ----------------------------------------------------------- GET USER PROFILE
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (err) {
        if (err instanceof Error)
            logger(err.message);
    }
});
//? ----------------------------------------------------------- LOGOUT
const signOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json("User has been disconnected !");
    }
    catch (err) {
        if (err instanceof Error)
            logger(err.message);
    }
});
//? ----------------------------------------------------------- UPDATE USER
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json("User was successfully updated !");
    }
    catch (err) {
        if (err instanceof Error)
            logger(err.message);
    }
});
//? ----------------------------------------------------------- DELETE USER
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json("User has been deleted !");
    }
    catch (err) {
        if (err instanceof Error)
            logger(err.message);
    }
});
export { getAllUsers, signUp, signIn, signOut, getUserProfile, updateUser, deleteUser };
