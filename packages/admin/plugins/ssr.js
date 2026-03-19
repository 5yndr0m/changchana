import Vue from 'vue'

import AlertToast from '~/components/AlertToast'
Vue.component('AlertToast', AlertToast)

import Header from '~/components/Header'
import Table from '~/components/Table'
import ContentEdit from '~/components/views/ContentEdit'
import ContentEditPage from '~/components/views/ContentEditPage'
import ContentListPage from '~/components/views/ContentListPage'
import Pagination from '~/components/Pagination'
import MediaGallery from '~/components/media/MediaGallery'
import MediaGalleryModal from '~/components/media/MediaGalleryModal'
import Accordion from '~/components/Accordion'
import EmptyState from '~/components/EmptyState'
Vue.component('Header', Header)
Vue.component('Table', Table)
Vue.component('ContentEdit', ContentEdit)
Vue.component('ContentEditPage', ContentEditPage)
Vue.component('ContentListPage', ContentListPage)
Vue.component('Pagination', Pagination)
Vue.component('MediaGallery', MediaGallery)
Vue.component('MediaGalleryModal', MediaGalleryModal)
Vue.component('Accordion', Accordion)
Vue.component('EmptyState', EmptyState)

import Loading from '~/components/Loading'
Vue.component('Loading', Loading)

import VueLodash from 'vue-lodash'
import lodash from 'lodash'
Vue.use(VueLodash, { lodash: lodash })

import Multiselect from 'vue-multiselect'
Vue.component('multiselect', Multiselect)

import vSlButton from '~/components/vSlButton'
Vue.component('v-sl-button', vSlButton)

import GlobalSettings from '~/components/GlobalSettings'
Vue.component('GlobalSettings', GlobalSettings)