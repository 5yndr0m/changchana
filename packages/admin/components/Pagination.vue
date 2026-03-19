<template>
  <div class="_dp-f _fdrt-r-md _fdrt-cl _jtfct-spbtw _alit-ct _pdv-16px" v-if="_totalPages">
    <label v-if="count" class="_dp-b-md _mgbt-0px-md _mgbt-16px">
      <span v-html="activePage"></span>
      <span> of </span>
      <span v-html="_totalPages"></span>
      <span>Page</span>
    </label>
    <sliding-pagination
      :current="activePage"
      :total="_totalPages"
      :nonSlidingSize="5"
      @page-change="page => $emit('changePage', page)"
    ></sliding-pagination>
  </div>
</template>

<script>
export default {
  props: {
    activePage: {
      type: Number,
      default: 1,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    count: {
      type: Number,
      default: null,
    },
    perPage: {
      type: Number,
      default: null
    }
  },
  data: () => ({
    perPageVal: null
  }),
  computed: {
    _totalPages() {
      if (this.perPageVal) return Math.ceil(this.count / this.perPageVal)
    },
  },
  mounted () {
    this.perPageVal = this.perPage ? this.perPage : this.$store.state.perPage
  }
}
</script>

<style lang="scss" scoped>
.pagination-wrapper {
  padding-top: 24px;
  padding-bottom: 24px;

  .pagination {
    display: flex;
    align-items: center;

    > .pagination-page {
      margin-left: 4px;
      margin-right: 4px;
      width: 32px;
      height: 32px;
      border-radius: 4px;
      border: 1px solid #eee;
      background-color: #fff;
      box-shadow: 0 3px 7px rgba(0, 0, 0, 0.07);
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.3s;
      cursor: pointer;

      &:hover {
        background-color: #fafafa !important;
        transform: scale(1.1);
        transition: 0.3s;
      }

      &.-active {
        color: #fff !important;
        background-color: #1a7a89 !important;
        border-color: #125f6b !important;
      }
    }
  }
}
</style>
