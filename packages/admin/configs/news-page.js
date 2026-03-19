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
          size: 'half',
        },
        {
          label: 'Title',
          key: 'title',
          type: 'text',
          size: 'half',
        },
        {
          label: 'Description',
          key: 'description',
          type: 'textarea',
          size: 'half',
        },
      ],
    },
  ],
  sidebarFields: [],
  editTitle: 'News Page',
  initValue: {
    hero: null,
    contents: null,
  },
}
