import { Request, Response } from 'express'

const getAllUsers = async (req: Request, res: Response) => {
  try {
    res.json("Users list")
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ "error": error.message })
    }
  }
}

const getUser = async (req: Request, res: Response) => {
  const id: number = +req.params.id
  try {
    res.json(`User number : ${id}`)
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ "error": error.message })
    }
  }
}

const signUp = async (req: Request, res: Response) => {
  try {
    res.json("User has signed up !")
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ "error": error.message })
    }
  }
}

const signIn = async (req: Request, res: Response) => {
  try {
    res.json("User has been successfully connected !")
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ "error": error.message })
    }
  }
}

const signOut = async (req: Request, res: Response) => {
  try {
    res.json("User has been disconnected !")
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ "error": error.message })
    }
  }
}

const updateUser = async (req: Request, res: Response) => {
  try {
    res.json("User was successfully updated !")
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ "error": error.message })
    }
  }
}

const deleteUser = async (req: Request, res: Response) => {
  try {
    res.json("User has been deleted !")
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ "error": error.message })
    }
  }
}


export { getAllUsers, getUser, signUp, signIn, signOut, updateUser, deleteUser } 