import type { Plugin } from 'vite';
import { resolve } from 'path';
import { readFileSync, existsSync } from 'fs';
import { extname } from 'path';

export function serveStaticHtml(): Plugin {
  return {
    name: 'serve-static-html',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Check if the request is for the mirror
        if (req.url?.startsWith('/stpauls_site_mirror/')) {
          const filePath = resolve('public', req.url.slice(1));
          
          // Check if file exists
          if (existsSync(filePath)) {
            const extension = extname(filePath);
            let contentType = 'text/html';
            
            // Set appropriate content type based on file extension
            switch (extension) {
              case '.css':
                contentType = 'text/css';
                break;
              case '.js':
                contentType = 'application/javascript';
                break;
              case '.json':
                contentType = 'application/json';
                break;
              case '.png':
                contentType = 'image/png';
                break;
              case '.jpg':
              case '.jpeg':
                contentType = 'image/jpeg';
                break;
              case '.gif':
                contentType = 'image/gif';
                break;
              case '.svg':
                contentType = 'image/svg+xml';
                break;
              case '.ico':
                contentType = 'image/x-icon';
                break;
              case '.woff':
                contentType = 'font/woff';
                break;
              case '.woff2':
                contentType = 'font/woff2';
                break;
              case '.ttf':
                contentType = 'font/ttf';
                break;
              case '.otf':
                contentType = 'font/otf';
                break;
              default:
                contentType = 'text/html';
            }
            
            // Read file based on type
            const isTextFile = ['.html', '.css', '.js', '.json', '.svg'].includes(extension);
            const content = readFileSync(filePath, isTextFile ? 'utf-8' : null);
            
            res.setHeader('Content-Type', contentType);
            res.setHeader('X-Frame-Options', 'SAMEORIGIN');
            res.end(content);
            return;
          }
        }
        
        next();
      });
    }
  };
}