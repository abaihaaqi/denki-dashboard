export async function parseCSV(file: File): Promise<string[][]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const rows = text
          .split("\n")
          .map((row) =>
            row
              .split(",")
              .map((cell) => cell.trim().replace(/^["']|["']$/g, ""))
          );
        resolve(rows);
      } catch (error) {
        reject(new Error("Failed to parse CSV file"));
        console.log(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsText(file);
  });
}

export function validateCSVStructure(rows: string[][]): {
  isValid: boolean;
  error?: string;
} {
  if (rows.length < 2) {
    return {
      isValid: false,
      error: "CSV file must contain at least a header row and one data row",
    };
  }

  const headerLength = rows[0].length;
  const hasInvalidRows = rows.some((row) => row.length !== headerLength);

  if (hasInvalidRows) {
    return {
      isValid: false,
      error: "All rows must have the same number of columns",
    };
  }

  return { isValid: true };
}
