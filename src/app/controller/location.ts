import { ErrorApi } from '../services/errorHandler.js';
import { Request, Response } from 'express';
import { Location } from '../datamapper/location.js';

import debug from 'debug';
const logger = debug('Controller');

// ? -------------------------------------------------------- Get All Locations
const getAllLocations = async (req: Request, res: Response) => {
  try {
    const locationList = await Location.findAll();
    if (!locationList) throw new ErrorApi('No locations found', req, res, 400);
    return res.status(200).json(locationList);
  } catch (err) {
    if (err instanceof Error) logger(err.message)
  }
}

// ? -------------------------------------------------------- Get One Location
const getLocation = async (req: Request, res: Response) => {
  try {
    const locationId = +req.params.locationId;
    if (isNaN(locationId)) throw new ErrorApi(`Id must be a number`, req, res, 400);

    const location = await Location.findOne(locationId);
    if (!location) throw new ErrorApi('No location found', req, res, 400);
    return res.status(200).json(location);
  } catch (err) {
    if (err instanceof Error) logger(err.message)
  }
}

// ? -------------------------------------------------------- Create Location
const createLocation = async (req: Request, res: Response) => {
  try {
    // todo implement AJV schema in middleware to validate input format 
    // check if location already exists
    const { lat, lon } = req.body
    const locationExists = await Location.findLocationByLatAndLon(lat, lon)
    if (locationExists) throw new ErrorApi('Location already exists', req, res, 400);

    // create location if not exists
    const result = await Location.create(req.body);
    if (result) return res.status(200).json('Location has been successfully created')
  } catch (err) {
    if (err instanceof Error) logger(err.message)
  }
}

// ? -------------------------------------------------------- Update Location
const updateLocation = async (req: Request, res: Response) => {
  try {
    const locationId = +req.params.locationId;
    if (isNaN(locationId)) throw new ErrorApi(`Id must be a number`, req, res, 400);

    const location = await Location.findOne(locationId)
    if (!location) throw new ErrorApi('Location not found', req, res, 400);

    const result = await Location.update(req.body);
    if (result) return res.status(200).json('Location has been successfully updated')
  } catch (err) {
    if (err instanceof Error) logger(err.message)
  }
};

// ? -------------------------------------------------------- Delete Location
const deleteLocation = async (req: Request, res: Response) => {
  try {
    const locationId = +req.params.locationId;
    if (isNaN(locationId)) throw new ErrorApi(`Id must be a number`, req, res, 400);

    const location = await Location.findOne(locationId)
    if (!location) throw new ErrorApi('Location not found', req, res, 400);
    const result = await Location.delete(locationId);
    if (result) return res.status(200).json('Location has been successfully deleted')
  } catch (err) {
    if (err instanceof Error) logger(err.message)

  }
}

export { getAllLocations, getLocation, createLocation, updateLocation, deleteLocation }