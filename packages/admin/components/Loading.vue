<template>
  <div class="loading-spinner" :class="{ '-active': loading, '-float': float }">
    <div>
      <!-- <img src="~assets/images/loader.svg" alt="" /> -->
      <!-- By Sam Herbert (@sherb), for everyone. More @ http://goo.gl/7AJzbL -->
      <svg
        width="38"
        height="38"
        viewBox="0 0 38 38"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
            <stop stop-opacity="0" offset="0%" />
            <stop stop-opacity=".631" offset="63.146%" />
            <stop offset="100%" />
          </linearGradient>
        </defs>
        <g fill="none" fill-rule="evenodd">
          <g transform="translate(1 1)">
            <path
              d="M36 18c0-9.94-8.06-18-18-18"
              id="Oval-2"
              stroke="url(#a)"
              stroke-width="2"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 18 18"
                to="360 18 18"
                dur="0.9s"
                repeatCount="indefinite"
              />
            </path>
            <circle cx="36" cy="18" r="1">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 18 18"
                to="360 18 18"
                dur="0.9s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    float: {
      type: Boolean,
      default: true,
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/styles/variables';

.loading-spinner {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: 0.3s;

  stop {
    stop-color: $primary-color !important;
  }

  circle {
    fill: $primary-color !important;
  }

  &.-float {
    background: rgba(255, 255, 255, 0.4);
    position: absolute;
    top: 0;
    left: 0;
  }

  &.-active {
    opacity: 1;
    visibility: visible;
    pointer-events: all;
    transition: 0.3s;
  }

  > div {
    width: 48px;
    height: auto;

    img {
      width: 100%;
      height: auto;
    }
  }
}
</style>