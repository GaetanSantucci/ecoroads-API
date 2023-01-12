import pg from 'pg';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface CoreDataMapper {
  client: object;
  tableName: string;
  columns: string;

  createFunctionName: string;
  updateFunctionName: string;

  allProjectsWithCategories: string;
  userIdentity: string;
  articlesByUser: string;
  articleByUser: string;
  goldenBookTicketByUser: string;

  projectsByUser: string;
  projectByUser: string;

  createWithCategoriesFunctionName: string;
  updateWithCategoriesFunctionName: string;
}

class CoreDataMapper {
  constructor(client: object) {
    this.client = client;
  }

  //& Create
  async create(inputData: object) {
    if (this.client instanceof pg.Pool) {
      const preparedQuery = {
        text: `SELECT ${this.createFunctionName}($1);`,
        values: [inputData]
      };

      const result = await this.client.query(preparedQuery);
      return result.rowCount;
    }
  }
  //& FindAll
  async findAll() {
    if (this.client instanceof pg.Pool) {
      const preparedQuery = {
        text: `
                    SELECT ${this.columns}
                    FROM "${this.tableName}"
                    ORDER BY "id";`
      };

      const result = await this.client.query(preparedQuery);
      return result.rows;
    }
  }

  //& FindOne
  async findOne(id: number | undefined) {
    if (this.client instanceof pg.Pool) {
      const preparedQuery = {
        text: `
                    SELECT ${this.columns} 
                    FROM "${this.tableName}"
                    WHERE "id" = $1;
                    `,
        values: [id]
      };

      const result = await this.client.query(preparedQuery);

      if (!result.rows[0]) return null;

      return result.rows[0];
    }
  }

  //& Update
  async update(inputData: object) {
    if (this.client instanceof pg.Pool) {
      const preparedQuery = {
        text: `SELECT * FROM ${this.updateFunctionName}($1);`,
        values: [inputData]
      };
      const result = await this.client.query(preparedQuery);

      return result.rowCount;
    }
  }

  //& Delete
  async delete(id: number) {
    if (this.client instanceof pg.Pool) {
      const preparedQuery = {
        text: `DELETE FROM "${this.tableName}"
               WHERE "id" = $1;`,
        values: [id]
      };

      const result = await this.client.query(preparedQuery);

      return result.rowCount;
    }
  }
}

export { CoreDataMapper };