/** Run after DATABASE_URL is configured: bun run db:seed */
import { db } from "./index"; import { produceCategories, regionalPrices } from "./schema";
const categories=["Vegetables","Fruits","Grains","Pulses","Spices"];
async function seed(){for(const name of categories){const id=name.toLowerCase();await db.insert(produceCategories).values({id,name,unitOptions:["kg","quintal","tonne"]}).onConflictDoNothing();await db.insert(regionalPrices).values({id:`${id}-telangana`,categoryId:id,region:"Telangana",avgPricePerUnit:name==="Vegetables"?30:55,sampleDate:new Date()}).onConflictDoNothing();}console.log("AgriLink categories and regional baseline prices seeded.");process.exit(0)} seed().catch(error=>{console.error(error);process.exit(1)});
