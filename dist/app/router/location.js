// ~ ROUTER CONFIG ~ //
import { Router } from 'express';
const router = Router();
import { getAllLocations, getLocation, createLocation, updateLocation, deleteLocation } from '../controller/location.js';
router.get('/locations', getAllLocations);
router.get('/locations/:locationId(\\d+)', getLocation);
router.post('/locations/', createLocation);
router.patch('/locations/:locationId(\\d+)', updateLocation);
router.delete('/locations/:locationId(\\d+)', deleteLocation);
export { router };
