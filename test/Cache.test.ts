import { Cache } from '../src'
import fs from 'fs';

jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  unlinkSync: jest.fn(),
  readdirSync: jest.fn(),
  rmSync: jest.fn(),
  mkdir: jest.fn(),
}));

describe('Cache', () => {
  let cache: Cache;
  beforeEach(() => {
    cache = new Cache();
  });
  afterEach(() => {
    cache.clear();
  });

  test('should set and get a value', () => {
    cache.set('key', 'value');
    expect(cache.get<string>('key')).toBe('value');
  });

  test('should delete a value', () => {
    cache.set('key', 'value');
    cache.delete('key');
    expect(cache.get<string>('key')).toBe(undefined);
  });

  test('should clear the cache', () => {
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');cache.clear();
    expect(cache.get<string>('key1')).toBe(undefined);
    expect(cache.get<string>('key2')).toBe(undefined);
  });

  test('should expire a value', () => {
    cache.set('key','value',-10)
    expect(cache.get<string>('key')).toBe(undefined);
  });
});

