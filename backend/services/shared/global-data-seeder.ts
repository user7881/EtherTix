import { User } from '../authentication/src/models/user-model';
import {Event} from '../events/src/models/event-model';
import connectAuthDatabase from '../authentication/src/database/auth-db';
import connectEventsDatabase from '../events/src/database/event-db';
import fs from "fs";
import path from 'path';

const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../authentication/src/data/users.json')).toString()) as unknown as string;
const events = JSON.parse(fs.readFileSync(path.join(__dirname, '../events/src/data/events.json')).toString()) as unknown as string;

connectAuthDatabase();
connectEventsDatabase();

export const loadAllData = async (): Promise<any> => {

    try {

        if(users !== null && events !== null) {
            await User.create(users);
            await Event.create(events);
        
            console.log(`User data imported to DB`);
    
            return process.exit(1);
        }

    } 
    
    catch(err: any) {

        if(err) {
            return console.error(err )
        }
    }


}

export const removeAllData = async (): Promise<any> => {

    try {

        await User.remove();
        await Event.remove();

        console.log(`All data removed from database...`);

        return process.exit(1);
    } 
    
    catch(err: any) {
        
        if(err) {
            return console.log(err);
        }
    }


}

// Handle command line args
if(process.argv[2] === '--import') {
   loadAllData();
}

if(process.argv[2] === '--delete') {
   removeAllData();
}