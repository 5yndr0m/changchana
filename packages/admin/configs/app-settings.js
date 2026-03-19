module.exports = {
  singleton: true,
  fields: [
    {
      label: 'Announcement',
      key: 'announcement',
      group: true,
      fields: [
        {
          label: 'Enable',
          key: 'enable',
          type: 'switch',
          size: 'half',
        },
        {
          size: 'half',
        },
        {
          label: 'Image',
          key: 'cover_image',
          type: 'fileUpload',
          size: 'half',
        },
        {
          label: 'Description',
          key: 'description',
          type: 'textarea',
          size: 'half',
        },
      ]
    },
    {
      label: 'Booking Conditions',
      key: 'booking_conditions',
      type: 'textarea',
    }
  ],
  sidebarFields: [
    {
      label: 'Server status (for application)',
      key: 'server_status',
      type: 'select',
      size: 'half',
      options: [
        {
          label: 'Live',
          value: 'live',
        },
        {
          label: 'Maintenance',
          value: 'maintenance',
        },
      ],
    },
    {
      label: 'Phone',
      key: 'phone',
      type: 'text',
    },
    {
      label: 'Line',
      key: 'line',
      type: 'text',
    },
  ],
  editTitle: 'Application Settings',
  initValue: {
    content: [],
  },
}
