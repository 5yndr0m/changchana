<template>
  <div class="ticket-list _fdrt-cl _alit-ct _jtfct-ct _pdbt-16px" >
    <TicketItem v-for="(val, index) in tickets" :key="`ticket-item-${val.id}`"
      :id="val.id"
      :title="val.title"
      :type="val.type"
      :day="val.day"
      :month="val.month"
      :tables="val.tables"
      :branch_name="val.branch_name"
      :status="val.status"
      @click.native="() => onClickTicket ? onClickTicket(index) : null"
      />
  </div>
</template>

<script>

import TicketItem from './TicketItem.vue'

export default {
  props: {
    tickets: {
      type: Array,
      required: true,
    },
    onClickTicket: {
      type: Function,
    }
  },
  components: {
    TicketItem,
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/variables';
.ticket-list {
  height: 549px;
  overflow-y: auto;

  @media screen and (max-width: $sm) {
    height: auto;
    overflow-y: auto;
  }

}
</style>