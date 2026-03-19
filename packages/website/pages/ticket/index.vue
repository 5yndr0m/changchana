<template>
  <div class="container ticket">
    <div class="row _jtfct-ct">

      <div class="order-last col-sm-6 col-11 panel-right _alit-ct _jtfct-ct _pd-32px"
        :class="{ 'active-panel': currentTicketMenu !== 0 }">

        <div v-if="currentTicketMenu == 0">
          <h4 class="section-hero-label _tal-ct _mgbt-24px" v-html="this.eventHero.label"></h4>
          <h1 class="_fs-2-md _fs-3 _mgbt-16px _tal-ct" v-html="this.eventHero.title"></h1>
          <p class="_tal-ct" v-html="this.eventHero.description"></p>
          <div class="_dp-f _jtfct-ct _mgt-24px">
            <a :href="this.eventHero.url" type="button" class="btn btn-primary _mgr-12px">อ่านต่อ</a>
          </div>
          <img :src="this.eventHero.cover_image" class="image_hero _mgt-32px" alt="event_hero" />
        </div>

        <div v-if="currentTicketMenu == MENU_MYTICKET">
          <h3 class="green-underscore _pst-rlt _cl-black _mgt-16px _mgbt-48px _tal-ct">Current Ticket</h3>
          <TicketList :tickets="tickets" :onClickTicket="onClickTicket"/>
        </div>

        <div v-if="currentTicketMenu == MENU_TICKETHISTORY">
          <h3 class="green-underscore _pst-rlt _cl-black _mgt-16px _mgbt-48px _tal-ct">Ticket History</h3>
          <TicketList :tickets="ticketsHistory" />
        </div>

      </div>

      <div class="order-first col-sm-4 col-11 panel-left _fdrt-cl _alit-ct _jtfct-ct">
        <h2 class="green-underscore _pst-rlt _cl-black _mgt-48px _mgbt-48px _tal-ct">Ticket</h2>

        <TicketMenu :active="currentTicketMenu == MENU_MYTICKET"
          @click.native="() => selectTicketMenu(MENU_MYTICKET)"
          fa_icon="list" name_en="Current Ticket" name_th="รายการจอง"></TicketMenu>
        <TicketMenu :active="currentTicketMenu == MENU_TICKETHISTORY"
          @click.native="() => selectTicketMenu(MENU_TICKETHISTORY)" fa_icon="clock" name_en="Ticket History"
          name_th="ประวัติการจอง"></TicketMenu>

      </div>

    </div>

    <TicketModal
      :isShow="isShowModal"
      @close="closeModal"
      :ticket="selectTicket"
      :onOpenCancel="onOpenCancel"
    />

    <TicketCancelModal
      :isShow="isShowCancelModal"
      :isCancelSuccess="isCancelSuccess"
      @close="closeCancelModal"
      :ticket="selectTicket"
      :onConfirmCancel="onConfirmCancel"
    />

  </div>
</template>

<script>
import moment from "moment";
import TicketMenu from './TicketMenu.vue'
import TicketList from './TicketList.vue'
import TicketModal from './TicketModal.vue'
import TicketCancelModal from './TicketCancelModal.vue'

const MENU_MYTICKET = 1
const MENU_TICKETHISTORY = 2

const dtoTickets = tickets => tickets.map( tk => ({
  ...tk,
  day: moment(tk.date).format('D'),
  month: moment(tk.date).format('MMM')
}))

export default {
  head() {
    return {
      title: 'ticket'
    }
  },
  data() {
    return {
      MENU_MYTICKET,
      MENU_TICKETHISTORY,
      currentTicketMenu: 0,
      isShowModal: false,
      isShowCancelModal: false,
      selectTicket: undefined,
      isCancelSuccess: false,
    }
  },
  async asyncData({ $axios, $auth }) {
    let pageData = await $axios.$get(`/event-page?populate=-1`)
    let eventHero = {
      label: pageData.hero.label,
      title: pageData.hero.title,
      cover_image: pageData.hero.cover_image?.url || '',
      description: pageData.hero.description,
      url: pageData.url,
    }
    return {
      eventHero,
      tickets: [],
      ticketsHistory: [],
    }
  },
  layout: 'main',
  middleware: "auth",
  components: {
    TicketMenu,
    TicketList,
    TicketModal,
    TicketCancelModal,
  },
  mounted() {
    this.loadTicket()
  },
  methods: {
    async loadTicket() {
      try {
        let token = this.$auth.strategy.token.get();
        let myTickets = await this.$axios.$get('/api/users/tickets',
          {
            headers: { Authorization: token },
          }
        )
        myTickets = dtoTickets(myTickets)
          .sort((a,b)=>(new Date(a.date) - new Date(b.date)))

        const today = moment()
        this.ticketsHistory = myTickets.filter((val) => {
          return moment(val.date, 'YYYY-MM-DD').isBefore(today, 'date')
        })

        this.tickets = myTickets.filter((val) => {
          return moment(val.date, 'YYYY-MM-DD').isSameOrAfter(today, 'date')
        })
      } catch (err) {
        console.log(err)
      }
    },
    selectTicketMenu(menu) {
      this.currentTicketMenu = menu
    },
    onClickTicket(index) {
      this.selectTicket = this.tickets[index]
      this.isShowModal = true
    },
    closeModal() {
      this.isShowModal = false
      this.selectTicket = undefined
    },
    onOpenCancel() {
      this.isShowModal = false
      this.isShowCancelModal = true
    },
    closeCancelModal() {
      this.isShowCancelModal = false
      this.selectTicket = undefined
      this.isCancelSuccess = false
    },
    async onConfirmCancel(id) {
      try {
        this.$nuxt.$loading.start();
        const result = await this.$axios.$patch( "/api/users/tickets/cancel",
          {
            transaction_id: id
          },
          {
            headers: {
              Authorization: this.$auth.strategy.token.get(),
            },
          }
        );

        if (!result || result.success == false) {
          throw new Error(result?.description || "Something went wrong")
        }
        this.isCancelSuccess = true
        this.$nuxt.$loading.finish()
        this.loadTicket()
      } catch (err) {
        this.isShowCancelModal = false
        this.selectTicket = undefined
        this.isCancelSuccess = false
        this.$nuxt.$loading.finish()
        let message = err.message;

        if (err.response?.data?.message) {
          message = err.response.data.message;
        }
        this.__showToast({
          title: "Failed to cancel ticket.",
          description: message,
          type: "danger",
        });
      }

    },
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/variables';

.ticket {
  padding-top: 164px;
  padding-bottom: 84px;
  background-color: #001811;

  @media screen and (max-width: $md) {
    padding-top: 104px;
    padding-bottom: 24px;
  }

  .green-underscore {

    &::after {
      content: '';
      position: absolute;
      left: 50%;
      bottom: -90%;
      transform: translate(-50%, -50%);
      display: inline-block;
      height: 1em;
      width: 36px;
      border-bottom: 4px solid #1797AD;
    }
  }

  .panel-left {
    background: #FFFFFF;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.02), 0px 10px 20px rgba(6, 63, 72, 0.1);
    border-radius: 5px 0px 0px 5px;

    @media screen and (max-width: $sm) {
      height: auto;
      border-radius: 5px;
      margin-bottom: 30px;
    }
  }

  .panel-right {
    height: 668px;
    background: linear-gradient(180deg, #031F24 0%, #053037 52.95%, #063F48 100%);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.02), 0px 10px 20px rgba(6, 63, 72, 0.1);
    border-radius: 0px 5px 5px 0px;

    &.active-panel {
      background: #FAFAFA;
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.02), 0px 10px 20px rgba(6, 63, 72, 0.1);
    }

    .image_hero {
      width: 100%;
      height: auto;
      border-radius: 5px;
    }

    @media screen and (max-width: $sm) {
      height: auto;
      border-radius: 5px;
    }
  }

}
</style>