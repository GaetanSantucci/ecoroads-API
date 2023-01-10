var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from '../model/user.js';
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersList = yield User.findAllUsers();
        res.json(usersList);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ "error": error.message });
        }
    }
});
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = +req.params.id;
    try {
        res.json(`User number : ${id}`);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ "error": error.message });
        }
    }
});
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json("User has signed up !");
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ "error": error.message });
        }
    }
});
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json("User has been successfully connected !");
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ "error": error.message });
        }
    }
});
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
export { getAllUsers, getUser, signUp, signIn, signOut, updateUser, deleteUser };
