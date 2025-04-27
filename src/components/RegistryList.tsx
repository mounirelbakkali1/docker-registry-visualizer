// components/RegistryList.jsx
import React from 'react';

const RegistryList = ({ registries, selectedRegistry, onSelect, onRemove }) => {
  if (registries.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No registries added yet
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {registries.map(registry => (
        <li 
          key={registry.id}
          className={`py-3 px-2 cursor-pointer hover:bg-gray-50 rounded ${
            selectedRegistry && selectedRegistry.id === registry.id ? 'bg-blue-50' : ''
          }`}
        >
          <div className="flex justify-between items-center">
            <div 
              className="flex-1"
              onClick={() => onSelect(registry)}
            >
              <h3 className="text-sm font-medium text-gray-900">{registry.name}</h3>
              <p className="text-xs text-gray-500">
                {registry.host}:{registry.port} 
                {registry.useSSL ? ' (SSL)' : ''}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Remove ${registry.name}?`)) {
                  onRemove(registry.id);
                }
              }}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default RegistryList;