const Strapi = require('strapi');

async function setPermissions() {
  const appContext = await Strapi().load();
  const strapi = appContext;

  try {
    // Get all roles (public and authenticated)
    const allRoles = await strapi.query('role', 'users-permissions').find();

    if (!allRoles || allRoles.length === 0) {
      console.log('No roles found');
      process.exit(1);
    }

    const actions = [
      'listwallets',
      'getwalletdetail',
      'adjustbalance',
      'freezewallet',
      'getalltransactions',
      'refundtransaction',
      'getreports',
      'createvoucher'
    ];

    // Set permissions for all roles (public and authenticated)
    for (const role of allRoles) {
      console.log(`Setting permissions for ${role.type} role (id: ${role.id})`);

      for (const action of actions) {
        // Check if permission exists
        const existing = await strapi.query('permission', 'users-permissions').findOne({
          role: role.id,
          type: 'application',
          controller: 'api',
          action: action
        });

        if (existing) {
          await strapi.query('permission', 'users-permissions').update(
            { id: existing.id },
            { enabled: true }
          );
        } else {
          await strapi.query('permission', 'users-permissions').create({
            role: role.id,
            type: 'application',
            controller: 'api',
            action: action,
            enabled: true,
            policy: ''
          });
        }
      }
    }

    console.log('Permissions set successfully for all roles');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

setPermissions();
