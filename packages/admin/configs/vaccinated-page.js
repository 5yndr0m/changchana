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
        },
        {
          label: 'Cover Image',
          key: 'cover_image',
          type: 'fileUpload',
          size: 'half',
        }
      ],
    },
    {
      label: 'Contents',
      key: 'contents',
      repeatable: true,
      labelKey: 'title',
      fields: [
        {
          label: 'Title',
          key: 'title',
          type: 'text',
        },
        {
          label: 'Content',
          key: 'content',
          type: 'wysiwyg',
        },
      ],
      initValue: {
        title: '',
        content: '',
      },
    },
  ],
  sidebarFields: [],
  editTitle: 'Vaccinated Page',
  initValue: {
    hero: null,
    contents: null,
  },
}
