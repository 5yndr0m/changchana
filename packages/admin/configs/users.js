module.exports = {
  contentType: {
    path: 'users',
    query: 'role=1'
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
      label: 'Gender',
      key: 'gender',
      type: 'select',
      size: 'half',
      options: [
        {
          label: 'Male',
          value: 'male',
        },
        {
          label: 'Female',
          value: 'female',
        },
        {
          label: 'Other',
          value: 'other',
        },
      ],
    },
    {
      label: 'Phone',
      key: 'phone',
      type: 'text',
      size: 'half',
    },
    {
      label: 'Citizen ID',
      key: 'citizen_id',
      type: 'text',
      size: 'half',
    },
    {
      label: 'Birthdate',
      key: 'birthdate',
      type: 'datepicker',
      size: 'half',
    },
    {
      label: 'Points',
      key: 'points',
      type: 'number',
      size: 'half',
      disabled: true,
    },
    {
      label: 'Profile Image',
      key: 'profile_image',
      type: 'fileUpload',
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
  title: 'Users',
  editTitle: 'User',
  unit: 'ผู้ใช้',
}
