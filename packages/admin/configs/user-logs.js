module.exports = {
  columns: [
    {
      label: 'User',
      key: 'user.first_name',
      align: 'left',
    },
    {
      label: 'Branch',
      key: 'branch.name',
      align: 'left',
    },
    {
      label: 'Type',
      key: 'type',
      align: 'left',
      renderValue: [
        {
          condition: "replaceStr",
          from: "checked_out",
          to: "Checked Out"
        },
        {
          condition: "replaceStr",
          from: "checked_in",
          to: "Checked In"
        },
      ],
    },
    {
      label: 'Entered On',
      key: 'published_at',
      align: 'center',
    },
  ],
  defaultSort: {
    key: 'published_at',
    direction: 'DESC',
  },
  fields: [
    {
      label: 'Date / Time',
      key: 'datetime',
      type: 'datetimePicker',
      size: 'half',
    },
    {
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
    {
      label: 'User',
      key: 'user',
      type: 'relation',
      contentType: 'users',
      labelKey: 'first_name',
      valueKey: 'id',
      size: 'half',
    },
  ],
  sidebarFields: [
    {
      label: 'Type',
      key: 'type',
      type: 'select',
      options: [
        {
          label: 'Checked In',
          value: 'checked_in',
        },
        {
          label: 'Checked Out',
          value: 'checked_out',
        },
      ],
    },
  ],
  initValue: {},
  readonly: true,
  create: false,
  disableDelete: true,
  // Admin UI Related
  title: 'User Logs',
  editTitle: 'User Log',
  unit: 'รายการ',
}
