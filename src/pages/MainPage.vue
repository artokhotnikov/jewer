<script setup lang="ts">
import { useRouter } from 'vue-router'
import VTitle from '@/components/ui/VTitle.vue'

const router = useRouter()

const handleClick = (item: string) => {
  router.push(`/gallery/${item}`)
}
</script>

<template>
  <div class="menu">
    <v-title>
      Исследуйте богатство культуры <br />
      и традиций региона
    </v-title>

    <div class="logo">
      <img src="@/assets/icons/logo.svg" alt="" />
    </div>

    <div class="menu-items">
      <div class="menu-item" @click="handleClick('Музыка')">
        <img src="/files/menu/music.png" alt="" />
      </div>

      <div class="menu-item" @click="handleClick('Искусство')">
        <img src="/files/menu/issk.png" alt="" />
      </div>

      <div class="menu-item" @click="handleClick('Культура')">
        <img src="/files/menu/cult.png" alt="" />
      </div>

      <div class="menu-item" @click="handleClick('Менора')">
        <img src="/files/menu/menora.png" alt="" />
      </div>
    </div>

    <div class="menu-items-shadow">
      <img src="/files/menu/shadow.svg" alt="" />
    </div>

    <div class="menu-line">
      <svg
        width="3840"
        height="623"
        viewBox="0 0 3840 623"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_173_7659)">
          <path
            d="M-557 32L636.4 578.638C677.692 597.552 725.781 594.087 763.935 569.45L1406.06 154.813C1444.03 130.295 1491.85 126.738 1533.03 145.368L2262.33 475.323C2302.08 493.306 2348.12 490.652 2385.53 468.22L3048.42 70.8355C3082.91 50.1584 3124.91 46.1981 3162.66 60.0626L4022.5 375.863"
            stroke="white"
            stroke-width="16"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_173_7659"
            x="-584.331"
            y="0.726685"
            width="4633.59"
            height="621.993"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="12" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_173_7659" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_173_7659"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.menu {
  width: 100vw;
  height: 100vh;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('/files/menu/bg-1.svg') center / cover no-repeat;
  }
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('/files/menu/bg-2.svg') center / cover no-repeat;
  }
}
.logo {
  position: absolute;
  top: 80px;
  right: 80px;
  z-index: 2;
}

.menu-item {
  position: absolute;
  z-index: 2;
  opacity: 0;
  transform: translateY(20px);
  animation:
    fadeInUp 0.8s ease-out forwards,
    float 2s ease-in-out infinite;

  &:nth-child(1) {
    top: 431px;
    left: 65px;
    animation-delay: 0.2s, 1s;
  }
  &:nth-child(2) {
    top: 720px;
    left: 886px;
    animation-delay: 0.4s, 1.2s;
  }
  &:nth-child(3) {
    top: 328px;
    left: 1650px;
    animation-delay: 0.6s, 1.4s;
  }
  &:nth-child(4) {
    top: 629px;
    left: 2508px;
    animation-delay: 0.8s, 1.6s;
  }
}

.menu-items-shadow {
  position: absolute;
  left: 166px;
  top: 1042px;
  z-index: 1;
}

.menu-line {
  position: absolute;
  left: 0;
  top: 1117px;
  z-index: 1;
  animation: fadeInLine 2.5s ease-out 1.5s forwards;
  opacity: 0;

  svg {
    filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.3));
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes fadeInLine {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  50% {
    opacity: 0.7;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInPath {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
