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
    {
      label: 'Features',
      key: 'features',
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
        {
          label: 'App Features',
          key: 'app_features',
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
              label: 'Title',
              key: 'title',
              type: 'text',
              size: 'half',
            },
          ],
          initValue: {
            icon: '',
            title: '',
          },
        },
      ],
    },
    {
      label: 'Blessings',
      key: 'blessings',
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
      ],
    },
    {
      label: 'News',
      key: 'news',
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
      ],
    },
  ],
  sidebarFields: [],
  editTitle: 'Home Page',
  initValue: {
    hero: null,
    features: null,
    blessings: null,
    news: null,
  },
}
