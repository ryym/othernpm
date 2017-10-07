import assert from 'power-assert';
import sinon from 'sinon';
import configure from '../../lib/configure';

/** @test {configure} */
describe('configure()', () => {
  let othernpm, runnpm;

  function configureWith(config) {
    return configure({
      config,
      io: {},
      othernpm: () => othernpm
    });
  }

  beforeEach(() => {
    runnpm = sinon.spy();
    othernpm = sinon.stub().returns(runnpm);
  });

  it('adds methods to `onpm` corresponding to configs', () => {
    const config = {
      examples: './examples',
      site: './site'
    };
    const onpm = configureWith(config);

    assert(
      typeof onpm.examples === 'function' &&
      typeof onpm.site === 'function'
    );
  });

  describe('configured methods', () => {
    it('run npm commands in the configured directory', () => {
      const onpm = configureWith({ site: './site' });
      onpm.site('command');
      assert.deepEqual(
        [othernpm.args[0], runnpm.args[0]],
        [['./site'], ['command']]
      );
    });
  });

});
