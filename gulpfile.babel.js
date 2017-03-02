import gulp from 'gulp';
import util from 'gulp-util';
import concat from 'gulp-concat';
import header from 'gulp-header';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import babel from 'babelify';
import uglify from 'gulp-uglify';
import addsrc from 'gulp-add-src';
import browserify from 'browserify';
import browserSync from 'browser-sync';
import child from 'child_process';
import hygienist from 'hygienist-middleware';
import del from 'del';
import fs from 'fs';

const parsed = JSON.parse(fs.readFileSync('./package.json'));
const siteRoot = '_site';
const jekyllLogger = (buffer) => {
  buffer.toString().split(/\n/).forEach(message => util.log(`Jekyll: ${message}`));
};

const banner = (
  `/*! justinel.com | Justin Nel (c) ${new Date().getFullYear()} */\n`
);

const paths = {
  scripts: '_scripts/app.js',
  libs: [
    '../node_modules/holderjs/holder.js',
  ],
  dist: 'js/',
};

browserSync.create();

gulp.task('clean', fn => del([paths.dist, siteRoot], fn));

gulp.task('scripts', ['clean'], () => browserify(paths.scripts, { debug: true })
    .transform(babel)
    .bundle()
    .on('error', (err) => { console.error(err); this.emit('end'); })
    .pipe(source('build.js'))
    .pipe(buffer())
    .pipe(addsrc.prepend(paths.libs))
    .pipe(concat('bundle.min.js'))
    .pipe(uglify())
    .pipe(header(banner, {
      parsed,
    }))
    .pipe(gulp.dest(paths.dist)),
);

gulp.task('jekyll', () => {
  const jekyll = child.spawn('jekyll', ['serve', '--watch', '--incremental', '--drafts']);
  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);
});

gulp.task('serve', () => {
  browserSync.init({
    files: [`${siteRoot}/**`],
    port: 4000,
    server: {
      baseDir: siteRoot,
      middleware: hygienist(siteRoot),
    },
  });
});

gulp.task('watch', () => {
  gulp.watch(paths.scripts, ['scripts']);
});

gulp.task('default', ['scripts', 'serve', 'jekyll', 'watch']);
