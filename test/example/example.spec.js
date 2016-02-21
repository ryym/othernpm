const assert = require('assert');
const path = require('path');
const onpm = require('othernpm');

function chomp(string) {
  if (string && string.replace) {
    return string.replace(/\n|\r\n/, '');
  }
}

describe('example for subdirectories', () => {
  it('run npm commands', done => {
    onpm('./sub1')('root', {
      stdio: false
    })
    .stdout.on('data', data => {
      assert.equal(
        chomp(data.toString()),
        path.join(__dirname, 'sub1', 'node_modules')
      );
      done();
    });
  });

  it('run npm-scripts', done => {
    onpm('./sub2/foo')('run greet', {
      stdio: false
    })
    .stdout.on('data', data => {
      const output = chomp(data.toString());
      if (/^>/.test(output)) {
        return;
      }
      assert.equal(output, 'Hello, everyone!');
      done();
    });
  });

  context('with config', () => {
    it('has pre-configured methods', done => {
      onpm.foo('root', {
        stdio: false
      })
      .stdout.on('data', data => {
        assert.equal(
          chomp(data.toString()),
          path.join(__dirname, 'sub2', 'foo', 'node_modules')
        );
        done();
      });
    });
  });
});
