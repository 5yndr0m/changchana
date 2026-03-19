module.exports = {
  determineSize: (val) => {
    // Determine grid size for field
    let result = {
      half: 'col-md-6',
      'one-third': 'col-md-4',
      default: 'col-md-12',
    }[val ? val : 'default']

    return result
  }
}