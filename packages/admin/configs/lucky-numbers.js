module.exports = {
  contentType: {
    path: 'lucky-numbers',
    query: '',
  },
  columns: [
    {
      label: 'Code',
      key: 'code',
      align: 'left',
    },
    {
      label: 'Points',
      key: 'points',
      align: 'center',
      displayAsTag: true,
    },
    {
      label: 'Begin Date',
      key: 'begin_date',
      align: 'center',
    },
    {
      label: 'End Date',
      key: 'end_date',
      align: 'center',
    },
    {
      label: 'Active',
      key: 'active',
      align: 'center',
    },
  ],
  defaultSort: {
    key: 'begin_date',
    direction: 'DESC',
  },
  fields: [
    {
      label: 'Code',
      key: 'code',
      type: 'text',
      size: 'half',
      disabled: true,
    },
    {
      label: 'Points',
      key: 'points',
      type: 'number',
      size: 'half',
    },
    {
      label: 'Begin Date',
      key: 'begin_date',
      type: 'datepicker',
      size: 'half',
    },
    {
      label: 'End Date',
      key: 'end_date',
      type: 'datepicker',
      size: 'half',
    }
  ],
  sidebarFields: [
    {
      label: 'Active',
      key: 'active',
      type: 'switch',
    },
    {
      label: 'QR Code',
      key: 'code',
      type: 'qrCode',
      size: 'half',
    },
  ],
  initValue: {
    code: null,
    points: null,
    begin_date: null,
    end_date: null,
    active: true,
  },
  // Admin UI Related
  title: 'Lucky Number',
  editTitle: 'Edit Lucky Number',
  unit: 'รายการ',
}
