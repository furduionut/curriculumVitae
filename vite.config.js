import { defineConfig } from "vite";

export default defineConfig({
<<<<<<< HEAD
    base: process.env.NODE_ENV === 'production' ? "/curriculumVitae/": "",
    server: {
      port: 9010,
      strictPort: true
    },
    plugins: [{
    name: 'reload',
    configureServer(server) {
      const {
        ws,
        watcher
      } = server;
      watcher.on('change', file => {
        if (file.endsWith('.html')) {
          ws.send({
            type: 'full-reload',
          });
        }
      });
    },
  }, ]
=======
    base: "/curriculumVitae/",
>>>>>>> 05fb857db57842b6326ab0af61d48ab7e73d1baf
})