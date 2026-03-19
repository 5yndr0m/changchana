module.exports = {
  columns: [
    {
      label: 'User',
      key: 'user.first_name',
      align: 'left',
    },
    {
      label: 'Confirm',
      key: 'confirm',
      align: 'center',
      capitalize: true,
      displayAsTag: true,
    },
  ],
  defaultSort: {
    key: 'published_at',
    direction: 'DESC',
  },
  fields: [
    {
      label: 'User',
      key: 'user',
      type: 'relation',
      contentType: 'users?role=1',
      labelKey: 'first_name',
      valueKey: 'id',
      size: 'half',
    },
    {
      label: 'Confirm',
      key: 'confirm',
      type: 'switch',
      size: 'half',
    },
    {
      label: 'Files',
      key: 'files',
      type: 'multipleFileUpload',
    },
  ],
  sidebarFields: [
  ],
  initValue: {
    user: null,
    confirm: false,
    files: null,
  },
  // readonly: true,
  create: false,
  // Admin UI Related
  title: 'Vaccinated Submissions',
  editTitle: 'Vaccinated Submission',
  unit: 'รายการ',
}
