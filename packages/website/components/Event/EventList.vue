<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12 _mgbt-0px-md _mgbt-24px">
        <h4 class="section-hero-label _tal-l-md _tal-ct _mgbt-16px" style="text-transform: uppercase;">{{label || typeFilters[currentFilter].label}}</h4>
        <h1 v-if="title" class="_fs-2-md _fs-3 _mgbt-16px _tal-l-md _tal-l">{{title}}</h1>
        <div v-else class="dropdown event-selector" >
          <div class="dropdown-toggle" type="button" id="dropdownFilterEvent" data-bs-toggle="dropdown" aria-expanded="false">
            <h1 class="_fs-2-md _fs-3 _mgbt-16px _tal-l-md _tal-ct">{{typeFilters[currentFilter].title}} <i class="fas fa-chevron-down"></i></h1>
          </div>
          <ul class="dropdown-menu _fs-3-md _fs-5" aria-labelledby="dropdownFilterEvent">
            <li v-for="(filter, index) in typeFilters" class="dropdown-item" @click="()=>onChangeFilter(filter.value, index)" :key="filter.label">{{ filter.title }}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-4 _mgbt-32px" v-for="(val) in events" :key="`event-${val.id}`">
        <EventCard
          :title="val.title"
          :type="val.type"
          :status="val.status"
          :selling_type="val.selling_type"
          :image="val.image"
          :branch_name="val.branch_name"
          :round_date="val.round_date"
          :showDialogLogIn="showDialogLogIn"
          :link="val.link" />
      </div>
    </div>
    <div class="_dp-f _jtfct-ct" v-if="pageCount > 1">
      <sliding-pagination :current="currentPage" :total="pageCount" @page-change="changePage"
        :class="{ '-w-pagination': pageCount >= 10 }"></sliding-pagination>
    </div>
  </div>
</template>

<script>
import EventCard from './EventCard'

export default {
  props: {
    label: String,
    title: String,
    events: {
      type: Array,
      required: true,
    },
    changePage: Function,
    changeFilter: Function,
    currentPage: Number,
    pageCount: Number,
    showDialogLogIn: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      currentFilter: 0,
      typeFilters: [
        { label: 'All Event', title: 'อีเวนต์ทั้งหมด', value: '' },
        { label: 'Concert', title: 'คอนเสิร์ต', value: 'concert' },
        { label: 'Festival', title: 'เฟสติวัล', value: 'festival' },
        { label: 'Party', title: 'ปาร์ตี้', value: 'party' },
      ],
    }
  },
  components: {
    EventCard,
  },
  methods: {
    onChangeFilter(filter, index) {
      this.currentFilter = index
      this.changeFilter(filter)
    },
    onSelectChange(e) {
      this.changeFilter(e.target.value)
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/variables';
.event-selector {

  & :deep(.dropdown-toggle) {
    cursor: pointer;

    &::after {
      display: none;
    }

    i {
      opacity: 0.6;
    }
    
  }

  
  & :deep(ul) {
    @media screen and (max-width: $md) {
      width: 80%;
      max-width: 300px;
      top: 100% !important;
      left: 50% !important;
      transform: translate(-50%, 0) !important;
    }
  }

}
</style>