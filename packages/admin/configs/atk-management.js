module.exports = {
  singleton: true,
  fields: [
    {
      label: 'Reward',
      key: 'Reward',
      labelKey: 'title',
      repeatable: true,
      fields: [
        {
          label: 'Branch',
          key: 'branch',
          type: 'relation',
          contentType: 'branches',
          labelKey: 'name',
          valueKey: 'id',
          size: 'half',
        },
        {
          label: 'Point',
          key: 'points',
          type: 'number',
          size: 'half',
        },
      ],
      initValue: {
        branch: null,
        points: 0,
      },
    },
  ],
  sidebarFields: [],
  editTitle: 'ATK Management',
  initValue: {
    reward: null,
  },
}
