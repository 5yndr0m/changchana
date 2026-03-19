module.exports = {
  columns: [
    {
      label: "Booking No.",
      key: "ticket_no",
      align: "left",
    },
    {
      label: "สร้างเมื่อ",
      key: "created_at",
      align: "left",
    },
    {
      label: "ชื่อ สกุล",
      key: "name",
      align: "center",
      disabledSort: true,
    },
    {
      label: "อีเมล",
      key: "email",
      align: "left",
      disabledSort: true,
    },
    {
      label: "โทรศัพท์",
      key: "phone",
      align: "left",
      disabledSort: true,
    },
    {
      label: "Qty.",
      key: "quantity",
      align: "center",
      disabledSort: true,
    },
    {
      label: "Total",
      key: "total",
      align: "right",
      disabledSort: true,
    },
    {
      label: "Zone",
      key: "zone_name",
      align: "left",
      disabledSort: true,
    },
    {
      label: "สถานะ",
      key: "status",
      align: "left",
      disabledSort: true,
      displayAsTag: true,
    },
  ],
  title: "Tickets",
}