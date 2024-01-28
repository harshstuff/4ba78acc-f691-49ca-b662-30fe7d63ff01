import { formatDate } from "../src/utils/dataLoader.js";
import { findLatestCompletedAssessment } from "../src/services/assessmentService.js";
import assert from "assert";

/**
 * This test suite is for the dataLoader module.
 * It checks the functionality of data formatting utilities.
 */
describe("dataLoader Tests", () => {
  describe("formatDate function", () => {
    it("should format date correctly", () => {
      const inputDate = "01/01/2020 12:00:00";
      const expectedOutput = "1st January 2020";
      assert.strictEqual(formatDate(inputDate), expectedOutput);
    });
  });
});

/**
 * This test suite is for the calculating the latest assement.
 * It checks the for the final completion date of the assesment for a certain student by studentId.
 * Its using 'data/test-student-responses.json. as the test source.'
 */
const mockFile = "test-student-responses.json";
describe("dataLoader Tests", () => {
  describe("findLatestCompletedAssessment function", () => {
    it("should return the latest completed assessment for a given student ID", () => {
      const studentId = "student29";

      const result = findLatestCompletedAssessment(studentId, mockFile);

      const finalDate = result.completed;

      const expected = "16/12/2023 10:36:00";
      console.log(finalDate);

      assert.deepStrictEqual(finalDate, expected);
    });
  });
});
