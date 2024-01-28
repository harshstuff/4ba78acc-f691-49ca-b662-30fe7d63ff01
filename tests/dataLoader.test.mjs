import { formatDate } from '../src/utils/dataLoader.js';
import assert from 'assert';

describe('dataLoader Tests', () => {
  describe('formatDate function', () => {
    it('should format date correctly', () => {
      const inputDate = '01/01/2020 12:00:00'; // Example date
      const expectedOutput = '1st January 2020'; // Expected format
      assert.strictEqual(formatDate(inputDate), expectedOutput);
    });

    // You can add more test cases here with different date inputs
  });
});

