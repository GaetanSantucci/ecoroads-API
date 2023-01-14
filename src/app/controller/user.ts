import { Request, Response } from 'express'
import { ErrorApi } from '../services/errorHandler.js';

import { User } from '../datamapper/user.js';
import { Location } from '../datamapper/location.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';

import debug from 'debug';
const logger = debug('Controller');
import bcrypt from 'bcrypt';

//? ----------------------------------------------------------- GET ALL USERS
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const usersList = await User.findAll();
    return res.status(200).json(usersList)
  } catch (err) {
    if (err instanceof Error) logger(err.message)
  }
}


//? ----------------------------------------------------------- CREATE USER
const signUp = async (req: Request, res: Response) => {
  const { email, password, last_name, first_name } = req.body
  logger('req.body: ', req.body);
  try {
    const isExist = await User.findUserIdentity(email)
    if (isExist) throw new ErrorApi(`User with email ${isExist.email} already exists`, req, res, 401);

    // regex to test if pattern valid
    // eslint-disable-next-line no-useless-escape
    const regexMail = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/
    const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/

    // Make control before send data to create user
    const emailIsValid = regexMail.test(req.body.email)
    if (!emailIsValid) throw new ErrorApi(`Format of the email is not valid`, req, res, 400)

    const passwordIsSecure = regexPassword.test(req.body.password)
    if (!passwordIsSecure) throw new ErrorApi(`Password not secure : min 6 characters, an upper case and a special character`, req, res, 400)

    req.body.password = await bcrypt.hash(password, 10);

    if (!last_name) throw new ErrorApi(`Lastname required`, req, res, 400);
    if (!first_name) throw new ErrorApi(`Firstname required`, req, res, 400);

    const createUser = await User.create(req.body)
    if (createUser) return res.status(201).json(`User has signed up !`)

  } catch (err) {
    if (err instanceof Error) logger(err.message)
  }
}


//? ----------------------------------------------------------- LOGIN
const signIn = async (req: Request, res: Response) => {
  // on recupere mot de passe + email 
  const { email, password } = req.body
  logger('req.body: ', req.body);

  try {
    const userExist = await User.findUserIdentity(email);
    if (!userExist) throw new ErrorApi(`User not found`, req, res, 401);

    // verify if password is the same with user.password
    const validPassword = await bcrypt.compare(password, userExist.password);
    if (!validPassword) throw new ErrorApi(`Incorrect password`, req, res, 403);

    // delete user.password;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [`password`]: remove, ...user } = userExist;

    // Create token JWT
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user, req);

    const userIdentity = { ...user, accessToken, refreshToken }

    return res.status(200).json(userIdentity)

  } catch (err) {
    if (err instanceof Error) logger(err.message)
  }
}

//? ----------------------------------------------------------- GET USER PROFILE
const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = +req.params.userId;
    if (isNaN(userId)) throw new ErrorApi(`Id must be a number`, req, res, 400);

    const user = await User.findOne(userId);
    return res.status(200).json(user)
  } catch (err) {
    if (err instanceof Error) logger(err.message)
  }
}

//? ----------------------------------------------------------- LOGOUT
const signOut = async (req: Request, res: Response) => {
  try {
    return res.status(200).json(`User has been disconnected !`)
  } catch (err) {
    if (err instanceof Error) logger(err.message)
  }
}


//? ----------------------------------------------------------- UPDATE USER
const updateUser = async (req: Request, res: Response) => {

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
  const location = await Location.findLocationByLatAndLon(lat, lon);
  if (location) {
    req.body.location = location.id;
  } else {
    const locationToCreate = {
      ...req.body.location,
      user_id: req.body.id
    }
    await Location.create(locationToCreate)
  }

  // CHECK IF EMAIL NOT EXIST
  const isExist = await User.findUserIdentity(req.body.email)
  if (isExist) throw new ErrorApi(`User with email ${isExist.email} already exists, choose another !`, req, res, 401);
  // CHECK PASSWORD AND HASH
  // regex to test if pattern valid
  // eslint-disable-next-line no-useless-escape
  const regexMail = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/
  const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/

  // Make control before send data to create user
  const emailIsValid = regexMail.test(req.body.email)
  if (!emailIsValid) throw new ErrorApi(`Format of the email is not valid`, req, res, 400)

  const passwordIsSecure = regexPassword.test(req.body.password)
  if (!passwordIsSecure) throw new ErrorApi(`Password not secure : min 6 characters, an upper case and a special character`, req, res, 400)

  req.body.password = await bcrypt.hash(req.body.password, 10);
  // SEND REQ.BODY TO UPDATGE FUNCTION
  // creer une method location pour trouver une location via lat/lon, si not found, on creer la location, on retourne l'id qu on vient de creer et on transmet un json de type 
  const updateUser = await User.update(req.body)
  if (updateUser) return res.status(200).json(`You're profile has been successfully updated !`)
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
    if (isNaN(userId)) throw new ErrorApi(`Id must be a number`, req, res, 400);

    const user = await User.findOne(userId);

    if (!user) throw new ErrorApi("User not found", req, res, 400);

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

    res.status(200).json("User successfully updated !")
  } catch (err) {
    if (err instanceof Error) logger(err.message)
  }
}


//? ----------------------------------------------------------- DELETE USER
const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = +req.params.userId;
    if (isNaN(userId)) throw new ErrorApi(`Id must be a number`, req, res, 400);

    const user = await User.findOne(userId);
    if (!user) throw new ErrorApi(`User doesn't exist`, req, res, 400);

    const isUser = req.user?.id;
    if (isUser === userId || req.user?.is_admin) {

      const userDeleted = await User.delete(userId);

      if (userDeleted) return res.status(200).json(`User has been deleted !`)

    } else throw new ErrorApi(`You cannot access this info !`, req, res, 401);
  } catch (err) {
    if (err instanceof Error) logger(err.message)
  }
}


export { getAllUsers, signUp, signIn, signOut, getUserProfile, updateUser, deleteUser } 