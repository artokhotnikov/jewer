<template>
  <div class="title">
    <slot />
  </div>
</template>

<style scoped>
.title {
  font-weight: 700;
  font-size: 80px;
  line-height: 120%;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: #fff;
  backdrop-filter: blur(26px);
  box-shadow: inset 0 0 24px 0 rgba(0, 0, 0, 0.25);
  border-radius: 170px;
  padding: 48px 120px;
  background-color: #19191964;
  border: 5px solid #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 48px;
  position: absolute;
  top: 88px;
  left: 88px;
  z-index: 2;
}
</style>
