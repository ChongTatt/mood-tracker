import adapter from "@sveltejs/adapter-static";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    target: "#svelte",
    adapter: adapter({ fallback: "index.html" }),
    vite: {
      ssr: {
        external: [
          "whatwg-url",
          "node-fetch",
          "@firebase/auth",
          "firebase"
        ],
      },
    },
  },
};

export default config;