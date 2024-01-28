import { loadJsonFile, formatDate } from '../utils/dataLoader.js';

// Date Parsing for calculating latest assemnent for given DS.
function parseCustomDateForAssementSorting(dateString) {
    const parts = dateString.split(/\/|\s|:/);
    return new Date(parts[2], parts[1] - 1, parts[0], parts[3], parts[4], parts[5]);
}

// Get latest completed assement of any student by student ID.
export function findLatestCompletedAssessment(studentId) {
    const responses = loadJsonFile('student-responses.json');
    const completedAssessments = responses.filter(response => response.student.id === studentId && response.completed);
    completedAssessments.sort((a, b) => parseCustomDateForAssementSorting(b.completed) - parseCustomDateForAssementSorting(a.completed));
    // console.log(completedAssessments);
    return completedAssessments[0];
}

// Diagnostic Report Generator.
export function generateDiagnosticReport(studentId) {
    const latestAssessment = findLatestCompletedAssessment(studentId);
    if (!latestAssessment) {
        return 'No completed assessments found for this student.';
    }

    const questions = loadJsonFile('questions.json');
    const assessments = loadJsonFile('assessments.json').find(a => a.id === latestAssessment.assessmentId);
    const student = loadJsonFile('students.json').find(s => s.id === studentId);

    let correctAnswers = 0;
    const strandResults = {};

    latestAssessment.responses.forEach(response => {
        const question = questions.find(q => q.id === response.questionId);
        const correctOption = question.config.key;

        if (response.response === correctOption) {
            correctAnswers += 1;
        }

        if (!strandResults[question.strand]) {
            strandResults[question.strand] = { correct: 0, total: 0 };
        }

        strandResults[question.strand].total += 1;
        if (response.response === correctOption) {
            strandResults[question.strand].correct += 1;
        }
    });

    let report = `${student.firstName} ${student.lastName} recently completed ${assessments.name} assessment on ${formatDate(latestAssessment.completed)}\n`;
    report += `He got ${correctAnswers} questions right out of ${latestAssessment.responses.length}. Details by strand given below:\n\n`;

    for (const strand in strandResults) {
        report += `${strand}: ${strandResults[strand].correct} out of ${strandResults[strand].total} correct\n`;
    }

    return report;
}


// Progress Report Generator.
export function generateProgressReport(studentId) {
    const responses = loadJsonFile('student-responses.json');
    const questions = loadJsonFile('questions.json');
    const students = loadJsonFile('students.json');
    const assessments = loadJsonFile('assessments.json');

    const studentAssessments = responses.filter(response => response.student.id === studentId && response.completed);

    if (studentAssessments.length === 0) {
        return 'No completed assessments found for this student.';
    }

    const student = students.find(s => s.id === studentId);
    const studentName = `${student.firstName} ${student.lastName}`;

    // Sort assessments by date
    studentAssessments.sort((a, b) => new Date(a.completed) - new Date(b.completed));

    let report = `${studentName} has completed ${assessments[0].name} assessment ${studentAssessments.length} times in total. Date and raw score given below:\n\n`;

    studentAssessments.forEach(assessment => {
        const totalQuestions = assessment.responses.length;
        const correctAnswers = assessment.responses.filter(response => {
            const question = questions.find(q => q.id === response.questionId);
            return response.response === question.config.key;
        }).length;

        report += `Date: ${formatDate(assessment.completed)}, Raw Score: ${correctAnswers} out of ${totalQuestions}\n`;
    });

    const firstAssessmentScore = studentAssessments[0].responses.filter(response => {
        const question = questions.find(q => q.id === response.questionId);
        return response.response === question.config.key;
    }).length;

    const latestAssessmentScore = studentAssessments[studentAssessments.length - 1].responses.filter(response => {
        const question = questions.find(q => q.id === response.questionId);
        return response.response === question.config.key;
    }).length;

    const scoreDifference = latestAssessmentScore - firstAssessmentScore;
    // const scoreDifference = -2;

    const scoreDifferenceText = scoreDifference > 0 ? 
        `${scoreDifference} more correct in the recent completed assessment than the oldest` :
        scoreDifference < 0 ? 
        `${Math.abs(scoreDifference)} less correct in the recent completed assessment than the oldest` :
        'the same number of correct answers in the recent completed assessment as in the oldest';
    
    report += `\n${studentName} got ${scoreDifferenceText}`;

    return report;
}

// Feedback Report Generator.
export function generateFeedbackReport(studentId) {
    const latestAssessment = findLatestCompletedAssessment(studentId);
    console.log();
    if (!latestAssessment) {
        return 'No completed assessments found for this student.';
    }

    const questions = loadJsonFile('questions.json');
    const assessments = loadJsonFile('assessments.json').find(a => a.id === latestAssessment.assessmentId);
    const student = loadJsonFile('students.json').find(s => s.id === studentId);

    let correctCount = 0;
    latestAssessment.responses.forEach(response => {
        const question = questions.find(q => q.id === response.questionId);
        if (response.response === question.config.key) {
            correctCount++;
        }
    });

    let report = `${student.firstName} ${student.lastName} recently completed ${assessments.name} assessment on ${formatDate(latestAssessment.completed)}\n`;
    report += `He got ${correctCount} questions right out of ${latestAssessment.responses.length}. Feedback for wrong answers given below:\n\n`;

    latestAssessment.responses.forEach(response => {
        const question = questions.find(q => q.id === response.questionId);
        const correctOption = question.config.key;
        const correctAnswer = question.config.options.find(option => option.id === correctOption);
        const studentAnswer = question.config.options.find(option => option.id === response.response);

        if (response.response !== correctOption) {
            report += `Question: ${question.stem}\n`;
            report += `Your answer: ${studentAnswer.label} with value ${studentAnswer.value}\n`;
            report += `Right answer: ${correctAnswer.label} with value ${correctAnswer.value}\n`;
            report += `Hint: ${question.config.hint}\n\n`;
        }
    });

    return report;
}
