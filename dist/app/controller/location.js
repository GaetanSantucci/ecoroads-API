var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ErrorApi } from '../services/errorHandler.js';
import { Location } from '../datamapper/location.js';
import debug from 'debug';
const logger = debug('Controller');
// ? -------------------------------------------------------- Get All Locations
const getAllLocations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const locationList = yield Location.findAll();
        if (!locationList)
            throw new ErrorApi('No locations found', req, res, 400);
        return res.status(200).json(locationList);
    }
    catch (err) {
        if (err instanceof Error)
            logger(err.message);
    }
});
// ? -------------------------------------------------------- Get One Location
const getLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const locationId = +req.params.locationId;
        if (isNaN(locationId))
            throw new ErrorApi(`Id must be a number`, req, res, 400);
        const location = yield Location.findOne(locationId);
        if (!location)
            throw new ErrorApi('No location found', req, res, 400);
        return res.status(200).json(location);
    }
    catch (err) {
        if (err instanceof Error)
            logger(err.message);
    }
});
// ? -------------------------------------------------------- Create Location
const createLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // todo implement AJV schema in middleware to validate input format 
        // check if location already exists
        const { lat, lon } = req.body;
        logger('lat, lon: ', lat, lon);
        const locationExists = yield Location.findLocationByLatAndLon(lat, lon);
        logger('locationExists: ', locationExists);
        if (locationExists)
            throw new ErrorApi('Location already exists', req, res, 400);
        // create location if not exists
        const result = yield Location.create(req.body);
        if (result === null || result === void 0 ? void 0 : result.rowCount)
            return res.status(200).json('Location has been successfully created');
    }
    catch (err) {
        if (err instanceof Error)
            logger(err.message);
    }
});
// ? -------------------------------------------------------- Update Location
const updateLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const locationId = +req.params.locationId;
        if (isNaN(locationId))
            throw new ErrorApi(`Id must be a number`, req, res, 400);
        const location = yield Location.findOne(locationId);
        if (!location)
            throw new ErrorApi('Location not found', req, res, 400);
        const result = yield Location.update(req.body);
        if (result)
            return res.status(200).json('Location has been successfully updated');
    }
    catch (err) {
        if (err instanceof Error)
            logger(err.message);
    }
});
// ? -------------------------------------------------------- Delete Location
const deleteLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const locationId = +req.params.locationId;
        if (isNaN(locationId))
            throw new ErrorApi(`Id must be a number`, req, res, 400);
        const location = yield Location.findOne(locationId);
        if (!location)
            throw new ErrorApi('Location not found', req, res, 400);
        const result = yield Location.delete(locationId);
        if (result)
            return res.status(200).json('Location has been successfully deleted');
    }
    catch (err) {
        if (err instanceof Error)
            logger(err.message);
    }
});
export { getAllLocations, getLocation, createLocation, updateLocation, deleteLocation };
