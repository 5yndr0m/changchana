module.exports = {
  singleton: true,
  fields: [
    {
      label: 'Hero',
      key: 'hero',
      group: true,
      fields: [{
        label: 'Cover Image',
        key: 'cover_image',
        type: 'fileUpload',
      },
      {
        label: 'Title',
        key: 'title',
        type: 'text',
      },
      {
        label: 'Label',
        key: 'label',
        type: 'text',
      },
      {
        label: 'Description',
        key: 'description',
        type: 'wysiwyg',
      }],
    },
  ],
  sidebarFields: [{
    label: 'URL',
    key: 'url',
    type: 'text',
  },
  {
    label: 'Events Highlight',
    key: 'highlight_events',
    type: 'multipleRelation',
    contentType: 'events',
    labelKey: 'title',
    valueKey: 'id',
    limit: 1,
  }],
  editTitle: 'Event Page',
  initValue: {
    hero: null,
    contents: null,
  },
  customLink: [{
    label: "Events list",
    path: `events`,
  }],
}
