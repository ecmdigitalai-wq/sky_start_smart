// tailwind.config.js
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}", 
    "./screens/**/*.{js,jsx,ts,tsx}",  // Agar aapki files screens folder mein hain
    "./components/**/*.{js,jsx,ts,tsx}", // Agar components folder hai
    "./src/**/*.{js,jsx,ts,tsx}"  // Agar src folder use kar rahe ho
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}