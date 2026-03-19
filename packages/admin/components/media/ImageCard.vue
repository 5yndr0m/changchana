<template>
  <div class="media-library-card" :class="{ '-no-hover': !actions }" v-if="data">
    <div class="actions" v-if="actions">
      <a :href="__formatURL(data.url)" target="_blank">
        <i class="fas fa-link"></i>
      </a>
      <i class="fas fa-times remove" @click="$emit('remove')"></i>
    </div>
    <div class="image" v-if="data.ext === '.jpg' || data.ext === '.jpeg' || data.ext === '.png'" :style="{ backgroundImage: `url('${__formatURL(data.url)}')` }"></div>
    <div class="file" v-else>
      <i class="fas fa-file"></i>
    </div>
    <h4
      class="_fs-6 _mgt-12px"
      v-html="
        data.name.length > 16 ? `${data.name.slice(0, 16) + '...'}` : data.name
      "
    ></h4>
    <p
      class="_fs-7 _mgt-4px"
      v-html="`Uploaded at ${$moment(data.created_at).format('DD MMM YYYY')}`"
    ></p>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: null,
    },
    actions: {
      type: Boolean,
      default: true
    }
  },
}
</script>

<style lang="scss" scoped>
.media-library-card {
  position: relative;
  transition: .3s;

  > div.file {
    width: 100%;
    height: auto;
    padding-top: 60%;
    background-color: #fafafa;
    border: 1px solid #e2e2e2;
    border-radius: 4px;
    font-size: 24px;
    position: relative;

    > i {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      opacity: .4;
    }
  }

  > div.image {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    width: 100%;
    height: auto;
    padding-top: 60%;
    border-radius: 4px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    position: relative;
    overflow: hidden;

    &:before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background: linear-gradient(
        to bottom left,
        rgba(0, 0, 0, 0.15),
        rgba(0, 0, 0, 0) 70%
      );
      opacity: 0;
      transition: 0.3s;
    }
  }

  img {
    width: 100%;
    height: auto;
  }

  .actions {
    position: absolute;
    top: 9px;
    right: 9px;
    border-radius: 2px;
    background-color: #fff;
    padding: 4px;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition: 0.3s;
    font-size: 13px;
    z-index: 10;

    > * {
      cursor: pointer;
    }

    .upload {
      position: relative;
      cursor: pointer;

      input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
      }
    }

    i {
      color: #666;
      margin-left: 6px;
      margin-right: 6px;

      &.remove {
        color: #de5200 !important;
      }
    }
  }

  &:hover {
    transform: scale(1.02);
    transition: .3s;

    .actions {
      opacity: 1;
      visibility: visible;
      pointer-events: all;
      transition: 0.3s;
    }

    > div.image {
      &:before {
        opacity: 1;
        transition: 0.3s;
      }
    }
  }

  &.-no-hover {
    &:hover {
      > div.image {
        &:before {
          opacity: 0 !important;
        }
      }
    }
  }
}
</style>