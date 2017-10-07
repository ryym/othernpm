/**
 * Create a function which run npm commands by the specified methods.
 * @param {Object} io
 * @param {Function} io.spawn - A function which spawns a new process.
 * @param {Function} io.isDirectory - A function which determines
 *     whether the given path is a directory or not.
 * @param {Function} io.onExit - A callback executed when the process exits.
 * @return {Function} - A function which actually run commands.
 */
export default function othernpm({ spawn, isDirectory, onExit }) {
  /**
   * Run npm commands in the specified directory.
   * (Curried function).
   * @param {string} path - A path to a directory where npm commands run.
   * @param {string|Array} command - The npm command(s) like 'run test'.
   * @param {Object} spawnConfig - A config object passed to 'spawn' function.
   * @return {*} - An object returned by 'io.spawn'.
   */
  return path => (command = '', spawnConfig) => {
    if (! isDirectory(path)) {
      throw new Error(`The directory '${path}' is not found`);
    }

    const commands = parseCommand(command);
    const config = Object.assign({
      cwd: path,
      stdio: 'inherit'
    }, spawnConfig);

    const proc = spawn('npm', commands, config);
    if (proc && 'on' in proc) {
      proc.on('exit', onExit);
    }
    return proc;
  };
}

function parseCommand(command) {
  if (Array.isArray(command)) {
    return command;
  }
  return command.trim().length === 0
    ? []
    : command.trim().split(/\s+/);
}
