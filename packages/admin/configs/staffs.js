module.exports = {
  contentType: {
    path: 'users',
    query: 'role=3'
  },
  columns: [
    {
      label: 'First Name',
      key: 'first_name',
      align: 'left',
    },
    {
      label: 'Nickname',
      key: 'nickname',
      align: 'left',
    },
    {
      label: 'Phone',
      key: 'phone',
      align: 'left',
    },
    {
      label: 'Email',
      key: 'email',
      align: 'center',
    },

  ],
  defaultSort: {
    key: 'first_name',
    direction: 'DESC',
  },
  fields: [
    {
      label: 'Email',
      key: 'email',
      type: 'text',
      size: 'half',
    },
    {
      label: 'Password',
      key: 'password',
      type: 'password',
      size: 'half',
    },
    {
      label: 'First Name',
      key: 'first_name',
      type: 'text',
      size: 'half',
    },
    {
      label: 'Last Name',
      key: 'last_name',
      type: 'text',
      size: 'half',
    },
    {
      label: 'Nickname',
      key: 'nickname',
      type: 'text',
      size: 'half',
    },
    {
      label: 'Branch',
      key: 'branch',
      type: 'relation',
      contentType: 'branches',
      labelKey: 'name',
      valueKey: 'id',
      size: 'half',
    },
  ],
  sidebarFields: [
    {
      label: 'Confirmed',
      key: 'confirmed',
      type: 'switch',
    },
    {
      label: 'Blocked',
      key: 'blocked',
      type: 'switch',
    },
    {
      label: 'Special',
      key: 'special',
      type: 'switch',
    },
    {
      label: 'Vaccinated',
      key: 'vaccinated',
      type: 'switch',
    },
  ],
  initValue: {
    username: '',
    email: '',
    password: '',
    confirmed: true,
    blocked: false,
    first_name: '',
    last_name: '',
    nickname: '',
    gender: null,
    phone: '',
    citizen_id: '',
    birthdate: null,
    profile_image: null,
    role: 1,
    special: false,
    points: 0,
  },
  // Admin UI Related
  title: 'Staffs',
  editTitle: 'Staff',
  unit: 'พนักงาน',
}
