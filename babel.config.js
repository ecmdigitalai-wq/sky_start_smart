module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "nativewind/babel",
      "react-native-reanimated/plugin", // <--- Ye line Bahut Zaroori hai (Last mein honi chahiye)
    ],
  };
};