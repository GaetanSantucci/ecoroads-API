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
import { Location } from '../datamapper/location.js';
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
    logger('req.body: ', req.body);
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
    logger('req.body: ', req.body);
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
    // On veut recuperer lébody dans lequel il y aura les infos clients - l'adresse - la voiture
    // const userToUpdate = {
    //   "id": 24,
    //   "email": "nami@test.com",
    //   "last_name": "Nami",
    //   "first_name": "Nami",
    //   "location": {
    //     "label": " 25 Grand line, 83100 South Blue",
    //     "address": "Grand Line Sea",
    //     "street_number": 2,
    //     "zipcode": 83000,
    //     "city": "East Blue",
    //     "lat": -45.4541541514,
    //     "lon": 3.45487421154
    //   },
    //   "car_id": 1
    // }
    const { lat, lon } = req.body.location;
    const location = yield Location.findLocationByLatAndLon(lat, lon);
    if (location) {
        req.body.location = location.id;
    }
    else {
        const locationToCreate = Object.assign(Object.assign({}, req.body.location), { user_id: req.body.id });
        yield Location.create(locationToCreate);
    }
    // CHECK IF EMAIL NOT EXIST
    const isExist = yield User.findUserIdentity(req.body.email);
    if (isExist)
        throw new ErrorApi(`User with email ${isExist.email} already exists, choose another !`, req, res, 401);
    // CHECK PASSWORD AND HASH
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
    req.body.password = yield bcrypt.hash(req.body.password, 10);
    // SEND REQ.BODY TO UPDATGE FUNCTION
    // creer une method location pour trouver une location via lat/lon, si not found, on creer la location, on retourne l'id qu on vient de creer et on transmet un json de type 
    const updateUser = yield User.update(req.body);
    if (updateUser)
        return res.status(200).json(`You're profile has been successfully updated !`);
    // const userToUpdateFinal = {
    //   "id": 24,
    //   "email": "nami@test.com",
    //   "last_name": "Nami",
    //   "first_name": "Nami",
    //   "location_id": 1,
    //   "car_id": 1
    // }
    try {
        const userId = +req.params.userId;
        if (isNaN(userId))
            throw new ErrorApi(`Id must be a number`, req, res, 400);
        const user = yield User.findOne(userId);
        if (!user)
            throw new ErrorApi("User not found", req, res, 400);
        // if (req.body.location !== undefined && isNaN(req.body.location)) {
        //   const existingLocation = await Location.findOrCreateLocation(req.body.location);
        //   if (existingLocation) req.body.location = existingLocation;
        // }
        // if (req.body.categories) await Category.updateCategories(req.body.categories, userId);
        // if (email) {
        //   if (!emailValidator.validate(email))
        //     return res.status(500).json({ error: `${email} invalide !` });
        // }
        // if (password === "") {
        //   req.body.password = user.rows[0].password;
        // } else {
        //   if (!schema.validate(password))
        //     return res
        //       .status(500)
        //       .json({
        //         error: "Le mot de passe doit contenir au moins 6 caractères, une majuscule et un caractère spécial.",
        //       });
        //   req.body.password = await bcrypt.hash(password, 10);
        // }
        // if (username) validation.body(usernameSchema);
        // await User.updateUser(userId, req.body);
        res.status(200).json({ message: "L'utilisateur a bien été mis à jour" });
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
    var _b, _c;
    try {
        const userId = +req.params.userId;
        if (isNaN(userId))
            throw new ErrorApi(`Id must be a number`, req, res, 400);
        const user = yield User.findOne(userId);
        if (!user)
            throw new ErrorApi(`User doesn't exist`, req, res, 400);
        const isUser = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        if (isUser === userId || ((_c = req.user) === null || _c === void 0 ? void 0 : _c.is_admin)) {
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
