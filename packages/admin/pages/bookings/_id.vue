<template>
  <div>
    <ContentEditPage
      :fields="fields"
      :sidebarFields="sidebarFields"
      contentType="bookings"
			:initValue="initValue"
			title="Edit Booking"
    />
  </div>
</template>

<script>
export default {
  layout: 'admin',
  middleware: 'auth',
  data: () => ({
    loading: false,
    fields: [
      {
        label: 'Date',
        key: 'date',
        type: 'datepicker',
      },
      {
        label: 'Published At',
        key: 'status',
        type: 'select',
        options: [
          {
            label: 'Approved',
            value: 'approved',
          },
          {
            label: 'Pending',
            value: 'pending',
          },
          {
            label: 'Rejected',
            value: 'reject',
          },
          {
            label: 'Cancelled',
            value: 'cancelled',
          },
          {
            label: 'Waiting',
            value: 'waiting',
          },
        ],
      },
      {
        label: 'Name',
        key: 'name',
        type: 'text',
      },
      {
        label: 'Phone',
        key: 'phone',
        type: 'text',
      },
      {
        label: 'People Amount',
        key: 'people_amount',
        type: 'number',
      },
    ],
    sidebarFields: [
      {
        label: 'User',
        key: 'user',
        type: 'relation',
        contentType: 'users?role=1',
        labelKey: 'first_name',
        valueKey: 'id',
      },
      {
        label: 'Branch',
        key: 'branch',
        type: 'relation',
        contentType: 'branches',
        labelKey: 'name',
        valueKey: 'id',
      },
    ],
    initValue: {
      date: '',
      status: '',
      name: '',
      phone: '',
      people_amount: '',
      user: null,
      visibility: 'published',
    },
  }),
}
</script>
