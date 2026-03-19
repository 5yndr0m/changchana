module.exports = {
  singleton: true,
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
      size: 'half',
    },
    {
      label: 'Date',
      key: 'date',
      type: 'datepicker',
      size: 'half',
    },
    {
      label: 'Datetime',
      key: 'datetime',
      type: 'datetimePicker',
      size: 'half',
    },
    {
      label: 'Boolean',
      key: 'bool',
      type: 'switch',
      size: 'half',
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
      label: 'Entry',
      key: 'entry',
      type: 'relation',
      contentType: 'tests',
      labelKey: 'text',
      valueKey: 'id',
    },
    {
      label: 'Entries',
      key: 'entries',
      type: 'multipleRelation',
      contentType: 'tests',
      labelKey: 'text',
      valueKey: 'id',
    },
    {
      label: 'Nested Field',
      key: 'nested',
      group: true,
      fields: [
        {
          label: 'Text',
          key: 'text',
          type: 'text',
          size: 'half',
        },
        {
          label: 'Repeatable Field',
          key: 'repeatable',
          repeatable: true,
          labelKey: 'text',
          // limit: 3,
          fields: [
            {
              label: 'Text',
              key: 'text',
              type: 'text',
              size: 'half',
            },
          ],
          initValue: {
            text: '',
          },
        },
      ],
    },
    {
      label: 'Repeatable Field',
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
  sidebarFields: [],
  editTitle: 'Test Page',
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
    entry: null,
    entries: null,
    nested: null,
    repeatable: null,
  },
}
