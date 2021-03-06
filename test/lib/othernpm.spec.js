import assert from 'power-assert';
import forEach from 'mocha-each';
import sinon from 'sinon';
import othernpm from '../../lib/othernpm';

/** @test {othernpm} */
describe('othernpm()', () => {
  let spawn, onpm;

  function prepareTest(io) {
    spawn = io.spawn;
    onpm = othernpm(io);
  }

  context('with a valid path', () => {
    beforeEach(() => {
      prepareTest({
        spawn: sinon.spy(),
        isDirectory: () => true
      });
    });

    context('by string', () => {
      forEach([
        [
          'install',
          ['install']
        ],
        [
          '--version',
          ['--version']
        ],
        [
          'run build -- --foo=bar',
          ['run', 'build', '--', '--foo=bar']
        ],
        [
          ' space around ',
          ['space', 'around']
        ]
      ])
        .it('parse and run "%s" correctly', (command, expected) => {
          onpm('')(command);
          assert.deepEqual(
            spawn.args[0].splice(0, 2),
            ['npm', expected]
          );
        });
    });

    context('by array', () => {
      forEach([
        [
          ['install'],
          ['install']
        ],
        [
          ['run', 'build', '--', '--foo=bar'],
          ['run', 'build', '--', '--foo=bar']
        ]
      ])
        .it('parse and run %j correctly', (command, expected) => {
          onpm('')(command);
          assert.deepEqual(
            spawn.args[0].splice(0, 2),
            ['npm', expected]
          );
        });
    });

    it('specifies working directory as a given path', () => {
      onpm('./foo/bar')('command');
      assert.equal(
        spawn.args[0][2].cwd,
        './foo/bar'
      );
    });

    it('returns a process object created by `spawn` function', () => {
      const processObj = {};
      prepareTest({
        spawn: () => processObj,
        isDirectory: () => true
      });

      const actual = onpm('foo')('command');
      assert.equal(actual, processObj);
    });

    it('accepts a config object for the spawn function', () => {
      const config = {
        env: { 'FOO': 'bar' },
        stdio: 'ignore'
      };
      onpm('./foo')('install', config);

      const expectedConfig = Object.assign({
        cwd: './foo'
      }, config);
      assert.deepEqual(spawn.args[0][2], expectedConfig);
    });

    context('and without command', () => {
      forEach([
        [[]],
        [['']],
        [[' ']]
      ])
        .it('works fine for %j', emptyCommand => {
          onpm('foo')(...emptyCommand);
          assert.deepEqual(
            spawn.args[0].splice(0, 2),
            ['npm', []]
          );
        });
    });
  });

  context('with an invalid path', () => {
    beforeEach(() => {
      prepareTest({
        spawn: sinon.spy(),
        isDirectory: () => false
      });
    });

    it('throws an error', () => {
      assert.throws(
        () => onpm('nowhere')('command'),
        /not found/
      );
    });

    context('until a command is given', () => {
      it('does nothing', () => {
        assert.doesNotThrow(() => onpm('some'));
      });
    });
  });

  context('with exit event handling', () => {
    let spawnOn = sinon.spy();
    let onExit = () => {};

    beforeEach(() => {
      prepareTest({
        spawn: () => ({ on: spawnOn }),
        isDirectory: () => true,
        onExit
      });
    });

    it('accepts exit event handler', () => {
      onpm('')('command');
      assert.deepEqual(spawnOn.args, [['exit', onExit]]);
    });
  });

});
