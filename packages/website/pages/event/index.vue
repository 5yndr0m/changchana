<template>
  <div>

    <EventHero
      :label="eventHero.label"
      :title="eventHero.title"
      :cover_image="eventHero.cover_image"
      :description="eventHero.description"
      :url="eventHero.url" />

    <section class="_pdt-8px">

      <EventList
        v-if="highlights.length > 0"
        label="HIGHLIGHT"
        title="ห้ามพลาด"
        :events="highlights"
        :showDialogLogIn="showDialogLogIn" />
      <br/>
      <EventList
        v-if="events.length > 0"
        :events="events"
        :changePage="changePage"
        :changeFilter="changeFilter"
        :currentPage="currentPage"
        :pageCount="pageCount"
        :showDialogLogIn="showDialogLogIn"
      />

    </section>

    <AlertModal :isShow="isAlertModal" :hasClose="false" @close="closeModal">
      <template #body>
        <p>โปรดเข้าสู่ระบบเพื่อ ดูรายละเอียด</p>
      </template>
      <template #footer>
        <button class="btn btn-primary" @click="$router.push('/signin?redirect=event')">Sign In</button>
      </template>
    </AlertModal>

  </div>
</template>

<script>
import qs from 'qs'
import moment from "moment";
import EventHero from '~/components/Event/EventHero.vue'
import EventList from '~/components/Event/EventList.vue'
import AlertModal from "~/components/AlertModal";

const perPage = 6
let branches = []

const textRoundDate = (rounds) => {
  const lastIndex = rounds.length - 1
  return rounds.map((r, i) => moment(r.date).format(`D MMM${i === lastIndex ? ' YYYY': ''}`)).join(", ");
}

const dtoEvents = events => events.map( ev => ({
  id: ev.id,
  title: ev.title,
  type: ev.type,
  status: ev.status,
  selling_type: ev.selling_type,
  image: ev.cover_image?.url || '',
  branch_name: ev.branch?.name || branches.find(b => b.id == ev.branch)?.name || '-',
  round_date: textRoundDate(ev.rounds),
  link: `/event/${ev.slug}`,
}))

export default {
  head() {
    return {
      title: 'คอนเสิร์ต'
    }
  },
  data() {
    return {
      currentPage: 1,
      filterType: '',
      isAlertModal: false,
    }
  },
  async asyncData({ $axios, store }) {
    branches = store.state.branches
    let pageData = await $axios.$get(`/event-page`)
    let eventHero = {
      label: pageData.hero.label,
      title: pageData.hero.title,
      cover_image: pageData.hero.cover_image?.url || '',
      description: pageData.hero.description,
      url: pageData.url,
    }

    let highlights = pageData?.highlight_events || []
    const excludeEvents = highlights.map(hl => hl.id)
    highlights = dtoEvents(highlights)

    const filters = qs.stringify({
      _where: [
        { id_nin: excludeEvents },
      ],
    });

    let events = await $axios.$get(`/events?_limit=${perPage}&_sort=published_at:DESC&${filters}`)
    events = dtoEvents(events)

    const count = await $axios.$get(`/events/count?${filters}`)
    const pageCount = Math.ceil((count - 1) / perPage)

    return {
      eventHero,
      highlights,
      events,
      count,
      pageCount,
      excludeEvents,
    }
  },
  layout: 'main',
  components: {
    EventHero,
    EventList,
    AlertModal,
  },
  methods: {
    async updateEventList() {

      let startAt = this.currentPage === 1 ? 0 : (this.currentPage - 1) * perPage
      const filters = qs.stringify({
        _where: [
          { id_nin: this.excludeEvents },
          this.filterType ? { type_eq: this.filterType } : undefined,
        ],
      });
      try {
        let events = await this.$axios.$get(
          `/events?_limit=${perPage}&_start=${startAt}&_sort=published_at:DESC&${filters}`
        )
        this.events = dtoEvents(events)

      } catch (err) {
        console.log(err)
      }
    },
    async changePage(page) {
      this.currentPage = page
      this.updateEventList()
    },
    async changeFilter(filterType) {
      this.filterType = filterType
      this.updateEventList()
    },
    showDialogLogIn() {
      this.isAlertModal = true
    },
    closeModal() {
      this.isAlertModal = false
    },
  }
}
</script>


