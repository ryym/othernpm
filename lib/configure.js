/**
 * Create a configured othernpm function.
 * @param {Object} param
 * @param {Object} param.io - Used by othernpm.
 * @param {Object} param.config - A config object.
 * @param {Function} param.othernpm - A function which run npm commands.
 * @return {Function} - A configured othernpm function.
 */
export default function configure({
  io, config = {}, othernpm
}) {
  const onpm = othernpm(io);

  Object.keys(config).forEach(alias => {
    const path = config[alias];
    onpm[alias] = onpm(path);
  });

  return onpm;
}
