// lib/db.ts
import { Pool } from 'pg';

// Initialize a connection pool.
// In a real production environment, these connection details should come from environment variables.
// For example: process.env.POSTGRES_USER, process.env.POSTGRES_HOST, etc.
// For now, we will use placeholder values. You should replace them with your actual
// local or development database credentials.

const pool = new Pool({
  user: 'your_db_user',
  host: 'your_db_host',
  database: 'your_db_name',
  password: 'your_db_password',
  port: 5432,
});

// The query function will be used by all other services to interact with the database.
export const query = async (text: string, params: any[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Error executing query', { text, error });
    throw error;
  }
};

// Example of how to use this query function in a service:
/*
import { query } from './db';

export const getUsers = async () => {
  const { rows } = await query('SELECT * FROM users', []);
  return rows;
}
*/
