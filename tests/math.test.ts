import { describe, it, expect } from 'vitest';

describe('math utilities', () => {
  it('adds two numbers', () => {
    expect(1 + 1).toBe(2);
  });

  it('multiplies two numbers', () => {
    expect(3 * 4).toBe(12);
  });
});

describe('string utilities', () => {
  it('trims whitespace', () => {
    expect('  hello  '.trim()).toBe('hello');
  });

  it('converts to uppercase', () => {
    expect('hello'.toUpperCase()).toBe('HELLO');
  });
});
