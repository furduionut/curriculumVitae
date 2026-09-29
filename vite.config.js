import { defineConfig } from "vite";

export default defineConfig({
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
})