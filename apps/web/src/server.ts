import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse } from '@angular/ssr/node';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const angularApp = new AngularNodeAppEngine();

  server.get(
    '/sitemap.xml',
    (_req, res) => {
      res.setHeader('Content-Type', 'application/xml');
      res.sendFile(join(browserDistFolder, 'sitemap.xml'));
    },
  );

  server.get('*.*', express.static(browserDistFolder, { maxAge: '1y' }));

  server.get(
    '*',
    createNodeRequestHandler(async (req, res, next) => {
      const response = await angularApp.handle(req);
      if (response) {
        await writeResponseToNodeResponse(response, res);
      } else {
        next();
      }
    }),
  );

  return server;
}

if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] ?? 4000;
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}
