// components/ImageGallery.jsx
import React, { useState } from 'react';

const ImageGallery = ({ images, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No images found in this registry</p>
      </div>
    );
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Filter and sort images
  const filteredImages = images
    .filter(image => 
      image.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (typeof aValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      return sortOrder === 'asc' 
        ? aValue - bValue 
        : bValue - aValue;
    });

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search images..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex">
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="px-4 py-2 border border-gray-300 rounded-l-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="name">Name</option>
            <option value="lastUpdated">Last Updated</option>
            <option value="size">Size</option>
            <option value="tags">Tags Count</option>
          </select>
          <button
            onClick={toggleSortOrder}
            className="px-3 py-2 bg-gray-200 border border-gray-300 border-l-0 rounded-r-md hover:bg-gray-300"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredImages.map(image => (
          <div 
            key={image.id}
            onClick={() => onSelect(image)}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md cursor-pointer transition-shadow"
          >
            <div className="p-4">
              <div className="flex items-center mb-2">
                <img 
                  src="https://img.icons8.com/?size=100&id=cdYUlRaag9G9&format=png&color=000000"
                  alt={image.name} 
                  className="w-16 h-16 rounded-md mr-3"
                />
                <h3 className="text-lg font-medium text-gray-900 truncate" title={image.name}>{image.name}</h3>
              </div>
              
              <div className="text-sm text-gray-500 mb-2">
                {new Date(image.lastUpdated).toLocaleDateString()}
              </div>
              
              <div className="flex justify-between">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {image.tags?.length || 0} Tags
                </span>
                <span className="text-xs text-gray-500">
                  {(image.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No images match your search</p>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;