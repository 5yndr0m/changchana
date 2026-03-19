module.exports = {
  singleton: true,
  fields: [
    {
      label: 'Footer',
      key: 'footer',
      group: true,
      fields: [
        {
          label: 'Address',
          key: 'address',
          type: 'textarea',
          size: 'half',
        },
        {
          size: 'half',
        },
        {
          label: 'Socials',
          key: 'socials',
          repeatable: true,
          labelKey: 'url',
          fields: [
            {
              label: 'Icon',
              key: 'icon',
              type: 'text',
            },
            {
              label: 'URL',
              key: 'url',
              type: 'text',
            },
          ],
          initValue: {
            icon: '',
            url: '',
          },
        },
      ]
    },
    {
      label: 'Call to Action',
      key: 'call_to_action',
      group: true,
      fields: [
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
      ]
    },
    {
      label: 'SEO',
      key: 'seo',
      group: true,
      fields: [
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
        {
          label: 'Image',
          key: 'image',
          type: 'fileUpload',
          size: 'half',
        },
      ]
    },
  ],
  sidebarFields: [],
  editTitle: 'Website Settings',
  initValue: {
    content: [],
  },
}
