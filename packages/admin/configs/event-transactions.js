module.exports = {
  contentType: {
    path: "event-transactions",
    query: "",
  },
  columns: [
    {
      label: "ชื่อ นามสกุล",
      key: ["user.first_name", "user.last_name"],
      align: "center",
      disabledSort: true,
      combindKey: {
        combindWith: " ",
      },
    },
    {
      label: "เบอร์โทร",
      key: "user.phone",
      align: "left",
      disabledSort: true,
      combindKey: {
        combindWith: " ",
      },
    },
    {
      label: "Payment transaction",
      key: "payment_transaction_id",
      align: "left",
    },
    {
      label: "ช่องทางการชำระเงิน",
      key: "payment_method",
      align: "left",
    },
    {
      label: "ยอดเงิน",
      key: "price",
      align: "left",
    },
    {
      label: "Points",
      key: "points",
      align: "left",
    },
    {
      label: "สถานะ",
      key: "status",
      align: "left",
      displayAsTag: true,
    },
  ],
  defaultSort: {
    key: "created_at",
    direction: "DESC",
  },
  initValue: {
    cover_image: null,
    title: "",
    description: "",
    date: "",
    published_at: "null",
  },
  title: "Bookings/Transactions",
  unit: "รายการ",
  disableDelete: false,
  disableEdit: false,
  create: true,
  linkBack: "/events",
}