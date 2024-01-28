import fs from "fs";
import path from "path";

export function loadJsonFile(fileName) {
  try {
    const filePath = path.join(path.resolve(), "data", fileName);
    const fileContent = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error loading file ${fileName}:`, error.message);
    return null;
  }
}


// Convert to the desired date as per requirement.
export function formatDate(dateString) {
  // First, convert the dateString into a valid Date object
  const parts = dateString.match(/(\d+)/g);
  // Assuming dateString is in the format "dd/mm/yyyy hh:mm:ss"
  const date = new Date(
    parts[2],
    parts[1] - 1,
    parts[0],
    parts[3],
    parts[4],
    parts[5]
  );

  // Function to add the appropriate ordinal suffix to the day
  function getOrdinalSuffix(day) {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  // Extracting day, month name, and year
  const day = date.getDate();
  const monthName = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  // Constructing the formatted date string
  return `${day}${getOrdinalSuffix(day)} ${monthName} ${year}`;
}
