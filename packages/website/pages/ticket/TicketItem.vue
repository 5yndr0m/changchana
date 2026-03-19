<template>
  <div class="ticket-item _dp-f _fdrt-r _alit-ct _pdr-8px _mgbt-16px">
    <div class="date-box">
      <p class="day _tal-ct">{{ day }}</p>
      <p class="month _tal-ct">{{ month }}</p>
    </div>
    <div class="ticket-text _dp-f _fdrt-cl _pdl-16px _pdr-8px">
      <p class="text-type _fw-600 _pdt-8px _pdbt-4px">{{ type }}</p>
      <p class="text-title _fw-600">{{ title }}</p>
      <div class="text-footer _dp-f _fdrt-r _jtfct-spbtw _pdbt-8px" >
        <p class="ticket-table">{{ tables }}</p>
        <p class="branch-name">{{ branch_name }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    day: {
      type: String,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    tables: {
      type: String,
      required: true,
    },
    branch_name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/variables';

.ticket-item {
  background: #FFFFFF;
  border: 1px solid #F4F4F4;
  box-shadow: 0px 10px 20px rgba(6, 63, 72, 0.1);
  border-radius: 5px;
  cursor: pointer;
  .date-box {
    width: 72px;
    height: 72px;
    background: #1797AD;
    border-radius: 5px 0px 0px 5px;

    .day {
      line-height: 100%;
      font-weight: 700 !important;
      font-size: 40px;
      margin-top: 10px;
      margin-bottom: 2px;
    }
    .month {
      line-height: 100%;
      font-weight: 500 !important;
      font-size: 8px;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.2em;
    }
  }

  .ticket-text {
    width: calc(100% - 72px);
    height: 72px;
    overflow: hidden;
    .text-type {
      font-size: 12px !important;
      line-height: 100%;
      color: #1797AD;
      text-transform: capitalize;
    }
    .text-title {
      font-size: 18px !important;
      line-height: 100%;
      color: #171717;

      display: block;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;

      @media screen and (max-width: 425px) {
        font-size: 14px !important;
      }
    }
    .text-footer {
      margin-top: auto;

      p {
        font-size: 10px !important;
        font-weight: 500 !important;
        line-height: 100%;
        color: #999999;

        @media screen and (max-width: 425px) {
          font-size: 8px !important;
        }
      }
      .ticket-table {
        letter-spacing: 0.1em;
      }

      .branch-name {
        text-transform: uppercase;
      }
    }
  }
}

</style>