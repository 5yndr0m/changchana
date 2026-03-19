import Vue from 'vue'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
import 'verte/dist/verte.css';

import VueQuillEditor from 'vue-quill-editor'
import qs from 'qs'
import draggable from 'vuedraggable'
import VCalendar from 'v-calendar'
import QrcodeVue from 'qrcode.vue'
import SlidingPagination from 'vue-sliding-pagination'
import Flag from 'vue-flagpack'
import Verte from 'verte'
import exportFromJSON from "export-from-json";


Vue.use(VueQuillEditor)
Vue.use(VCalendar)
Vue.prototype.$qs = qs
Vue.prototype.exportFromJSON = exportFromJSON
Vue.use(Flag, { name: 'Flag' })

Vue.component('draggable', draggable)
Vue.component('qrcode-vue', QrcodeVue)
Vue.component('SlidingPagination', SlidingPagination)
Vue.component('verte', Verte)

Vue.directive('click-outside', {
  bind: function (el, binding, vnode) {
    el.clickOutsideEvent = function (event) {
      // here I check that click was outside the el and his children
      if (!(el == event.target || el.contains(event.target))) {
        // and if it did, call method provided in attribute value
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unbind: function (el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  },
});