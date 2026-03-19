let perPage = 12

module.exports = {
  async fetch() {
    let data = await this.$axios.$get(
      `/upload/files?_limit=${perPage}&_sort=created_at:DESC`
    )
    let count = await this.$axios.$get(`/upload/files/count`)

    return {
      rows: data,
      count: count,
    }
  },
  async changePage(i) {
    let pointer = parseInt(perPage) * (parseInt(i) - 1)
    let data = await this.$axios.$get(
      `/upload/files?_start=${pointer}&_limit=${perPage}&_sort=created_at:DESC`
    )
    return data
  },
  async upload(files) {
    let formData = new FormData()
    Array.from(files).forEach(image => {
      formData.append('files', image)
    })

    try {
      let response = await this.$axios.$post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      return response
    } catch (err) {
      console.log(err)
      throw err
    }
  }
}