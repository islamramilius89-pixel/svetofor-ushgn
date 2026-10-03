import { statusFromDeviation } from './well-status.js';

describe('statusFromDeviation', () => {
  it.each([
    [0, 'GREEN'],
    [9.9, 'GREEN'],
    [10, 'YELLOW'],
    [24.9, 'YELLOW'],
    [25, 'RED'],
    [100, 'RED'],
  ])('отклонение %s%% → %s', (deviation, expected) => {
    expect(statusFromDeviation(deviation)).toBe(expected);
  });
});
