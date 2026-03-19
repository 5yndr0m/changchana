import Vue from 'vue'

const {
  fetch: fetchContent,
  save: saveContent,
  create: createContent,
  destroy: destroyContent,
  changePage: changeContentPage,
} = require('./mixins/content')

const {
  fetch: fetchMedia,
  changePage: changeMediaPage,
  upload: uploadMedia,
} = require('./mixins/media')

const { determineSize } = require('./mixins/contentEdit')
const { changeLocale } = require('./mixins/locale')

Vue.mixin({
  methods: {
    __fetchContentType: fetchContent,
    __saveContentType: saveContent,
    __createContentType: createContent,
    __deleteContentType: destroyContent,
    __changePage: changeContentPage,
    __fetchMedia: fetchMedia,
    __changeMediaPage: changeMediaPage,
    __uploadFile: uploadMedia,
    // Locale
    __changeLocale: changeLocale,
    // Content Edit
    __determineSize: determineSize,
    // Helpers
    __formatURL(url) {
      if (url.includes('http')) return url
      else if (url.includes('digitaloceanspaces')) {
        if (!url.includes('http')) return `https://${url}`
        else return url
      } else return `http://localhost:1337${url}`
    },
    __getTerm(slug) {
      let term = this.$store.state.terms.filter(t => t.slug === slug)
      return term.length === 0 ? slug : term[0].value
    },
    __capitalize(string) {
      let returnVal

      if (typeof string === 'string')
        returnVal = string[0].toUpperCase() + string.slice(1)
      else if (typeof string === 'boolean')
        returnVal = string ? 'True' : 'False'
      else returnVal = ''

      return returnVal
    },
    __showToast(option) {
      // console.log('showToast')
      this.$store.commit('SET_BY_KEY', {
        key: 'toastData',
        value: option,
      })
      return
    },
    __getExtension(filename) {
      let re = /(?:\.([^.]+))?$/
      let ext = re.exec(filename)[1]
      return ext
    },
    __getAccordionLabel(data, labelKey, options) {
      if (data) {
        if(options?.getLabel) {
          return options.getLabel(data);
        } else if (data[labelKey]) {
          let label = "-";
          const str = `${data[labelKey]}`;
          if (str.length <= 20) {
            label = data[labelKey]
          } else {
            label = str.slice(0, 20) + '...'
          }
          if (options?.prefix) {
            label = `${options.prefix} ${label}`;
          }

          return label;
        } else {
          if (data.id) {
            return `${data.id}`
          } else {
            return 'New Content'
          }
        }
      } else {
        return 'New Content'
      }
    },
    __makeId(length = 5) {
      let result = ''
      let characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      let charactersLength = characters.length
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        )
      }
      return result
    },
    __dataCleanup(data, filterKeywords, preservedWords) {
      // Functions for testing array and object
      const isArray = a => !!a && a.constructor === Array
      const isObject = a => !!a && a.constructor === Object

      // We start of by store an upcoming data to variable in order to manipulate the data
      let processedData = data

      // We iterate through the object
      Object.keys(processedData).forEach(prop => {
        // If the property is an object then recursively call the function
        if (isObject(processedData[prop])) {
          if (filterKeywords.includes(prop)) delete processedData[prop]
          // Check if prop contains some preserved word or not
          // eg. image, img
          // In order to prevent function to remove image id
          // which will cause problem when saving data to strapi
          else
            !preservedWords.some(w => prop.includes(w))
              ? this.__dataCleanup(processedData[prop], filterKeywords)
              : false
        }
        // If the property is an array then map through the array and call the function recursively
        else if (isArray(processedData[prop])) {
          if (filterKeywords.includes(prop)) delete processedData[prop]
          else if (!preservedWords.includes(prop))
            processedData[prop].map(val =>
              this.__dataCleanup(val, filterKeywords)
            )
        }
        // If the property is just a value then check if the key included in filterKeywords array, if it's not just pass
        else filterKeywords.includes(prop) ? delete processedData[prop] : false
      })

      // When everything's done return the value
      return processedData
    },
  },
})
