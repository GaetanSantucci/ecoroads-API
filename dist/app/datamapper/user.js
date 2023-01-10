// import { pool } from '../services/dbClient.js'
import coreModel from '../services/coreDatamapper.js';
class User extends coreModel {
    constructor() {
        super(...arguments);
        this.tableName = 'users';
    }
    getAllUsers() {
        this.getAll(this.tableName);
    }
}
console.log(User);
// const findAll = async () => {
//   const result = await pool.query(`SELECT * FROM "user"`)
//   return result
// }
export default User;
