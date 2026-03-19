module.exports = {
  columns: [
    {
      label: 'Name',
      key: 'name',
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
      align: 'center',
      displayAsTag: true,
    },
    {
      label: 'Date',
      key: 'date',
      align: 'center',
    },
  ],
  defaultSort: {
    key: 'date',
    direction: 'DESC',
  },
  fields: [
    {
      label: 'Name',
      key: 'name',
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
    {
      label: 'Type',
      key: 'type',
      type: 'select',
      size: 'half',
      options: [
        {
          label: 'Event',
          value: 'event',
        },
        {
          label: 'Fully Booked',
          value: 'full',
        },
        {
          label: 'Closed',
          value: 'closed',
        },
      ],
    },
    {
      label: 'Date',
      key: 'date',
      type: 'datepicker',
      size: 'half',
    },
  ],
  sidebarFields: [],
  initValue: {
    name: '',
    type: 'event',
    date: null,
    branch: null,
  },
  // Admin UI Related
  title: 'Fully Booked Dates',
  editTitle: 'Edit Fully Book Date',
  unit: 'รายการ',
}
