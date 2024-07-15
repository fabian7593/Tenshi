import "reflect-metadata";
import {createConnection} from "typeorm";

createConnection().then(async connection => {

    console.log("First Migration DB...");
  
}).catch(error => console.log(error));
