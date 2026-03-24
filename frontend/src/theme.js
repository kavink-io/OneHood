import { createTheme } from '@mantine/core';

export const theme = createTheme({
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  primaryColor: 'violet',

  colors: {
    violet: [
      '#f3f0ff', '#e5dbff', '#d0bfff', '#b197fc',
      '#9775fa', '#845ef7', '#7950f2', '#6741d9',
      '#5f3dc4', '#5435b8'
    ],
  },

  defaultRadius: 'md',

  headings: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: '700',
  },

  components: {
    Paper: {
      defaultProps: {
        shadow: 'sm',
        withBorder: true,
      },
    },
    Card: {
      defaultProps: {
        shadow: 'sm',
        withBorder: true,
      },
    },
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
    TextInput: {
      defaultProps: {
        radius: 'md',
      },
    },
    PasswordInput: {
      defaultProps: {
        radius: 'md',
      },
    },
  },
});