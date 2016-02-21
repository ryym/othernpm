import gulp from 'gulp';
import gutil from 'gulp-util';
import babel from 'gulp-babel';
import del from 'del';
import glob from 'glob';
import Mocha from 'mocha';
import eslint from 'eslint';
import onpm from './lib';

const GLOB = {
  bin: './bin/**/*',
  lib: './lib/**/*.js',
  build: './build/**/*.js',
  spec: './test/lib/**/*.spec.js',
  example: './test/example/**/*.spec.js'
};

gulp.task('clean', () => {
  return del([GLOB.build]);
});

gulp.task('build', ['clean'], () => {
  return gulp.src(GLOB.lib)
    .pipe(babel())
    .pipe(gulp.dest('build/'));
});

gulp.task('watch', ['clean'], () => {
  runAndWatch(GLOB.lib, GLOB.lib, path => {
    gutil.log(gutil.colors.cyan('babel:'), path);
    gulp.src(path)
      .pipe(babel())
      .on('error', e => console.log(e.stack))
      .pipe(gulp.dest('build/'));
  });
});

gulp.task('install:example', ['build'], done => {
  onpm.example('install').on('exit', done);
});

gulp.task('test:prepare', () => {
  require('babel-core/register');
});

gulp.task('test', ['test:prepare'], done => {
  runTests(GLOB.spec).then(err => {
    done(err ? new Error('Mocha tests failed.') : undefined);
  }, done);
});

gulp.task('test:watch', ['test:prepare'], () => {
  function test() {
    runTests(GLOB.spec, { reporter: 'dot' })
      .catch(e => console.log(e.stack));
  }
  const sourceFiles = glob.sync(GLOB.lib, { realpath: true });
  gulp.watch(GLOB.lib, () => {
    sourceFiles.forEach(f => clearModuleCache(f));
    test();
  });
  runAndWatch(GLOB.spec, null, () => test());
});

gulp.task('test:example', ['install:example'], done => {
  onpm.example('run test').on('exit', done);
});

gulp.task('lint:lib', () => {
  lintFiles([GLOB.lib], true);
});

gulp.task('lint:test', () => {
  lintFiles([GLOB.spec, GLOB.example], true);
});

gulp.task('lint:bin', () => {
  lintFiles([GLOB.bin], true);
});

gulp.task('lint:gulp', () => {
  lintFiles(['./gulpfile.babel.js'], true, {
    rules: { 'no-console': 0 }
  });
});

gulp.task('lint:watch', () => {
  const linter = new eslint.CLIEngine();
  function lintAndReport(path) {
    const report = linter.executeOnFiles([path]);
    const formatter = linter.getFormatter();
    console.log(formatter(report.results));
  }
  runAndWatch(GLOB.lib, GLOB.lib, lintAndReport);
  runAndWatch(GLOB.spec, GLOB.spec, lintAndReport);
});

gulp.task('lint', [
  'lint:lib',
  'lint:test',
  'lint:bin'
]);

gulp.task('lint:all', [
  'lint',
  'lint:gulp'
]);

gulp.task('check', [
  'lint:all',
  'test',
  'test:example'
]);

gulp.task('default', [
  'lint:watch',
  'test:watch'
]);


/**
 * Clear module cache.
 */
function clearModuleCache(path) {
  delete require.cache[path];
}

/**
 * Run tests in the specified file pattern using Mocha
 */
function runTests(pattern, options) {
  const mocha = new Mocha(options);
  const files = glob.sync(pattern, { realpath: true });
  files.forEach(file => {
    clearModuleCache(file);  // For watching
    mocha.addFile(file);
  });
  return new Promise((resolve, reject) => {
    try {
      mocha.run(resolve);
    } catch(e) {
      reject(e);
    }
  });
}

/**
 * Run a given task. And re-run it whenever the specified files change.
 */
function runAndWatch(watchPattern, initialValue, task) {
  gulp.watch(watchPattern, event => {
    task(event.path, event);
  });
  return task(initialValue);
}

/**
 * Lint the specified files using eslint.
 */
function lintFiles(pattern, strict, configs) {
  const linter = new eslint.CLIEngine(configs);
  const report = linter.executeOnFiles(pattern);
  const formatter = linter.getFormatter();
  console.log(formatter(report.results));
  if (0 < report.errorCount || (strict && 0 < report.warningCount)) {
    throw new Error('eslint reports some problems.');
  }
}
