import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:{
      //// Required for self-signed certs (e.g., Neon)
    rejectUnauthorized: false 
  }
});

const setup = async ()=>{
    const client = await pool.connect();
    try{
        console.log("NEON is connected !");
    }catch(err){
        console.error(err.stack);
    }finally{
        client.release();
    }
}

export {setup};
export default pool;
