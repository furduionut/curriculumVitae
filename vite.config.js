import { defineConfig } from "vite";

export default defineConfig({
    base: "/curriculumVitae/",
    server: {
      port: 8010,
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
})