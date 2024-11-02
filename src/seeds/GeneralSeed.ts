//*************************************** */
//              Configuration
//*************************************** */
import path from 'path';
import ConfigManager from '@TenshiJS/config/ConfigManager';

//set configuration first time
const configPath = path.resolve(__dirname, '../../tenshi-config.json');
const configManager = ConfigManager.getInstance(configPath);
const config = configManager.getConfig();

import { DataSource } from 'typeorm';
import { UnitDynamicCentral } from '@index/entity/UnitDynamicCentral';


async function createDatabaseIfNotExists() {
  // Step 1: Connect to MySQL without specifying a database
  const tempDataSource = new DataSource({
      type: config.DB.TYPE, // Type of the database
      host: config.DB.HOST, // Host of the database
      port: config.DB.PORT, // Port of the database
      username: config.DB.USER, // Username for the database
      password: config.DB.PASSWORD, // Password for the database
  });

  await tempDataSource.initialize();

  // Step 2: Create the database if it does not exist
  await tempDataSource.query(`CREATE DATABASE IF NOT EXISTS \`${config.DB.NAME}\``);
  await tempDataSource.destroy(); // Close the temporary connection
}


async function runSeed() {
 
    await createDatabaseIfNotExists();
    /*
        Init Datasource
    */
    const dataSource = new DataSource({
        type: config.DB.TYPE, // Type of the database
        host: config.DB.HOST, // Host of the database
        port: config.DB.PORT, // Port of the database
        username: config.DB.USER, // Username for the database
        password: config.DB.PASSWORD, // Password for the database
        database: config.DB.NAME, // Name of the database
        entities: [UnitDynamicCentral], // Array of entities to be used
        synchronize: true, // Synchronize the schema with the database
        extra: {
            connectionLimit: 150, 
        },
    });
    

    await dataSource.initialize();



    /*
        Unit Dynamic Central Data Set
    */
    const udcRepository = dataSource.getRepository(UnitDynamicCentral);

    //Camp Types
    const udcCampTypes = [
        { name: "Half-Term Camp", code: "HALF_TERM_CAMP", type: "CAMP_TYPES"  as "CAMP_TYPES"  },
        { name: "Christmas Camp", code: "CHRISTMAS_CAMP", type: "CAMP_TYPES"  as "CAMP_TYPES"  },
        { name: "Easter Camp", code: "EASTER_CAMP", type: "CAMP_TYPES"  as "CAMP_TYPES"  },
        { name: "Summer Camp", code: "SUMMER_CAMP", type: "CAMP_TYPES"  as "CAMP_TYPES"  }
    ];
    await udcRepository.upsert(udcCampTypes, ["code"]);


    // Event Types
    const udcEventTypes = [
        { name: "User Changes", code: "USER_CHANGES_ET", type: "EVENT_TYPES"  as "EVENT_TYPES"  },
        { name: "Submit Feedback", code: "SUBMIT_FEEDBACK_ET", type: "EVENT_TYPES" as "EVENT_TYPES" },
        { name: "Add to Waiting List", code: "ADD_TO_WAITING_LIST_ET", type: "EVENT_TYPES" as "EVENT_TYPES" },
        { name: "Book Free Trial", code: "BOOK_FREE_TRIAL_ET", type: "EVENT_TYPES"  as "EVENT_TYPES"},
        { name: "Book Membership", code: "BOOK_MEMBERSHIP_ET", type: "EVENT_TYPES" as "EVENT_TYPES" },
        { name: "Request to Cancel", code: "REQUEST_TO_CANCEL_ET", type: "EVENT_TYPES" as "EVENT_TYPES" },
        { name: "Cancelled", code: "CANCELLED_ET", type: "EVENT_TYPES" as "EVENT_TYPES" },
        { name: "Frozen", code: "FROZEN_ET", type: "EVENT_TYPES" as "EVENT_TYPES" }
    ];
    await udcRepository.upsert(udcEventTypes, ["code"]);


  
      console.log("General seed done!");
}

runSeed().catch((error) => console.error(error));