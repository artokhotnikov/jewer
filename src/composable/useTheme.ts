import { reactive, watch } from 'vue'

export type ThemeVars = {
  primary: string;
  red: string,
};

const theme = reactive<ThemeVars>({
  primary: '#b6b6b6',
  red: '#9d0000',
})

function writeCssVars(vars: ThemeVars = theme, el: HTMLElement = document.documentElement) {
  el.style.setProperty('--color-primary', vars.primary)
  el.style.setProperty('--color-red', vars.red)
}

watch(theme, () => writeCssVars(theme), { deep: true, flush: 'post' })

export function useTheme() {
  return { theme, writeCssVars }
}
