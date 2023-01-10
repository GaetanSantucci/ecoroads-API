import { Request, Response } from 'express'
import { User } from '../datamapper/user.js';


//? ----------------------------------------------------------- GET ALL USERS
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const usersList = await User.findAll();
    res.json(usersList)
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ "error": error.message })
    }
  }
}


//? ----------------------------------------------------------- CREATE USER
const signUp = async (req: Request, res: Response) => {
  try {
    res.json("User has signed up !")
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


export { getAllUsers, signUp, signIn, signOut, updateUser, deleteUser } 