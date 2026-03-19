module.exports = {
  contentType: {
    path: 'atk-logs',
    query: '',
  },
  columns: [
    {
      label: "ชื่อ",
      key: "users_permissions_user.first_name",
      align: "left",
    },
    {
      label: "นามสกุล",
      key: "users_permissions_user.last_name",
      align: "left",
    },
    {
      label: "เบอร์โทร",
      key: "users_permissions_user.phone",
      align: "left",
    },
    {
      label: "สาขา",
      key: "branch.name",
      align: "left",
    },
  ],
  defaultSort: {
    key: "created_at",
    direction: "DESC",
  },
  title: "ATK Logs",
  unit: "รายการ",
  disableDelete: true,
  disableEdit: true,
  create: false,
}