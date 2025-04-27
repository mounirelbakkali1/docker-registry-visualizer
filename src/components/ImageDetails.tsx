// components/ImageDetails.jsx
import React, { useState } from 'react';

const ImageDetails = ({ image, registry }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTag, setSelectedTag] = useState(image.tags && image.tags.length > 0 ? image.tags[0] : null);

  const TabButton = ({ id, label }) => (
    <button
      className={`py-2 px-4 ${activeTab === id ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
      onClick={() => setActiveTab(id)}
    >
      {label}
    </button>
  );

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
    alert('Copied to clipboard!');
  };

  const getFullImagePath = (tag) => {
    const protocol = registry.useSSL ? 'https://' : 'http://';
    return `${protocol}${registry.host}:${registry.port}/${image.name}:${tag}`;
  };

  const getPullCommand = (tag) => {
    return `docker pull ${getFullImagePath(tag)}`;
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="flex items-center p-4 border-b">
        <svg className="w-8 h-8 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{image.name}</h2>
          <p className="text-sm text-gray-500">
            Last updated: {new Date(image.lastUpdated).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="border-b">
        <div className="flex overflow-x-auto">
          <TabButton id="overview" label="Overview" />
          <TabButton id="tags" label={`Tags (${image.tags?.length || 0})`} />
          <TabButton id="layers" label="Layers" />
          <TabButton id="history" label="History" />
        </div>
      </div>

      <div className="p-4">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Image Information</h3>
              <div className="bg-gray-50 p-4 rounded">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Repository</p>
                    <p className="font-medium">{image.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Size</p>
                    <p className="font-medium">{(image.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-medium">{new Date(image.created).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-medium">{new Date(image.lastUpdated).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Pull Command</h3>
              <div className="relative">
                <div className="bg-gray-800 text-white p-3 rounded font-mono text-sm overflow-x-auto">
                  {image.tags && image.tags.length > 0 ? getPullCommand(selectedTag) : 'No tags available'}
                </div>
                <button 
                  onClick={() => image.tags && image.tags.length > 0 && copyToClipboard(getPullCommand(selectedTag))}
                  className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white p-1 rounded"
                  disabled={!image.tags || image.tags.length === 0}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                  </svg>
                </button>
              </div>
            </div>

            {image.metadata && (
              <div>
                <h3 className="text-lg font-medium mb-2">Metadata</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <pre className="text-xs overflow-x-auto">{JSON.stringify(image.metadata, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tags' && (
          <div>
            <h3 className="text-lg font-medium mb-2">Tags</h3>
            {image.tags && image.tags.length > 0 ? (
              <div className="space-y-2">
                {image.tags.map(tag => (
                  <div 
                    key={tag} 
                    className="flex justify-between items-center bg-gray-50 p-3 rounded hover:bg-gray-100 cursor-pointer"
                    onClick={() => setSelectedTag(tag)}
                  >
                    <div className="flex items-center">
                      {selectedTag === tag && (
                        <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                      )}
                      <span className="font-mono">{tag}</span>
                    </div>
                    <div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(getFullImagePath(tag));
                        }}
                        className="text-gray-500 hover:text-gray-700 mr-2"
                        title="Copy image path"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(getPullCommand(tag));
                        }}
                        className="text-gray-500 hover:text-gray-700"
                        title="Copy pull command"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No tags found for this image</p>
            )}
          </div>
        )}

        {activeTab === 'layers' && (
          <div>
            <h3 className="text-lg font-medium mb-2">Layers</h3>
            {image.layers && image.layers.length > 0 ? (
              <div className="space-y-2">
                {image.layers.map((layer, index) => (
                  <div key={layer.digest || index} className="bg-gray-50 p-3 rounded">
                    <div className="flex justify-between">
                      <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-mono truncate" title={layer.digest}>
                          {layer.digest?.substring(0, 19)}...{layer.digest?.substring(layer.digest.length - 19)}
                        </p>
                      </div>
                      <div className="ml-2 text-right">
                        <span className="text-xs text-gray-500">
                          {(layer.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No layer information available</p>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <h3 className="text-lg font-medium mb-2">History</h3>
            {image.history ? (
              <div className="bg-gray-50 p-4 rounded">
                <pre className="text-xs overflow-x-auto">{JSON.stringify(image.history, null, 2)}</pre>
              </div>
            ) : (
              <p className="text-gray-500">No history information available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageDetails;