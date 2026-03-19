module.exports = {
  columns: [
    {
      label: 'Name',
      key: 'name',
      align: 'left',
    },
    {
      label: 'Phone',
      key: 'phone',
      align: 'center',
    },
    {
      label: 'Line',
      key: 'line',
      align: 'center',
    },
    {
      label: 'Status',
      key: 'visibility',
      align: 'center',
    },
  ],
  defaultSort: {
    key: 'published_at',
    direction: 'DESC',
  },
  fields: [
    {
      label: 'Cover Image',
      key: 'cover_image',
      type: 'fileUpload',
      size: 'half',
    },
    {
      label: 'Logo',
      key: 'logo',
      type: 'fileUpload',
      size: 'half',
    },
    {
      label: 'Name',
      key: 'name',
      type: 'text',
    },
    {
      label: 'Phone',
      key: 'phone',
      type: 'text',
      size: 'half',
    },
    {
      label: 'Line',
      key: 'line',
      type: 'text',
      size: 'half',
    },
    {
      label: 'Opening Time',
      key: 'opening_time',
      type: 'timepicker',
      size: 'half',
    },
    {
      label: 'Closing Time',
      key: 'closing_time',
      type: 'timepicker',
      size: 'half',
    },
    {
      label: 'Google Map',
      key: 'google_map',
      type: 'textarea',
    },
    {
      label: 'Apple Map',
      key: 'apple_map',
      type: 'textarea',
    },
    {
      label: 'Booking Remarks',
      key: 'booking_remarks',
      repeatable: true,
      labelKey: 'content',
      // limit: 3,
      fields: [
        {
          label: 'Content',
          key: 'content',
          type: 'text',
        },
      ],
      initValue: {
        content: '',
      },
    },
  ],
  sidebarFields: [
    {
      label: 'Visibility',
      key: 'visibility',
      type: 'select',
      options: [
        {
          label: 'Published',
          value: 'published',
        },
        {
          label: 'Draft',
          value: 'null',
        },
      ],
    },
  ],
  initValue: {
    name: '',
    phone: '',
    line: '',
    opening_time: null,
    closing_time: null,
    google_map: '',
    apple_map: '',
    published_at: 'null',
    booking_remarks: [],
  },
  // Admin UI Related
  title: 'Branches',
  editTitle: 'Edit Branch',
  unit: 'สาขา',
}
