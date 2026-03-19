const mappingResponse = (row) => {
  const {users_permissions_user, branch } = row;
  return {
    id: row.id,
    users_permissions_user: {
      id: users_permissions_user.id,
      username: users_permissions_user.username,
      email: users_permissions_user.email,
      phone: users_permissions_user.phone,
      citizen_id: users_permissions_user.citizen_id,
      first_name: users_permissions_user.first_name,
      last_name: users_permissions_user.last_name,
    },
    status: row.status,
    expired_at: row.expired_at,
    created_at: row.created_at,
    branch: {
      id: branch.id,
      name: branch.name,
    }
  };
};

module.exports = {
  mappingResponse,
};
