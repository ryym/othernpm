/**
 * Create configured othernpm function.
 * @param {Object} param - Used by othernpm.
 * @param {Object} param.io - Used by othernpm.
 * @param {Object} param.config - A config object.
 * @param {Function} param.othernpm - Run npm commands.
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
