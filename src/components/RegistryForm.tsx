// components/RegistryForm.jsx
import React, { useState } from 'react';

const RegistryForm = ({ onSubmit, initialValues = {} }) => {
  const [registry, setRegistry] = useState({
    name: initialValues.name || '',
    host: initialValues.host || '',
    username: initialValues.username || '',
    password: initialValues.password || '',
    port: initialValues.port || '5000',
    useSSL: initialValues.useSSL || false,
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!registry.name.trim()) newErrors.name = 'Name is required';
    if (!registry.host.trim()) newErrors.host = 'Host is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRegistry({
      ...registry,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(registry);
      // Reset form if needed
      if (!initialValues.id) {
        setRegistry({
          name: '',
          host: '',
          username: '',
          password: '',
          port: '5000',
          useSSL: false,
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Registry Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={registry.name}
          onChange={handleChange}
          className={`w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.name ? 'border-red-500' : ''}`}
          placeholder="MyRegistry"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>
      
      <div>
        <label htmlFor="host" className="block text-sm font-medium text-gray-700">Host</label>
        <input
          type="text"
          id="host"
          name="host"
          value={registry.host}
          onChange={handleChange}
          className={`w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.host ? 'border-red-500' : ''}`}
          placeholder="registry.example.com"
        />
        {errors.host && <p className="text-red-500 text-xs mt-1">{errors.host}</p>}
      </div>
      
      <div className="flex space-x-4">
        <div className="flex-1">
          <label htmlFor="port" className="block text-sm font-medium text-gray-700">Port</label>
          <input
            type="text"
            id="port"
            name="port"
            value={registry.port}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="5000"
          />
        </div>
        
        <div className="flex items-end mb-1">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="useSSL"
              checked={registry.useSSL}
              onChange={handleChange}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-700">Use SSL</span>
          </label>
        </div>
      </div>
      
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={registry.username}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="(optional)"
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={registry.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="(optional)"
        />
      </div>
      
      <div className="pt-2">
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {initialValues.id ? 'Update Registry' : 'Add Registry'}
        </button>
      </div>
    </form>
  );
};

export default RegistryForm;