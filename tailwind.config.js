const colors = require("tailwindcss/colors");
const plugin = require("tailwindcss/plugin");

// Plugin for capitalizing only first letter
const capitalizeFirst = plugin(function ({ addUtilities }) {
  const newUtilities = {
    ".capitalize-first:first-letter": {
      textTransform: "uppercase",
    },
  };
  addUtilities(newUtilities, ["responsive", "hover"]);
});

module.exports = {
  purge: ["./frontend/src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      zIndex: {
        "-1": "-1",
      },
    },
    colors: {
      "gr-start": "#fd746c",
      "gr-end": "#ff9068",
      "formgr-start": "#ff7e5f",
      "formgr-end": "#feb47b",
      "register-start": "#74ebd5",
      "register-end": "#acb6e5",
      transparent: "transparent",
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      indigo: colors.indigo,
      red: colors.rose,
      yellow: colors.amber,
      emerald: colors.emerald,
      green: colors.green,
      purple: colors.violet,
      blue: colors.blue,
      orange: colors.orange,
      teal: colors.teal,
    },
  },
  variants: {
    extend: {},
  },
  plugins: [capitalizeFirst],
};
