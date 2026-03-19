module.exports = {
  columns: [
    {
      label: 'Title',
      key: 'title',
      align: 'left',
    },
    {
      label: 'Special Content',
      key: 'special',
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
      label: 'Title',
      key: 'title',
      type: 'text',
      size: 'half',
    },
    {
      label: 'Slug',
      key: 'slug',
      type: 'text',
      size: 'half',
    },
    {
      label: 'Cover Image',
      key: 'cover_image',
      type: 'fileUpload',
      size: 'half',
    },
    {
      label: 'Excerpt',
      key: 'excerpt',
      type: 'textarea',
      size: 'half',
    },
    {
      label: 'Content',
      key: 'content',
      type: 'wysiwyg',
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
    }
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
      label: 'Special Content',
      key: 'special',
      type: 'switch',
    },
  ],
  initValue: {
    cover_image: null,
    title: '',
    content: '',
    published_at: 'null',
  },
  // Admin UI Related
  title: 'News & Promotions',
  editTitle: 'Edit News & Promotions',
  unit: 'บทความ',
}
