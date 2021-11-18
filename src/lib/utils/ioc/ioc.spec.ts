import { createInjector } from './ioc';

jest.mock('../cache');

const inject = createInjector({ foo: 'bar' });

it('creates an injector function', () => {
  expect(typeof inject).toBe('function');
});

describe('inject', () => {
  it('wraps the passed fn and calls it with the specified dependencies', () => {
    const fn = jest.fn((deps: { foo: string }) => ({ ...deps }));
    const injected = jest.fn(inject(fn));
    const result = injected();

    expect(fn).toHaveBeenCalledWith(expect.objectContaining({ foo: 'bar' }));
    expect(result).toStrictEqual({ foo: 'bar' });
  });
});
