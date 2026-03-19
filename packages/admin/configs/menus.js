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
      label: 'Sub Category',
      key: 'menu_sub_category.name',
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
      label: 'Image',
      key: 'cover_image',
      type: 'fileUpload',
      size: 'half',
    },
    {
      size: 'half',
    },
    {
      label: 'Name',
      key: 'name',
      type: 'text',
    },
    {
      label: 'Description',
      key: 'description',
      type: 'textarea',
    },
    {
      label: 'Branches',
      key: 'branches',
      type: 'multipleRelation',
      relation: true,
      contentType: 'branches',
      labelKey: 'name',
      valueKey: 'id',
    },
    {
      label: 'Category',
      key: 'menu_category',
      type: 'relation',
      contentType: 'menu-categories',
      labelKey: 'name',
      valueKey: 'id',
      size: 'half',
    },
    {
      label: 'Sub Category',
      key: 'menu_sub_category',
      type: 'relation',
      contentType: 'menu-sub-categories',
      labelKey: 'name',
      valueKey: 'id',
      size: 'half',
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
    description: '',
    main_category: null,
    menu_sub_category: null,
    published_at: 'null',
  },
  // Admin UI Related
  title: 'Menu',
  editTitle: 'Edit Menu',
  unit: 'เมนู',
}
