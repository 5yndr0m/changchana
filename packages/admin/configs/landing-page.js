module.exports = {
  singleton: true,
  fields: [
    {
      label: 'Hero',
      key: 'hero',
      group: true,
      fields: [
        {
          label: 'Title',
          key: 'title',
          type: 'text',
        },
        {
          label: 'Description',
          key: 'description',
          type: 'textarea',
        },
        {
          label: 'Features',
          key: 'features',
          repeatable: true,
          labelKey: 'label',
          limit: 3,
          fields: [
            {
              label: 'Icon',
              key: 'icon',
              type: 'text',
              size: 'half',
            },
            {
              label: 'Label',
              key: 'label',
              type: 'text',
              size: 'half',
            },

          ],
          initValue: {
            icon: '',
            label: '',
          },
        },
      ],
    },
    {
      label: 'FAQ',
      key: 'faq',
      repeatable: true,
      labelKey: 'title',
      limit: 3,
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
  editTitle: 'Test Page',
  initValue: {
    hero: null,
    faq: null,
  },
}
