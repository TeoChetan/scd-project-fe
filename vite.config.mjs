import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default {
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  server: {
    proxy: {
        "https://localhost:7260/api/Order": {
        target: "https://localhost:7260",
        changeOrigin: true,
        secure: false,
      },
    },
  },
};


