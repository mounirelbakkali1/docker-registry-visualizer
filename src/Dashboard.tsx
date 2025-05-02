// App.jsx - Main application component
import React, { useState, useEffect } from 'react';
import RegistryForm from './components/RegistryForm';
import RegistryList from './components/RegistryList';
import ImageDetails from './components/ImageDetails';
import ImageGallery from './components/ImageGallery';
import { fetchRegistryImages } from './api/registeryService';
import Navbar from './components/Navbar';

function Dashboard() {
  const [registries, setRegistries] = useState(() => {
    const savedRegistries = localStorage.getItem('docker-registries');
    return savedRegistries ? JSON.parse(savedRegistries) : [];
  });
  const [selectedRegistry, setSelectedRegistry] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    localStorage.setItem('docker-registries', JSON.stringify(registries));
  }, [registries]);

  useEffect(() => {
    if (selectedRegistry) {
      loadImages(selectedRegistry);
    } else {
      setImages([]);
    }
  }, [selectedRegistry]);

  const loadImages = async (registry) => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedImages = await fetchRegistryImages(registry);
      setImages(fetchedImages);
    } catch (err) {
      setError(`Failed to load images: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const addRegistry = (newRegistry) => {
    setRegistries([...registries, { ...newRegistry, id: Date.now().toString() }]);
    setShowAddForm(false);
  };

  const removeRegistry = (id) => {
    setRegistries(registries.filter(registry => registry.id !== id));
    if (selectedRegistry && selectedRegistry.id === id) {
      setSelectedRegistry(null);
      setSelectedImage(null);
    }
  };

  const selectImage = (image) => {
    setSelectedImage(image);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Registries *</h2>
                <button 
                  onClick={() => setShowAddForm(!showAddForm)} 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                >
                  {showAddForm ? 'Cancel' : 'Add New'}
                </button>
              </div>
              
              {showAddForm && (
                <RegistryForm onSubmit={addRegistry} />
              )}
              
              <RegistryList 
                registries={registries} 
                selectedRegistry={selectedRegistry}
                onSelect={setSelectedRegistry}
                onRemove={removeRegistry}
              />
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:w-3/4">
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                <p>{error}</p>
              </div>
            )}
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : selectedRegistry ? (
              <>
                <h2 className="text-2xl font-bold mb-4">Images in {selectedRegistry.name}</h2>
                <div className="bg-white rounded-lg shadow p-6">
                  {selectedImage ? (
                    <div>
                      <button 
                        onClick={() => setSelectedImage(null)}
                        className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded mb-4"
                      >
                        Back to Images
                      </button>
                      <ImageDetails image={selectedImage} registry={selectedRegistry} />
                    </div>
                  ) : (
                    <ImageGallery 
                      images={images} 
                      onSelect={selectImage} 
                    />
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center h-64">
                <p className="text-xl text-gray-500 mb-4">Select a registry to view images</p>
                {registries.length === 0 && (
                  <button 
                    onClick={() => setShowAddForm(true)} 
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Add Your First Registry
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;