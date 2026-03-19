module.exports = {
  columns: [
    {
      label: 'Name',
      key: 'name',
      align: 'left',
    },
    {
      label: 'Status',
      key: 'visibility',
      align: 'center',
    },
  ],
  defaultSort: {
    key: 'published_at',
    direction: 'DESC',
  },
  fields: [
    {
      label: 'Name',
      key: 'name',
      type: 'text',
    },
    {
      label: 'Branch',
      key: 'branches',
      type: 'multipleRelation',
      contentType: 'branches',
      labelKey: 'name',
      valueKey: 'id',
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
    name: '',
    published_at: 'null',
  },
  // Admin UI Related
  title: 'Menu Categories',
  editTitle: 'Edit Menu Category',
  unit: 'เมนู',
}
