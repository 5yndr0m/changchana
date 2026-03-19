<template>
  <nav class="breadcrumb">
    <ul>
      <li v-for="(item, index) in items" :key="index">
        <nuxt-link v-if="item.path && index < items.length - 1" :to="item.path">
          {{ item.label }}
        </nuxt-link>
        <span v-else :class="{ active: index === items.length - 1 }">
          {{ item.label }}
        </span>
        <i v-if="index < items.length - 1" class="fas fa-chevron-right separator"></i>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'Breadcrumb',
  props: {
    items: {
      type: Array,
      required: true,
      // Expected format: [{ label: 'Home', path: '/' }, { label: 'Current Page' }]
    },
  },
};
</script>

<style scoped>
.breadcrumb {
  margin-bottom: 20px;
}

.breadcrumb ul {
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  flex-wrap: wrap;
}

.breadcrumb li {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.breadcrumb a {
  color: #1a7a89;
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb a:hover {
  color: #145d68;
  text-decoration: underline;
}

.breadcrumb span {
  color: #6b7280;
}

.breadcrumb span.active {
  color: #1f2937;
  font-weight: 600;
}

.separator {
  margin: 0 8px;
  font-size: 10px;
  color: #9ca3af;
}
</style>
