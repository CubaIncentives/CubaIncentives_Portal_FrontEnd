export default {
  plugins: {
    'postcss-import': {},
    autoprefixer: {},
    'tailwindcss/nesting': 'postcss-nesting',
    tailwindcss: {},
    'postcss-preset-env': {
      features: { 'nesting-rules': true },
    },
  },
};
