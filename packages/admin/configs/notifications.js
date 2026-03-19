module.exports = {
  contentType: {
    path: 'notifications',
    query: '',
  },
  columns: [
    {
      label: 'Title',
      key: 'title',
      align: 'left',
    },
    {
      label: 'Type',
      key: 'type',
      align: 'center',
    },
    {
      label: 'Status',
      key: 'status',
      align: 'center',
      displayAsTag: true,
    },
    {
      label: 'Published At',
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
      label: 'Cover Image',
      key: 'cover_image',
      type: 'fileUpload',
      size: 'half',
    },
    {
      label: 'Title',
      key: 'title',
      type: 'text',
      size: 'half',
    },
    {
      label: 'Type',
      key: 'type',
      type: 'select',
      size: 'half',
      options: [
        {
          label: 'Message',
          value: 'message',
        },
        {
          label: 'Promotion',
          value: 'promotion',
        },
        {
          label: 'Invitation',
          value: 'invitation',
        },
      ],
    },
    {
      label: 'Send Method',
      key: 'sending_method',
      type: 'select',
      size: 'half',
      options: [
        {
          label: 'Push Inbox',
          value: 'inbox',
        },
        {
          label: 'Push Notification',
          value: 'push',
        },
        {
          label: 'Push Notification + Inbox',
          value: 'inbox_push',
        },
      ],
    },
    {
      label: 'Short Description',
      key: 'short_description',
      type: 'textarea',
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
    {
      label: 'Status',
      key: 'status',
      type: 'select',
      options: [
        {
          label: 'Prepare',
          value: 'prepare',
        },
        {
          label: 'Sending',
          value: 'sending',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
        {
          label: 'Failed',
          value: 'failed',
        },
      ],
      disabled: true,
    },
  ],
  initValue: {
    cover_image: null,
    title: '',
    short_description: '',
    sending_method: null,
    type: null,
    status: 'prepare',
    published_at: 'null',
  },
  // Admin UI Related
  disableDelete: true,
  title: 'Notification',
  editTitle: 'Edit Notification',
  unit: 'ข้อความ',
}
