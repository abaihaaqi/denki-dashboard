interface CSVPreviewProps {
  headers: string[];
  rows: string[][];
  maxRows?: number;
}

export default function CSVPreview({
  headers,
  rows,
  maxRows = 5,
}: CSVPreviewProps) {
  const previewRows = rows.slice(0, maxRows);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {previewRows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length > maxRows && (
        <p className="text-sm text-gray-500 mt-2 text-center">
          Showing {maxRows} of {rows.length} rows
        </p>
      )}
    </div>
  );
}
