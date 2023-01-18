import { Request, Response } from 'express'
import { ErrorApi } from '../services/errorHandler.js';

import { Validator } from '../utils/validator.js';

import { User } from '../datamapper/user.js';
import { Location } from '../datamapper/location.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';

import debug from 'debug';
const logger = debug('Controller');
import bcrypt from 'bcrypt';

//? ----------------------------------------------------------- GET ALL USERS
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const userList = await User.findAll();
    if (!userList) throw new ErrorApi('No users found', req, res, 400);
    return res.status(200).json(userList)
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

    Validator.checkEmailPattern(email, req, res);
    Validator.checkPasswordPattern(password, req, res);


    // regex to test if pattern valid
    // eslint-disable-next-line no-useless-escape
    // const regexMail = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/
    // const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/

    // // Make control before send data to create user
    // const emailIsValid = regexMail.test(req.body.email)
    // if (!emailIsValid) throw new ErrorApi(`Format of the email is not valid`, req, res, 400)

    // const passwordIsSecure = regexPassword.test(req.body.password)
    // if (!passwordIsSecure) throw new ErrorApi(`Password not secure : min 6 characters, an upper case and a special character`, req, res, 400)

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

  try {
    const userId = +req.params.userId;
    if (isNaN(userId)) throw new ErrorApi(`Id must be a number`, req, res, 400);

    // Check if user exist     
    const userExist = await User.findOne(userId);
    if (!userExist) throw new ErrorApi(`User not found`, req, res, 401);

    const { lat, lon } = req.body.location;
    const location = await Location.findLocationByLatAndLon(lat, lon);
    // Check if location already exist
    // if exist, insert into table pivot tu userId et the locationId and table user will be automatically updated with trigger
    if (location) {
      await User.updateUserLocation(location.id, userId)
    } else {
      // if location not found, create the new location and after insert into table pivot userId and locationId, table user will be automatically updated with trigger
      const newLocationCreated = await Location.create(req.body.location)
      if (newLocationCreated) {
        const locationId = newLocationCreated.locationId.create_location
        await User.updateUserLocation(locationId, userId)
      }
    }

    // CHECK IF EMAIL NOT EXIST
    if (req.body.email) {
      const isExist = await User.findUserIdentity(req.body.email)
      if (isExist && !req.body.email) throw new ErrorApi(`User with email ${isExist.email} already exists, choose another !`, req, res, 401);
      Validator.checkEmailPattern(req.body.email, req, res);
    }

    // CHECK PASSWORD AND HASH
    if (req.body.password) {
      Validator.checkPasswordPattern(req.body.password, req, res);
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const userUpdated = await User.update(req.body);
    if (userUpdated) return res.status(200).json("User successfully updated !")
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