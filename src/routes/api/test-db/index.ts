import type { RequestHandler } from '@builder.io/qwik-city';
import { pool } from '~/lib/db';

export const onGet: RequestHandler = async ({ json }) => {
  try {
    console.log('Testing database connection...');
    console.log('Database URL:', process.env.DATABASE_URL);
    
    // Test basic connection
    const result = await pool.query('SELECT NOW() as current_time');
    console.log('Connection test successful:', result.rows[0]);
    
    // Test table existence
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('Available tables:', tablesResult.rows);
    
    // Test specific table
    const yearStatsTest = await pool.query('SELECT COUNT(*) FROM "yearstatistics"');
    console.log('yearStatistics count:', yearStatsTest.rows[0]);
    
    json(200, {
      success: true,
      currentTime: result.rows[0].current_time,
      tables: tablesResult.rows.map(row => row.table_name),
      yearStatisticsCount: yearStatsTest.rows[0].count
    });
    
  } catch (error) {
    console.error('Database test error:', error);
    json(500, { 
      error: 'Database test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
};
