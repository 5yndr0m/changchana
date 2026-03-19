const Strapi = require('strapi');

async function checkPermissions() {
  const strapi = await Strapi().load();

  console.log('=== CHECKING PERMISSIONS ===\n');

  // Get authenticated role
  const authenticatedRole = await strapi.query('role', 'users-permissions').findOne({ type: 'authenticated' });
  console.log('Authenticated Role ID:', authenticatedRole.id);
  console.log('');

  // Get all permissions for authenticated role
  const allPermissions = await strapi.query('permission', 'users-permissions').find({ role: authenticatedRole.id });

  // Filter for api controller permissions
  const apiPermissions = allPermissions.filter(p => p.controller === 'api');

  console.log('API Controller Permissions for Authenticated Role:');
  console.log('━'.repeat(80));
  apiPermissions.forEach(p => {
    console.log(`Action: ${p.action.padEnd(30)} | Enabled: ${p.enabled} | ID: ${p.id}`);
  });

  console.log('\n\nAll permission controllers:');
  const controllers = [...new Set(allPermissions.map(p => p.controller))];
  console.log(controllers);

  await strapi.destroy();
}

checkPermissions().catch(console.error);
