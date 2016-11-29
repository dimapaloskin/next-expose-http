#!/usr/bin/env node

import { join, resolve, normalize } from 'path';
import { exists } from 'mz/fs';
import findNext from '../utils/find-next.js';
import parseArgs from 'minimist';

const action = process.argv[2];

if (['dev', 'start'].indexOf(action) === -1) {

  console.log('Unrecognized action. Use "next-expose-http dev" or "next-expose-http start"');
  process.exit(1);
}

const argv = parseArgs(process.argv.slice(3), {
  alias: {
    p: 'port'
  },
  default: {
    p: 3000,
    prefix: 'api',
    'api-dir': 'api'
  }
});

const dir = resolve(argv._[0] || '.')
const apiDir = resolve(argv['api-dir']);

function createServer(NextServer) {

  if (action === 'dev') {
    return new NextServer({
      dir,
      dev: true,
      hotReload: true
    });
  }

  if (action === 'start') {
    return new NextServer({ dir });
  }

  console.log('Unrecognized action. Use "next-expose-http dev" or "next-expose-http start"');
  process.exit(1);
}

async function run() {

  try {
    const nextPath = await findNext(dir);
    if (!nextPath) {
      console.error('Next.js does not found. Use "npm install next" to install next.js');
      process.exit(1);
    }

    const nextPaths = {
      server: join(nextPath, 'dist/server')
    };

    const api = require(apiDir).default;
    if (!api || typeof api !== 'function') {

      console.error('Exported api shoud be a function which returned promise');
      process.exit(1);
    }

    const normalizedPrefx = normalize(join('/', argv.prefix));

    const NextServer = require(nextPaths.server).default;
    const srv = createServer(NextServer);


    const nextEvents = [...srv.http.listeners('request')];
    srv.http.removeAllListeners('request');

    // expose http server
    await api(srv.http, normalizedPrefx);
    const apiEvents = [...srv.http.listeners('request')];
    srv.http.removeAllListeners('request');

    srv.http.on('request', function(req, res) {

      if (!req.url.startsWith(join(normalizedPrefx, '/')) && req.url !== normalizedPrefx) {
        nextEvents.forEach(event => event.call(srv.http, req, res));
        return;
      }

      apiEvents.forEach(event => event.call(srv.http, req, res));
    });

    await srv.start(argv.port);
    console.log('> Ready on http://localhost:%d', argv.port);

    if (action === 'dev') {
      if (!(await exists(join(dir, 'pages')))) {
        if (await exists(join(dir, '..', 'pages'))) {
          console.error('> No `pages` directory found. Did you mean to run `next` in the parent (`../`) directory?')
        } else {
          console.error('> Couldn\'t find a `pages` directory. Please create one under the project root')
        }
        process.exit(1)
      }
    }

  } catch (err) {

    console.error(err);
    process.exit(1);
  }

}

run();
