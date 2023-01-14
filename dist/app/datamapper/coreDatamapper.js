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
class CoreDataMapper {
    constructor(client) {
        this.client = client;
    }
    //& Create
    create(inputData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.client instanceof pg.Pool) {
                const preparedQuery = {
                    text: `SELECT ${this.createFunctionName}($1);`,
                    values: [inputData]
                };
                const result = yield this.client.query(preparedQuery);
                console.log('Retour creation location: ', result);
                return result.rowCount;
            }
        });
    }
    //& FindAll
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.client instanceof pg.Pool) {
                const preparedQuery = {
                    text: `
                    SELECT ${this.columns}
                    FROM "${this.tableName}"
                    ORDER BY "id";`
                };
                const result = yield this.client.query(preparedQuery);
                return result.rows;
            }
        });
    }
    //& FindOne
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.client instanceof pg.Pool) {
                const preparedQuery = {
                    text: `
                    SELECT ${this.columns} 
                    FROM "${this.tableName}"
                    WHERE "id" = $1;
                    `,
                    values: [id]
                };
                const result = yield this.client.query(preparedQuery);
                if (!result.rows[0])
                    return null;
                return result.rows[0];
            }
        });
    }
    //& Update
    update(inputData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.client instanceof pg.Pool) {
                const preparedQuery = {
                    text: `SELECT * FROM ${this.updateFunctionName}($1);`,
                    values: [inputData]
                };
                const result = yield this.client.query(preparedQuery);
                return result.rowCount;
            }
        });
    }
    //& Delete
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.client instanceof pg.Pool) {
                const preparedQuery = {
                    text: `DELETE FROM "${this.tableName}"
               WHERE "id" = $1;`,
                    values: [id]
                };
                const result = yield this.client.query(preparedQuery);
                return result.rowCount;
            }
        });
    }
}
export { CoreDataMapper };
