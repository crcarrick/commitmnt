import { ChangeDirectory } from './cd';

const baseDir = '~/';
const projectsDir = '~/Projects';

let cd: ChangeDirectory;

function mockProcess() {
  let current: string;

  jest.spyOn(process, 'chdir').mockImplementation((dir) => (current = dir));
  jest.spyOn(process, 'cwd').mockImplementation(() => current);
}

beforeEach(() => {
  mockProcess();

  cd = new ChangeDirectory(baseDir);
});

afterEach(() => {
  jest.resetAllMocks();
});

it('changes to the base directory when constructed', () => {
  expect(process.chdir).toHaveBeenCalledWith(baseDir);
  expect(cd.current).toBe(baseDir);
});

it('changes to a provided directory', () => {
  cd.go(projectsDir);

  expect(process.chdir).toHaveBeenCalledWith(projectsDir);
  expect(cd.current).toBe(projectsDir);
});

it('saves the previous directory when changing directories', () => {
  cd.go(projectsDir);

  expect(cd.last).toBe(baseDir);
});

it('goes back to the previous directory', () => {
  cd.go(projectsDir);
  cd.back();

  expect(process.chdir).toHaveBeenCalledWith(baseDir);
  expect(cd.current).toBe(baseDir);
});

it('ensures the current directory is the provided directory', () => {
  expect(cd.ensure(baseDir)).toBe(true);
});

it('throws an error when the current directory is not the provided directory', () => {
  expect(() => cd.ensure(projectsDir)).toThrowError(/Unexpected directory/);
});
