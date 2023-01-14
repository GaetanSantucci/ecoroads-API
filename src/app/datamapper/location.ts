import pg from 'pg';
import { client } from '../services/dbClient.js';
import { CoreDataMapper } from './coreDatamapper.js';

// import debug from 'debug';
// const logger = debug('Datamapper');

class LocationDataMapper extends CoreDataMapper {
  tableName = 'location';
  columns = `"id","label","address","street_number","zipcode","city","lat","lon"`

  createFunctionName = 'create_location';
  findLocation = 'find_location'

  //& If need to create specific method for LocationDataMapper
  async findLocationByLatAndLon(lat: number, lon: number) {
    if (this.client instanceof pg.Pool) {
      const preparedQuery = {
        "text": `SELECT * FROM ${this.findLocation}($1, $2)`,
        "values": [lat, lon]
      }

      const result = await this.client.query(preparedQuery)
      if (!result.rows[0]) return null;
      return result.rows[0]
    }
  }
}

// todo Pourquoi 
const Location = new LocationDataMapper(client);
export { Location }