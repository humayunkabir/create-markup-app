import ansi from 'ansi';
import fs from 'fs';
import { dest, src } from 'gulp';
import gulpData from 'gulp-data';
import gulpJsbeautifier from 'gulp-jsbeautifier';
import gulpPug from 'gulp-pug';
import path from 'path';
import pretty from 'pretty';
import pug from 'pug';
import url from 'url';
import { v4 as uuid } from 'uuid';

import { baseDir, isProd, name, paths, version } from './utils.mjs';

const cursor = ansi(process.stdout);

const options = {
  pretty: !isProd,
};

const locals = {
  name: (name.charAt(0).toUpperCase() + name.slice(1)).replace(/-/g, ' '),
  version,
  jsPretty: pretty,
  ENV: process.env.MODE || 'DEVELOPMENT',
  uuid,
  flatSitemap(siteMap) {
    function flatInnter(pages) {
      let flat = [];

      pages.forEach((page) => {
        if (!('pages' in page)) {
          flat = [...flat, page];
        } else {
          flat = [...flat, ...flatInnter(page.pages)];
        }
      });

      return flat;
    }

    const newPaths = {};

    flatInnter(siteMap.flatMap((item) => item.pages))
      .filter((item) => item.name !== '#!')
      .forEach((item) => {
        newPaths[item.pathName] = `${item.path}.html`;
      });

    return newPaths;
  },
};

/* -------------------------------------------------------------------------- */
/*                         Pug compiling | middleware                         */
/* -------------------------------------------------------------------------- */
export async function compilePug(req, res, next) {
  const parsed = url.parse(req.url);

  const mkdir = (dir) => {
    if (!fs.existsSync(`${baseDir}${dir}`)) {
      cursor.hex('#ff0000').bold();
      console.log(`404: ${baseDir}${dir}`);
      cursor.reset();
      cursor.hex('#00ff00').bold();
      console.log(`creating: ${baseDir}${dir}`);
      cursor.reset();
      fs.mkdirSync(`${baseDir}${dir}`);
    }
  };
  mkdir(path.parse(parsed.pathname).dir);

  if (parsed.pathname.match(/\.html$/) || parsed.pathname === '/') {
    let file = 'index';

    if (parsed.pathname !== '/') {
      file = parsed.pathname.substring(1, parsed.pathname.length - 5);
    }

    const filePath = `${paths.pug.base}/${file}.pug`;

    let html = pug.renderFile(path.resolve(filePath), {
      ...options,
      ...locals,
    });
    html = pretty(html, { ocd: false });

    html = html.replace(/\s*(<!-- end of)/g, '$1');

    fs.writeFileSync(`${baseDir}/${file}.html`, html);
  }

  next();
}

export default async function pugTask() {
  src(paths.pug.src.pages, {
    cwd: paths.pug.base,
    // This causes the components and docs subfolders to be mirrored in dist folder
    base: paths.pug.base,
  })
    .pipe(
      gulpData((file) => ({
        ...file,
        ...locals,
      }))
    )
    .pipe(gulpPug(options))
    .pipe(
      gulpJsbeautifier({
        unformatted: ['code', 'pre', 'em', 'strong', 'span'],
        indent_inner_html: true,
        indent_char: ' ',
        indent_size: 2,
        sep: '\n',
      })
    )
    .pipe(
      gulpJsbeautifier.reporter({
        verbosity: gulpJsbeautifier.report.ALL,
      })
    )
    .pipe(dest(`${baseDir}/${paths.pug.dest}`));
}
