export class ChangeDirectory {
  current: string;
  last: string;

  /**
   * @param base the directory to start at
   * @constructor
   */
  constructor(baseDir?: string) {
    const dir = baseDir ?? process.cwd();

    this.go(dir);
  }

  /**
   * Changes back to the last directory
   */
  back() {
    const last = this.last;

    this.go(last);
  }

  /**
   * Changes to a directory
   *
   * @param dir the directory to go to
   */
  go(dir: string) {
    this.last = process.cwd();
    process.chdir(dir);
    this.current = process.cwd();
    this.ensure(dir);
  }

  /**
   * Ensures the process is in the specified directory
   *
   * @param dir the directory to test
   * @returns true if the directory matches
   * @throws error if the directory does not match
   */
  ensure(dir: string) {
    if (process.cwd() !== dir)
      throw new Error(`Unexpected directory: ${process.cwd()} - Expected: ${dir}`);

    return true;
  }
}
