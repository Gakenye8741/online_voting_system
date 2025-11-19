// Imports
import "dotenv/config"
import { drizzle } from "drizzle-orm/node-postgres"
import { Client } from "pg"
import * as schema from "../drizzle/schema"

// define Client
export const client =new Client({
    connectionString: process.env.DATABASE_URL as string,
})

// establish connection
const main = async ()=>{
   await client.connect()
}
// Catch the errors
main().catch(console.error);

const db = drizzle(client, {schema,logger: true});

export default db;