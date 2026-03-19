import Vue from 'vue'

import LocomotiveScroll from 'locomotive-scroll'
Vue.prototype.$LocomotiveScroll = LocomotiveScroll

import VCalendar from 'v-calendar';
Vue.use(VCalendar, {});

import VueQrcodeReader from "vue-qrcode-reader";
Vue.use(VueQrcodeReader);

import QRScanner from '~/components/QRScanner'
Vue.component('QRScanner', QRScanner)

// const Html5QrcodeScanner = require('html5-qrcode')