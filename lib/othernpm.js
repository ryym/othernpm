/**
 * Create a function which run npm commands by the specified methods.
 * @param {Object} io
 * @param {Function} io.spawn - A function to spawn a new process.
 * @param {Function} io.isDirectory - A function to determine
 *     whether the given path is a directory or not.
 * @return {Function} - A function which actually run commands.
 */
export default function othernpm({ spawn, isDirectory }) {
  /**
   * Run npm commands in the specified directory
   * (Curried function).
   * @param {string} path - A path to directory where npm commands run.
   * @param {string} command - A npm command string like 'run test'.
   * @param {Object} spawnConfig - A config object passed to 'spawn' function.
   * @return {*} - An object returned by 'io.spawn'.
   */
  return path => (command = '', spawnConfig) => {
    if (! isDirectory(path)) {
      throw new Error(`The directory '${path}' is not found`);
    }

    const commands = command.trim().length === 0
      ? []
      : command.trim().split(/\s+/);
    const config = Object.assign({
      cwd: path,
      stdio: 'inherit'
    }, spawnConfig);

    return spawn('npm', commands, config);
  };
}
