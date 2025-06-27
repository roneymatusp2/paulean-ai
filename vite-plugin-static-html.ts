import type { Plugin } from 'vite';
import path from 'path';
import fs from 'fs';

export function staticHtmlPlugin(): Plugin {
  return {
    name: 'static-html',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Check if the request is for an HTML file in the stpauls_site_mirror directory
        if (req.url?.startsWith('/stpauls_site_mirror/') && req.url.endsWith('.html')) {
          const filePath = path.join(server.config.publicDir, req.url);
          
          // Check if file exists
          if (fs.existsSync(filePath)) {
            res.setHeader('Content-Type', 'text/html');
            const content = fs.readFileSync(filePath, 'utf-8');
            res.end(content);
            return;
          }
        }
        
        next();
      });
    }
  };
}