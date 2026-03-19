<template>
  <div class="profile-image _cs-pt">
    <template v-if="!_profileImage">
      <div class="empty-icon" v-if="!loading">
        <i class="fas fa-user"></i>
      </div>
    </template>
    <div class="image" :style="{ backgroundImage: `url(${__getImageURL(_profileImage)})` }">
      <div class="loading" v-if="loading">
        <sl-spinner style="font-size: 2rem; --indicator-color: #fff;"></sl-spinner>
      </div>
    </div>
    <div class="upload-button">
      <i class="fas fa-camera"></i>
    </div>
    <input type="file" name="" @change="e => $emit('updateProfileImage', e.target.files)" />
  </div>
</template>

<script>
export default {
  props: {
    profileImage: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    _profileImage () {
      if (this.$store.state.auth) {
        if (this.$store.state.auth.user) {
          return this.$store.state.auth.user.profile_image ? this.$store.state.auth.user.profile_image.url : ''
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.profile-image {
  position: relative;
  display: flex;
  width: 120px;
  height: 120px;
  display: block;
  margin-left: auto;
  margin-right: auto;

  .loading {
    position: absolute;
    z-index: 10;
    font-size: 32px;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #999;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 100%;
  }

  .empty-icon {
    position: absolute;
    z-index: 10;
    font-size: 20px;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #999;
  }

  .image {
    width: 120px;
    height: 120px;
    border: 3px solid #ffffff;
    box-sizing: border-box;
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.13);
    border-radius: 100%;
    background-color: #eee;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    overflow: hidden;
  }

  .upload-button {
    width: 24px;
    height: 24px;
    border-radius: 100%;
    background: #ffffff;
    box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.1);
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: 15px;
    bottom: 0;
    z-index: 15;
  }

  input {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    top: 0;
    left: 0;
    z-index: 30;
  }
}
</style>
