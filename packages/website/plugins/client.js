import Vue from 'vue'

import VCalendar from 'v-calendar'
Vue.use(VCalendar, {})

import OtpInput from '@bachdgvn/vue-otp-input'
Vue.component('v-otp-input', OtpInput)

import VueCountdown from '@chenfengyuan/vue-countdown'
Vue.component('vue-countdown', VueCountdown)

import Affix from 'vue-affix'
Vue.use(Affix)

import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
Vue.use(VueAwesomeSwiper, /* { default options with global component } */)

import "vue-sliding-pagination/dist/style/vue-sliding-pagination.css";
import SlidingPagination from 'vue-sliding-pagination'
Vue.component('SlidingPagination', SlidingPagination)

// import Pagination from 'vue-pagination-2'
// Vue.component('pagination', Pagination)

import Paginate from 'vuejs-paginate'
Vue.component('paginate', Paginate)

import VueScrollactive from 'vue-scrollactive'
Vue.use(VueScrollactive)

import Accordion from '~/components/Accordion'
Vue.component('Accordion', Accordion)

window.bootstrap = require('../static/bootstrap.bundle.min.js');

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const options = {
  confirmButtonColor: '#3ca4b6',
  cancelButtonColor: 'cb2731',
  customClass: {
    container: 'chongjaroen-alert',
    icon: 'custom-class-icon',
    confirmButton: "btn-primary"
  }
};
Vue.use(VueSweetalert2, options);