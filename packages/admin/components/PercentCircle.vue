<!-- Referace from https://github.com/teobais/percircle-vue -->
<template>
  <div :class="[
    'percircle',
    { animate, initialized: initialized },
  ]">
    <span :style="{ color: textColor }">{{ displayText }}</span>

    <svg viewBox="0 0 120 120">
      <circle class="filler-bar circle-bar" cx="60" cy="60" r="50" fill="none" />

      <circle class="progress-bar circle-bar" cx="60" cy="60" r="50" fill="none" :stroke="progressBarColor"
        :pathLength="fillerMax" :stroke-dasharray="fillerMax" :stroke-dashoffset="fillerOffset" />
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    animate: {
      type: Boolean,
      default: true,
    },
    displayTextAtZero: {
      type: Boolean,
      default: true,
    },
    progressBarColor: {
      type: String,
      default: "#A6CE39",
    },
    percent: {
      type: Number,
      default: 0,
    },
    text: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      initialized: false,
    };
  },
  computed: {
    fillerMax() {
      return 100;
    },
    fillerOffset() {
      let max = this.fillerMax;
      let val = this.renderedPercent;
      return max - val;
    },
    renderedPercent() {
      if (!this.initialized) {
        return 0;
      }
      return this.percent > 100 ? 100 : this.percent < 0 ? 0 : this.percent;
    },
    displayText() {
      let text = this.text;
      if (this.renderedPercent || this.displayTextAtZero) {
        text = text || `${this.percent}%`;
      }
      return text;
    },
    textColor() {
      return this.hovering ? this.progressBarColor : "";
    },
  },
  mounted() {
    this.initPercircle();
  },
  methods: {
    initPercircle() {
      setTimeout(() => {
        this.initialized = true;
      }, 0);
    },
  },
};
</script>

<style lang="scss" scoped>
.percircle {
  position: relative;
  font-size: 120px;
  width: 1.3em;
  height: 1.3em;
  margin: 0 auto;
  background: transparent;

  svg {
    transform: rotate(-90deg);
  }

  &.animate {

    &>span,
    .circle-bar {
      transition: all 0.2s ease-in-out;
    }
  }

  &>span {
    position: absolute;
    z-index: 1;
    width: 100%;
    top: 50%;
    height: 1em;
    display: block;
    text-align: center;
    white-space: nowrap;
    font-size: 0.2em;
    margin-top: -0.5em;
    color: rgba(52, 59, 62, 0.5);
  }

  &:hover {
    cursor: default;

    &>span {
      -webkit-transform: scale(1.3);
      -moz-transform: scale(1.3);
      -ms-transform: scale(1.3);
      -o-transform: scale(1.3);
      transform: scale(1.3);
      color: #307bbb;
    }

    .circle-bar {
      r: 52;
      stroke-width: 5;
    }
  }

  &.small {
    font-size: 80px;
  }

  &.big {
    font-size: 240px;
  }

  &.dark {
    >span {
      color: #ffffff;
    }

    .filler-bar {
      stroke: rgba(255, 255, 255, 0.7);
    }
  }

  .filler-bar {
    stroke: rgba(0, 0, 0, 0.1);
  }

  .circle-bar {
    stroke-width: 8;
  }
}
</style>