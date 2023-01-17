import pg from 'pg';
import { client } from '../services/dbClient.js';
import { CoreDataMapper } from './coreDatamapper.js';

class UserDataMapper extends CoreDataMapper {
  tableName = 'user';
  columns = `"id","email","last_name","first_name"`

  createFunctionName = 'create_user';
  updateFunctionName = 'update_user';
  userIdentity = 'user_identity';
  createUserLocation = 'create_user_location';

  //& Find user by email
  async findUserIdentity(email: string) {
    if (this.client instanceof pg.Pool) {
      const preparedQuery = {
        text: `SELECT * FROM "${this.userIdentity}"($1);`,
        values: [email]
      };

      const result = await this.client.query(preparedQuery);
      console.log('result User: ', result.rows[0]);
      if (!result.rows[0]) return null;
      return result.rows[0];
    }
  }

  async updateUserLocation(locationId: number, userId: number) {
    if (this.client instanceof pg.Pool) {
      const preparedQuery = {
        text: `SELECT * FROM "${this.createUserLocation}"($1, $2);`,
        values: [locationId, userId]
      }

      const result = await this.client.query(preparedQuery);
      return result
    }
  }

}

const User = new UserDataMapper(client);
export { User }
