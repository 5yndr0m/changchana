module.exports = {
  singleton: true,
  fields: [
    {
      label: 'Hero',
      key: 'hero',
      group: true,
      fields: [
        {
          label: 'Label',
          key: 'label',
          type: 'text',
        },
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
      ],
    },
  ],
  sidebarFields: [],
  editTitle: 'Contact Page',
  initValue: {
    hero: null,
    features: null,
    blessings: null,
    news: null,
  },
}
