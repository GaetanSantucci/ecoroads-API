import { Request, Response } from 'express'
import { User } from '../datamapper/user.js';

import bcrypt from 'bcrypt';


//? ----------------------------------------------------------- GET ALL USERS
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const usersList = await User.findAll();
    console.log('usersList: ', usersList);
    return res.json(usersList)
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ "error": error.message })
    }
  }
}


//? ----------------------------------------------------------- CREATE USER
const signUp = async (req: Request, res: Response) => {
  const { email, password, last_name, first_name } = req.body
  try {
    const isExist = await User.findUserIdentity(email)
    console.log('isExist: ', isExist);
    if (!isExist) return res.status(401).json({ "error": "User already exists" });
    // regex to test if pattern valid
    const regexMail = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/
    const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/

    const emailIsValid = regexMail.test(req.body.email)
    if (!emailIsValid) return res.json({ "error": "Format of the email is not valid" })

    const passwordIsSecure = regexPassword.test(req.body.password)
    if (!passwordIsSecure) return res.json({ "error": "Password not secure : min 6 characters, an upper case and a special character" })

    req.body.password = await bcrypt.hash(password, 10);

    if (!last_name) return res.json({ "error": "Lastname required" });
    if (!first_name) return res.json({ "error": "Firstname required" });
    const createUser = await User.create(req.body)
    // console.log('createUser: ', createUser);
    if (createUser) return res.json("User has signed up !")

  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ "error": error.message })
    }
  }
}


//? ----------------------------------------------------------- LOGIN
const signIn = async (req: Request, res: Response) => {
  const email: string = req.body.email;
  try {
    const user = await User.findUserIdentity(email);
    return res.json(user)
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ "error": error.message })
    }
  }
}

//? ----------------------------------------------------------- GET USER PROFILE
const getUserProfile = async (req: Request, res: Response) => {
  try {

  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ "error": error.message })
    }
  }
}

//? ----------------------------------------------------------- LOGOUT
const signOut = async (req: Request, res: Response) => {
  try {
    res.json("User has been disconnected !")
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ "error": error.message })
    }
  }
}


//? ----------------------------------------------------------- UPDATE USER
const updateUser = async (req: Request, res: Response) => {
  try {
    res.json("User was successfully updated !")
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ "error": error.message })
    }
  }
}


//? ----------------------------------------------------------- DELETE USER
const deleteUser = async (req: Request, res: Response) => {
  try {
    res.json("User has been deleted !")
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ "error": error.message })
    }
  }
}


export { getAllUsers, signUp, signIn, signOut, getUserProfile, updateUser, deleteUser } 