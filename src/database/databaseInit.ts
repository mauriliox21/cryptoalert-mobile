import { SQLiteDatabase } from "expo-sqlite";

export async function databaseInit(database: SQLiteDatabase){
    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS user (
            id INTEGER PRYMARY KEY NOT NULL,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            access_token TEXT NOT NULL
        );
    `)
}