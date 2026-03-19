module.exports = {
  columns: [
    {
      label: 'Text',
      key: 'text',
      align: 'left',
    },
    {
      label: 'Status',
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
      label: 'Text',
      key: 'text',
      type: 'text',
    },
    {
      label: 'Long Text',
      key: 'long_text',
      type: 'textarea',
    },
    {
      label: 'WYSIWYG',
      key: 'rich_text',
      type: 'wysiwyg',
    },
    {
      label: 'Number',
      key: 'number',
      type: 'number',
    },
    {
      label: 'Date',
      key: 'date',
      type: 'datepicker',
    },
    {
      label: 'Datetime',
      key: 'datetime',
      type: 'datetimePicker',
    },
    {
      label: 'Boolean',
      key: 'bool',
      type: 'switch',
    },
    {
      label: 'Selection',
      key: 'selection',
      type: 'select',
      options: [
        {
          label: 'Option One',
          value: 'option_one',
        },
        {
          label: 'Option Two',
          value: 'option_two',
        },
      ],
    },
    {
      label: 'Media',
      key: 'media',
      type: 'fileUpload',
      size: 'half',
    },
    {
      label: 'Contents',
      key: 'contents',
      dynamic: true,
      fieldsType: {
        ['test.nested']: {
          label: 'Nested Content',
          componentKey: 'test.nested',
          fields: [
            {
              label: 'Text',
              key: 'text',
              type: 'text',
            },
            {
              label: 'Repeatable',
              key: 'repeatable',
              repeatable: true,
              labelKey: 'text',
              limit: 3,
              fields: [
                {
                  label: 'Text',
                  key: 'text',
                  type: 'text',
                },
              ],
              initValue: {
                text: '',
              },
            },
          ],
        },
        ['test.test-component']: {
          label: 'Test Component Content',
          componentKey: 'test.test-component',
          fields: [
            {
              label: 'Text',
              key: 'text',
              type: 'text',
            },
          ],
        },
        ['test.nested-group']: {
          label: 'Nested Group Content',
          componentKey: 'test.nested-group',
          fields: [
            {
              label: 'Text',
              key: 'text',
              type: 'text',
            },
            {
              label: 'Test',
              key: 'test',
              group: true,
              fields: [
                {
                  label: 'Text',
                  key: 'text',
                  type: 'text',
                  size: 'half',
                },
              ],
            },
          ],
        },
      },
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
  ],
  initValue: {
    text: '',
    long_text: '',
    rich_text: '',
    number: 0,
    date: null,
    datetime: null,
    bool: false,
    selection: null,
    media: null,
    published_at: 'null',
    contents: [],
  },
  // Admin UI Related
  title: 'Test Content Type',
  editTitle: 'Test Content Type',
  unit: 'รายการ',
}
