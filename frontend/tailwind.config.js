export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#102033",
        gain: "#10b981",
        loss: "#ef4444",
        accent: "#2563eb"
      },
      boxShadow: {
        glass: "0 18px 60px rgba(15, 23, 42, 0.10)"
      }
    }
  },
  plugins: []
};
