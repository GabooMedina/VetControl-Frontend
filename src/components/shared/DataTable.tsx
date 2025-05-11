import React, { useState, useEffect } from 'react';
import { DataTableProps, TableField } from '../../Interfaces/TypesData';
import Search from './Search';
import Paginator from './Paginator';
import EditButton from './EditButton';
import DeleteButton from './DeleteButton';

const DataTable: React.FC<DataTableProps> = ({
  fields,
  initialData,
  onEdit,
  onDelete,
  actions = [],
  className = '',
}) => {
  const [data, setData] = useState<Record<string, any>[]>(initialData);
  const [filteredData, setFilteredData] = useState<Record<string, any>[]>(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 5;

  useEffect(() => {
    setData(initialData);
    setFilteredData(initialData);
  }, [initialData]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = data.filter((item) =>
        fields.some((field) => {
          const fieldValue = getFieldValue(item, field);
          return fieldValue?.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
    setCurrentPage(1);
  }, [searchTerm, data, fields]);

  const getFieldValue = (item: Record<string, any>, field: TableField): any => {
    return field.name.split('.').reduce((value, key) => value?.[key], item);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className={className}>
      <Search
        value={searchTerm}
        onChange={(value) => setSearchTerm(value)}
        onClear={() => setSearchTerm('')}
      />

      {/* Tabla */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200 border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {fields.map((field) => (
                <th
                  key={field.name}
                  className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap"
                >
                  {field.label}
                </th>
              ))}
              {(onEdit || onDelete || actions.length > 0) && (
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {fields.map((field) => {
                    const value = getFieldValue(item, field);
                    return (
                      <td
                        key={`${field.name}-${index}`}
                        className="px-4 py-3 text-left text-sm text-black whitespace-normal border-b border-gray-200"
                        style={{ wordWrap: 'break-word' }}
                      >
                        {field.render ? field.render(value) : field.format ? field.format(value) : value || '-'}
                      </td>
                    );
                  })}
                  {(onEdit || onDelete || actions.length > 0) && (
                    <td className="px-4 py-3 text-left text-sm text-black whitespace-nowrap border-b border-gray-200">
                      <div className="flex gap-2">
                        {onEdit && <EditButton onClick={() => onEdit(item)} />}
                        {onDelete && (
                          <DeleteButton
                            onConfirm={() => {
                              if (onDelete) {
                                onDelete(item[fields[0].name]);
                                const updatedData = data.filter(d => d[fields[0].name] !== item[fields[0].name]);
                                setData(updatedData);
                                setFilteredData(updatedData);
                              }
                            }}
                          />
                        )}
                        {actions.map((action, i) => (
                          <button
                            key={i}
                            onClick={() => action.onClick(item)}
                            title={action.tooltip}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {action.icon}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={fields.length + 1} className="py-4 text-center text-gray-500">
                  No se encontraron resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {filteredData.length > itemsPerPage && (
        <Paginator
          currentPage={currentPage}
          totalPages={Math.ceil(filteredData.length / itemsPerPage)}
          onPageChange={paginate}
        />
      )}
    </div>
  );
};

export default DataTable;