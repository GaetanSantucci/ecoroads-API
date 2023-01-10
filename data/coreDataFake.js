import 'dotenv/config';
import { faker } from '@faker-js/faker/locale/en';
import pg from 'pg';
const client = new pg.Pool();

class CoreDataFake {
  //& FAKER => https://fakerjs.dev/api/

  //~ -------------------------------------- CONFIGURATION
  maxFakeData = 4;

  listAllData = [
    {
      // user: {
      //   email: faker.internet.email(),
      //   password: 'Test1234!',
      //   last_name: faker.name.lastName(),
      //   first_name: faker.name.firstName(),
      // },
      vehicle: {
        registration: faker.vehicle.vrm(),
        // brand: faker.vehicle.manufacturer(),
        brand_id: faker.datatype.number({ min: 19, max: 26 }),
        model: faker.vehicle.model(),
        // color: faker.vehicle.color(),
      },
      // brand: {
      //   name: faker.vehicle.manufacturer(),
      // }
      // reservation: {
      //   date_start: '2079-04-17T18:03:24.956Z',
      //   date_end: '2089-04-17T18:03:24.956Z',
      //   vehicle_id: 1,
      // },
    },
  ];

  //~ -------------------------------------- METHODS

  //& -------------------------------------- INITIALIZATION
  init = async () => {
    // Pour chaques objects (nom des tables) composants listAllData on boucle dessus
    for (const tableName in this.listAllData[0]) {
      // On génères toutes les nouvelles fake data qu'on insère dans un tableau (arrayAllNewData)
      const arrayAllNewData = await this.generateAllFakeData(tableName);

      // On restructures les données pour quelles puissent correspondre au bouclage de la requête SQL
      const restructuringData = await this.restructuringData(arrayAllNewData);

      // On envois les données restructuré à la requête SQL
      await this.insertItems(tableName, restructuringData);
    }
  };

  //& -------------------------------------- RESTRUCTURING DATA
  restructuringData = async (arrayAllNewData) => {
    const namesColumns = [];
    const valuesColumns = [];

    for (const oneData of arrayAllNewData) {
      for (const [nameTable, valueTable] of Object.entries(oneData)) {
        const arrayAllnamesColumns = [];
        const arrayAllvaluesProps = [];

        for (const [nameColumn, valueProp] of Object.entries(valueTable)) {
          arrayAllnamesColumns.push(`"${nameColumn}"`);
          arrayAllvaluesProps.push(`'${valueProp}'`);
        }

        namesColumns.push(arrayAllnamesColumns);
        valuesColumns.push(arrayAllvaluesProps);
      }
    }
    return { namesColumns: namesColumns[0], valuesColumns: valuesColumns };
  };

  //& -------------------------------------- GENERATE ALL FAKE DATA
  generateAllFakeData = async (tableName) => {
    const arrayAllData = [];

    for (let i = 0; i < this.maxFakeData; i++) {
      // Utilisation d'une nouvelle instance à chaque boucle pour généré correctement de nouvelle donnée aléatoire
      const coreDataFake = new CoreDataFake();
      arrayAllData.push({ [tableName]: await coreDataFake.generateFakeData(tableName) });
    }
    return arrayAllData;
  };

  //& -------------------------------------- GENERATE FAKE DATA
  generateFakeData = async (tableName) => {
    // On renvoi une donnée généré aléatoirement avec l'utilisation de faker
    return this.listAllData[0][tableName];
  };

  //& -------------------------------------- INSERT METHODS
  insertItems = async (tableName, restructuringData) => {
    /* 
    --------------------------------------

      tableName:  vehicle
      restructuringData:  {
        namesColumns: [ '"registration"', '"brand"', '"model"', '"color"' ],
        valuesColumns: [
          [ "'FS85VIN'", "'Ford'", "'Grand Cherokee'", "'grey'" ],
          [ "'WH65YMJ'", "'Audi'", "'Civic'", "'lavender'" ]
        ]
      }

    -------------------------------------- 
    */
    const { namesColumns, valuesColumns } = restructuringData;

    let query = `INSERT INTO "${tableName}"(${namesColumns}) VALUES `;

    for (let counter = 0; counter < this.maxFakeData; counter++) {
      query += `(${valuesColumns[counter]})`;
      // Condition de garde pour ne pas avoir de ',' à la fin de notre boucle
      if (counter < this.maxFakeData - 1) query += `,`;
    }

    query += ';';

    await client.query(query);
    console.log(`DATA ${tableName.toUpperCase()} => OK: `, query);
  };
}

const coreDataFake = new CoreDataFake();
await coreDataFake.init();