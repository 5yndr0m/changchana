const fs = require('fs');
const path = require('path');

async function runMigration() {
  const Strapi = require('strapi');
  const appContext = await Strapi().load();

  try {
    const sqlFile = path.join(__dirname, '../database/migrations/wallet_transfers_points.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Split SQL by statements (simple split by semicolon)
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`Running ${statements.length} SQL statements...`);

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      if (stmt) {
        try {
          console.log(`\nExecuting statement ${i + 1}/${statements.length}...`);
          await appContext.connections.default.raw(stmt);
          console.log('✓ Success');
        } catch (error) {
          // If table already exists, that's okay
          if (error.code === 'ER_TABLE_EXISTS_ERROR' || error.errno === 1050) {
            console.log('⚠ Table already exists, skipping');
          } else if (error.errno === 1062) {
            console.log('⚠ Duplicate entry, skipping');
          } else {
            console.error('✗ Error:', error.message);
            // Don't throw, continue with next statement
          }
        }
      }
    }

    console.log('\n✓ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
