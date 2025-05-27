// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: ['./App.{js,ts,tsx}', './components/**/*.{js,ts,tsx}','./screens/**/*.{js,ts,tsx}'],

//   presets: [require('nativewind/preset')],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// };
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,ts,tsx}',
    './screens/**/*.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
    './navigation/**/*.{js,ts,tsx}',
    './context/**/*.{js,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
