module.exports = {
  columns: [
    {
      label: 'Name',
      key: 'name',
      align: 'left',
    },
    {
      label: 'Main Category',
      key: 'menu_category.name',
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
      size: 'half',
    },
    {
      label: 'Category',
      key: 'menu_category',
      type: 'relation',
      contentType: 'menu-categories',
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
  title: 'Menu Sub-Categories',
  editTitle: 'Edit Menu Sub-Category',
  unit: 'หมวดหมู่',
}
