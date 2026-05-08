import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
//console.log(process.env.password);
const client = new Client({
  host: 'aws-1-ap-south-1.pooler.supabase.com',
  port: 6543,
  user: 'postgres.ilparceoehgmlkpyhrzv',
  password: process.env.password,
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false
  }
})
async function run() {
  await client.connect()
  const res = await client.query('SELECT * FROM investors;')
  //console.log(res.rows)
  //await client.end()
}
run()
export default client;