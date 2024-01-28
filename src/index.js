import inquirer from "inquirer";
import {
  generateDiagnosticReport,
  generateProgressReport,
  generateFeedbackReport,
} from "./services/assessmentService.js";
import { loadJsonFile } from "./utils/dataLoader.js";

// Returns the list of available students.
function getAvailableStudents() {
  const students = loadJsonFile("students.json");
  return students.map((student) => student.id);
}

function getReportDetails() {
  const questions = [
    { type: "input", name: "studentId", message: "Student ID:" },
    {
      type: "list",
      name: "reportType",
      message: "Report to generate",
      choices: ["Diagnostic", "Progress", "Feedback"],
    },
  ];

  return inquirer.prompt(questions);
}

async function main() {
  const availableStudentIds = getAvailableStudents();
  const answers = await getReportDetails();
  console.log("\n``````````````````````````````");

  if (!availableStudentIds.includes(answers.studentId)) {
    console.log(
      `Sorry! We only have reports available for: ${availableStudentIds.join(
        ", "
      )}`
    );
  } else {
    if (answers.reportType === "Diagnostic") {
      const report = generateDiagnosticReport(answers.studentId);
      console.log(`\n${report}`);
    } else if (answers.reportType === "Progress") {
      const report = generateProgressReport(answers.studentId);
      console.log(`\n${report}`);
    } else if (answers.reportType === "Feedback") {
      const report = generateFeedbackReport(answers.studentId);
      console.log(`\n${report}`);
    }
  }

  console.log("\n``````````````````````````````\n");

  // Call main again to create a loop
  main();
}

main();
