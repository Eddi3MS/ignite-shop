import { createStitches } from '@stitches/react'

export const {
  config, styled, css, globalCss, keyframes,
  getCssText, theme, createTheme
} = createStitches({
  theme: {
    colors: {
      white: '#fff',

      gray900: '#121214',
      gray800: '#282024',
      gray300: '#c4c4cc',
      gray100: '#e1e1e6',

      green500: '#00875F',
      green300: '#00B37E'
    },

    fontSizes: {
      md: '1.125rem',
      lg: '1.25rem',
      xl: '1.5rem',
      '2xl': '2rem',
    }
  }
})
