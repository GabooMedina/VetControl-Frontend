import { ReactNode } from 'react';

interface DataTableProps {
  headers: string[];
  data: Record<string, ReactNode>[];
  emptyMessage?: string;
  className?: string;
}

export function DataTable({ headers, data, emptyMessage = 'No hay datos disponibles', className = '' }: DataTableProps) {
  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className={`px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b ${
                    header === 'DIAGNÓSTICO' || header === 'TRATAMIENTO' ? 'min-w-[200px]' : ''
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {headers.map((header, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={`px-4 py-3 text-sm text-gray-700 ${
                        header === 'DIAGNÓSTICO' || header === 'TRATAMIENTO' 
                          ? 'whitespace-normal min-w-[200px] max-w-[300px]' 
                          : 'whitespace-nowrap'
                      }`}
                      title={typeof row[header.toLowerCase()] === 'string' ? row[header.toLowerCase()] as string : undefined}
                    >
                      {row[header.toLowerCase()] || '-'}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length} className="px-6 py-4 text-center text-sm text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}