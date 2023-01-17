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
class UserDataMapper extends CoreDataMapper {
    constructor() {
        super(...arguments);
        this.tableName = 'user';
        this.columns = `"id","email","last_name","first_name"`;
        this.createFunctionName = 'create_user';
        this.updateFunctionName = 'update_user';
        this.userIdentity = 'user_identity';
        this.createUserLocation = 'create_user_location';
    }
    //& Find user by email
    findUserIdentity(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.client instanceof pg.Pool) {
                const preparedQuery = {
                    text: `SELECT * FROM "${this.userIdentity}"($1);`,
                    values: [email]
                };
                const result = yield this.client.query(preparedQuery);
                console.log('result User: ', result.rows[0]);
                if (!result.rows[0])
                    return null;
                return result.rows[0];
            }
        });
    }
    updateUserLocation(locationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.client instanceof pg.Pool) {
                const preparedQuery = {
                    text: `SELECT * FROM "${this.createUserLocation}"($1, $2);`,
                    values: [locationId, userId]
                };
                const result = yield this.client.query(preparedQuery);
                return result;
            }
        });
    }
}
const User = new UserDataMapper(client);
export { User };
