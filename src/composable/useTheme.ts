import { reactive, watch } from 'vue'

export type ThemeVars = {
  primary: string
  red: string
  white: string
  gray: string
  black: string
}

const theme = reactive<ThemeVars>({
  primary: '#b6b6b6',
  red: '#9d0000',
  white: '#fff',
  gray: '#dedede',
  black: '#3d4734',
})

function writeCssVars(vars: ThemeVars = theme, el: HTMLElement = document.documentElement) {
  el.style.setProperty('--color-primary', vars.primary)
  el.style.setProperty('--color-red', vars.red)
  el.style.setProperty('--color-white', vars.white)
  el.style.setProperty('--color-gray', vars.gray)
  el.style.setProperty('--color-black', vars.black)
}

watch(theme, () => writeCssVars(theme), { deep: true, flush: 'post' })

export function useTheme() {
  return { theme, writeCssVars }
}
