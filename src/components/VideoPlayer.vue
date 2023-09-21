<script setup lang="ts">
import "video.js/dist/video-js.min.css";
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import videojs from "video.js";

let player: videojs.Player | null = null;
const reseted = ref(true);
const video = ref<HTMLVideoElement>();

defineExpose({ video, player });

const emit = defineEmits(["ready"]);

const defaultVideoOptions: videojs.PlayerOptions = {
  autoplay: false,
  controls: true,
  inactivityTimeout: 0,
  preload: "auto",
  fluid: false,
  techOrder: ["html5"],
  liveui: true,
  responsive: true,
  sources: [],
  playbackRates: [0.5, 1, 1.25, 1.5, 1.75, 2, 2.5, 3],
};

const props = defineProps<{
  src?: string;
  crossOrigin?: string;
  options?: videojs.PlayerOptions;
  playsinline?: string;
  events?: any[];
  // trackList?: any[];
}>();

watch(
  () => props.options,
  (options, _oldOptions) => {
    dispose(() => {
      if (options?.sources?.length) {
        initialize();
      }
    });
  }
);

watch(
  () => props.src,
  () => {
    if (props.src) {
      setSrc(props.src);
    }
  }
);

onMounted(async () => {
  await nextTick();
  initialize();
});

onBeforeUnmount(() => {
  if (!!player) {
    dispose(null);
  }
});

const dispose = (callback) => {
  if (player && player.dispose) {
    player.dispose();
    player = null;
    nextTick(() => {
      reseted.value = false;
      nextTick(() => {
        reseted.value = true;
        nextTick(() => {
          callback && callback();
        });
      });
    });
  }
};

const initialize = () => {
  if (!!video.value) {
    const videoOptions = { ...defaultVideoOptions, ...props.options };
    // ios fullscreen
    // if (video.value.playsInline) {
    video.value.setAttribute("playsinline", props.playsinline || "");
    video.value.setAttribute("webkit-playsinline", props.playsinline || "");
    video.value.setAttribute("x5-playsinline", props.playsinline || "");
    video.value.setAttribute("x5-video-player-type", "h5");
    video.value.setAttribute("x5-video-player-fullscreen", "false");
    // }
    // cross origin
    if (!!props.crossOrigin) {
      video.value.crossOrigin = props.crossOrigin;
      video.value.setAttribute("crossOrigin", props.crossOrigin);
    }
    if (videoOptions.plugins) {
      delete videoOptions.plugins.__ob__;
    }
    player = videojs(video.value, videoOptions, () => {
      emit("ready");
    });

    if (!!props.src) {
      setSrc(props.src);
    }
  }
};

const setSrc = (source: string) => {
  if (!!player) {
    const video = {
      src: source,
    };
    player.pause();
    player.reset(); // in IE11 (mode IE10) direct usage of src() when <src> is already set, generated errors,
    player.src(video);
    player.load();
  }
};
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
  customOptions: {},
};
</script>

<template>
  <video v-if="reseted" ref="video" class="video-js vjs-default-skin" v-bind="$attrs" playsInline>
    <!-- <track
      v-for="(crtTrack, index) in trackList"
      :key="index"
      :kind="crtTrack.kind"
      :label="crtTrack.label"
      :src="crtTrack.src"
      :srcLang="crtTrack.srcLang"
      :default="crtTrack.default"
    /> -->
    <p class="vjs-no-js">
      To view this video please enable JavaScript, and consider upgrading to a web browser that
      <a href="https://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
    </p>
  </video>
</template>

<style lang="scss">
.video-js {
  width: 100%;
  // height: 4;
}

.vjs-control-bar {
  display: flex !important;
  visibility: visible;
  opacity: 1;

  .vjs-playback-rate,
  .vjs-time-control {
    display: flex !important;
  }
}
</style>
