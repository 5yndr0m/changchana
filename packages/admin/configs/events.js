module.exports = {
  contentType: {
    path: "events",
    query: "",
  },
  columns: [
    {
      label: "ชื่อ",
      key: "title",
      align: "left",
    },
    {
      label: "สาขา",
      key: "branch.name",
      align: "left",
    },
    {
      label: "ประเภท",
      key: "type",
      align: "left",
    },
    {
      label: "Selling type",
      key: "selling_type",
      align: "left",
    },
  ],
  defaultSort: {
    key: "created_at",
    direction: "DESC",
  },
  fields: [
    {
      label: "Title",
      key: "title",
      type: "text",
      size: 'half',
    },
    {
      label: "Slug",
      key: "slug",
      type: "text",
      size: 'half',
    },
    {
      label: "Branch",
      key: "branch",
      type: "relation",
      contentType: "branches",
      labelKey: "name",
      valueKey: "id",
      size: "half",
    },
    {
      label: "Limit per User",
      key: "limit_per_user",
      type: "number",
      size: "half",
    },
    {
      label: 'Rounds (วันที่จัดอีเว้นท์)',
      key: 'rounds',
      repeatable: true,
      labelKey: 'date',
      prefixLabelKey: 'วันที่ :',
      readonly: false,
      fields: [
        {
          label: 'Date',
          key: 'date',
          type: 'datepicker',
        },
      ],
      initValue: {
        date: '',
        newItem: true,
      }
    },
    {
      label: 'Zone (โซนที่นั่ง)',
      key: 'zones',
      repeatable: true,
      labelKey: 'name',
      prefixLabelKey: 'โซน :',
      readonly: false,
      fields: [
        {
          label: 'Name',
          key: 'name',
          type: 'text',
          size: 'half',
        },
        {
          label: 'จำนวนโต๊ะ',
          key: 'number_of_table',
          type: 'number',
          size: 'half',
        },
        {
          label: 'Price',
          key: 'price',
          type: 'number',
          size: 'half',
        },
        {
          label: 'Point',
          key: 'points',
          type: 'number',
          size: 'half',
        },
        {
          label: 'Text color',
          key: 'text_color',
          type: 'colorPicker',
          size: 'half',
        },
        {
          label: 'Background color',
          key: 'bg_color',
          type: 'colorPicker',
          size: 'half',
        },
        {
          label: 'Zone Description',
          key: 'description',
          type: 'textarea',
        },
      ],
      initValue: {
        title: '',
        content: '',
        newItem: true,
      },
    },
    {
      label: "Description",
      key: "description",
      type: 'wysiwyg',
    },
  ],
  sidebarFields: [
    {
      label: "Cover Image",
      key: "cover_image",
      type: "fileUpload",
    },
    {
      label: "Stage Image",
      key: "stage_image",
      type: "fileUpload",
    },
    {
      label: "Visibility",
      key: "visibility",
      type: "select",
      options: [
        {
          label: "Published",
          value: "published",
        },
        {
          label: "Draft",
          value: "null",
        },
      ],
    },
    {
      label: "Type",
      key: "type",
      type: "select",
      options: [
        {
          label: "Concert",
          value: "concert",
        },
        {
          label: "Party",
          value: "party",
        },
        {
          label: "Festival",
          value: "festival",
        },
      ],
    },
    {
      label: "Selling Type",
      key: "selling_type",
      type: "select",
      options: [
        {
          label: "Ticket",
          value: "ticket",
        },
        {
          label: "Walk in",
          value: "walk_in",
        },
      ],
    },
    {
      label: "Status",
      key: "status",
      type: "select",
      options: [
        {
          label: "Comming soon",
          value: "comming_soon",
        },
        {
          label: "Publish",
          value: "publish",
        },
        {
          label: "Walk in",
          value: "walk_in",
        },
        {
          label: "Sold out",
          value: "sold_out",
        },
      ],
    },
  ],
  initValue: {
    cover_image: null,
    title: "",
    description: "",
    date: "",
    published_at: "null",
  },
  title: "Events/Concert",
  unit: "รายการ",
  linkBack: "/events",
}