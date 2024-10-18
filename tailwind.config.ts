import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/react';

const config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      screens: { xs: '510px' },
      transitionTimingFunction: {
        'minor-spring': 'cubic-bezier(0.18,0.89,0.82,1.04)'
      },
      fontFamily: {
        lovelace: ['LovelaceRegular', 'sans-serif'],
        lovelaceItalicBold: ['LovelaceItalicBold', 'sans-serif'],
        LovelaceBold: ['LovelaceBold', 'sans-serif'],
        Glacial: ['Glacial', 'sans-serif'],
        GlacialBold: ['Glacial-Bold', 'sans-serif'],
        GlacialItalic: ['Glacial-Italic', 'sans-serif'],
        basier: ['Basier Square', 'sans-serif']
      },
      keyframes: {
        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' }
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' }
        },
        'reveal-up': {
          '0%': { opacity: '0', transform: 'translateY(80%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'reveal-down': {
          '0%': { opacity: '0', transform: 'translateY(-80%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'content-blur': {
          '0%': { filter: 'blur(0.3rem)' },
          '100%': { filter: 'blur(0)' }
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' }
        },
        'marquee-vertical': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(calc(-100% - var(--gap)))' }
        }
      },
      animation: {
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
        marquee: 'marquee var(--duration) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
        fadeIn: 'fadeIn 0.5s ease-in'
      }
    }
  },
  darkMode: ['class', '[data-theme^="dark-"]'],
  plugins: [
    require('tailwindcss-animate'),
    nextui({
      themes: {
        light: {
          colors: {
            primary: {
              '50': '#f2ece6',
              '100': '#dfd2c2',
              '200': '#cdb79f',
              '300': '#ba9d7b',
              '400': '#a88258',
              '500': '#956834',
              '600': '#7b562b',
              '700': '#614422',
              '800': '#473119',
              '900': '#2d1f10',
              foreground: '#fff',
              DEFAULT: '#956834'
            },
            secondary: {
              '50': '#faf9f6',
              '100': '#f3f0e8',
              '200': '#ece7db',
              '300': '#e4dfce',
              '400': '#ddd6c0',
              '500': '#d6cdb3',
              '600': '#b1a994',
              '700': '#8b8574',
              '800': '#666155',
              '900': '#403e36',
              foreground: '#000',
              DEFAULT: '#d6cdb3'
            }
          }
        }
      }
    })
  ]
} satisfies Config;

export default config;
