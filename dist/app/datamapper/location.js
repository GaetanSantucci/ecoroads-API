var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import pg from 'pg';
import { client } from '../services/dbClient.js';
import { CoreDataMapper } from './coreDatamapper.js';
// import debug from 'debug';
// const logger = debug('Datamapper');
class LocationDataMapper extends CoreDataMapper {
    constructor() {
        super(...arguments);
        this.tableName = 'location';
        this.columns = `"id","label","address","street_number","zipcode","city","lat","lon"`;
        this.createFunctionName = 'create_location';
        this.updateFunctionName = 'update_location';
        this.findLocation = 'find_location';
    }
    //& If need to create specific method for LocationDataMapper
    findLocationByLatAndLon(lat, lon) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.client instanceof pg.Pool) {
                const preparedQuery = {
                    "text": `SELECT * FROM ${this.findLocation}($1, $2)`,
                    "values": [lat, lon]
                };
                const result = yield this.client.query(preparedQuery);
                if (!result.rows[0])
                    return null;
                return result.rows[0];
            }
        });
    }
}
// todo Pourquoi 
const Location = new LocationDataMapper(client);
export { Location };
