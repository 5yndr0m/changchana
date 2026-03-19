module.exports = {
  singleton: true,
  fields: [
    {
      label: 'Content',
      key: 'content',
      repeatable: true,
      labelKey: 'title',
      fields: [
        {
          label: 'Title',
          key: 'title',
          type: 'text',
        },
        {
          label: 'Description',
          key: 'description',
          type: 'wysiwyg',
        },
      ],
      initValue: {
        title: '',
        description: '',
      },
    },
  ],
  sidebarFields: [],
  editTitle: 'Terms and Conditions',
  initValue: {
    content: [],
  },
}
