var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { User } from '../datamapper/user.js';
import bcrypt from 'bcrypt';
//? ----------------------------------------------------------- GET ALL USERS
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersList = yield User.findAll();
        console.log('usersList: ', usersList);
        return res.json(usersList);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ "error": error.message });
        }
    }
});
//? ----------------------------------------------------------- CREATE USER
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, last_name, first_name } = req.body;
    try {
        const isExist = yield User.findUserIdentity(email);
        console.log('isExist: ', isExist);
        if (!isExist)
            return res.status(401).json({ "error": "User already exists" });
        // regex to test if pattern valid
        const regexMail = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;
        const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/;
        const emailIsValid = regexMail.test(req.body.email);
        if (!emailIsValid)
            return res.json({ "error": "Format of the email is not valid" });
        const passwordIsSecure = regexPassword.test(req.body.password);
        if (!passwordIsSecure)
            return res.json({ "error": "Password not secure : min 6 characters, an upper case and a special character" });
        req.body.password = yield bcrypt.hash(password, 10);
        if (!last_name)
            return res.json({ "error": "Lastname required" });
        if (!first_name)
            return res.json({ "error": "Firstname required" });
        const createUser = yield User.create(req.body);
        // console.log('createUser: ', createUser);
        if (createUser)
            return res.json("User has signed up !");
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ "error": error.message });
        }
    }
});
//? ----------------------------------------------------------- LOGIN
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    try {
        const user = yield User.findUserIdentity(email);
        return res.json(user);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ "error": error.message });
        }
    }
});
//? ----------------------------------------------------------- GET USER PROFILE
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ "error": error.message });
        }
    }
});
//? ----------------------------------------------------------- LOGOUT
const signOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json("User has been disconnected !");
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ "error": error.message });
        }
    }
});
//? ----------------------------------------------------------- UPDATE USER
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json("User was successfully updated !");
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ "error": error.message });
        }
    }
});
//? ----------------------------------------------------------- DELETE USER
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json("User has been deleted !");
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ "error": error.message });
        }
    }
});
export { getAllUsers, signUp, signIn, signOut, getUserProfile, updateUser, deleteUser };
