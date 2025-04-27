// services/registryService.js

/**
 * Encodes authentication data for Docker registry access
 * @param {string} username - Registry username
 * @param {string} password - Registry password
 * @returns {string} - Base64 encoded auth string
 */
const encodeAuth = (username, password) => {
    return btoa(`${username}:${password}`);
  };
  
  /**
   * Fetches a list of repositories from a Docker registry
   * @param {Object} registry - Registry configuration object
   * @returns {Promise<Array>} - List of repositories
   */
  export const fetchRepositories = async (registry) => {
    const { host, port, useSSL, username, password } = registry;
    const protocol = useSSL ? 'https' : 'http';
    const url = `/v2/_catalog`;
    
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    
    if (username && password) {
      headers.append('Authorization', `Basic ${encodeAuth(username, password)}`);
    }
    
    try {
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        throw new Error(`Registry responded with ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.repositories || [];
    } catch (error) {
      console.error('Error fetching repositories:', error);
      throw error;
    }
  };
  
  /**
   * Fetches tags for a specific image from a Docker registry
   * @param {Object} registry - Registry configuration object
   * @param {string} imageName - Name of the image
   * @returns {Promise<Array>} - List of tags
   */
  export const fetchImageTags = async (registry, imageName) => {
    const { host, port, useSSL, username, password } = registry;
    const protocol = useSSL ? 'https' : 'http';
    const url = `/v2/${imageName}/tags/list`;
    
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    
    if (username && password) {
      headers.append('Authorization', `Basic ${encodeAuth(username, password)}`);
    }
    
    try {
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        throw new Error(`Registry responded with ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.tags || [];
    } catch (error) {
      console.error(`Error fetching tags for ${imageName}:`, error);
      throw error;
    }
  };
  
  /**
   * Fetches image manifest from a Docker registry
   * @param {Object} registry - Registry configuration object
   * @param {string} imageName - Name of the image
   * @param {string} tag - Image tag
   * @returns {Promise<Object>} - Image manifest
   */
  export const fetchImageManifest = async (registry, imageName, tag) => {
    const { host, port, useSSL, username, password } = registry;
    const protocol = useSSL ? 'https' : 'http';
    const url = `/v2/${imageName}/manifests/${tag}`;
    
    const headers = new Headers();
    headers.append('Accept', 'application/vnd.docker.distribution.manifest.v2+json');
    
    if (username && password) {
      headers.append('Authorization', `Basic ${encodeAuth(username, password)}`);
    }
    
    try {
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        throw new Error(`Registry responded with ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching manifest for ${imageName}:${tag}:`, error);
      throw error;
    }
  };
  
  /**
   * Fetches blob data from a Docker registry
   * @param {Object} registry - Registry configuration object
   * @param {string} imageName - Name of the image
   * @param {string} digest - Blob digest
   * @returns {Promise<Object>} - Blob data
   */
  export const fetchBlob = async (registry, imageName, digest) => {
    const { host, port, useSSL, username, password } = registry;
    const protocol = useSSL ? 'https' : 'http';
    const url = `/v2/${imageName}/blobs/${digest}`;
    
    const headers = new Headers();
    
    if (username && password) {
      headers.append('Authorization', `Basic ${encodeAuth(username, password)}`);
    }
    
    try {
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        throw new Error(`Registry responded with ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching blob ${digest}:`, error);
      throw error;
    }
  };
  
  /**
   * Fetches all images with their details from a registry
   * @param {Object} registry - Registry configuration object
   * @returns {Promise<Array>} - List of image objects with details
   */
  export const fetchRegistryImages = async (registry) => {
    try {
      // First get all repositories
      const repositories = await fetchRepositories(registry);
      
      // For each repository, get tags and details
      const imagesPromises = repositories.map(async (repoName) => {
        try {
          const tags = await fetchImageTags(registry, repoName);
          
          // Skip repositories with no tags
          if (!tags || tags.length === 0) {
            return {
              id: repoName,
              name: repoName,
              tags: [],
              lastUpdated: null,
              size: 0
            };
          }
          
          // Get manifest for the latest tag to get more details
          // In a real app, you might want to get this information for all tags
          const latestTag = tags[0];
          const manifest = await fetchImageManifest(registry, repoName, latestTag);
          
          // Calculate total size from layers
          let totalSize = 0;
          if (manifest.layers) {
            totalSize = manifest.layers.reduce((sum, layer) => sum + (layer.size || 0), 0);
          }
          
          return {
            id: repoName,
            name: repoName,
            tags: tags,
            lastUpdated: new Date().toISOString(), // This would ideally come from the manifest
            size: totalSize,
            created: manifest.created || new Date().toISOString(),
            layers: manifest.layers || [],
            metadata: manifest.config ? { digest: manifest.config.digest } : null
          };
        } catch (error) {
          console.error(`Error processing ${repoName}:`, error);
          // Return a minimal object for this repository
          return {
            id: repoName,
            name: repoName,
            tags: [],
            error: error.message
          };
        }
      });
      
      return await Promise.all(imagesPromises);
    } catch (error) {
      console.error('Error fetching registry images:', error);
      throw error;
    }
  };
  
  /**
   * Deletes an image tag from a Docker registry
   * @param {Object} registry - Registry configuration object
   * @param {string} imageName - Name of the image
   * @param {string} tag - Image tag to delete
   * @returns {Promise<boolean>} - Success status
   */
  export const deleteImageTag = async (registry, imageName, tag) => {
    // First, get the manifest digest
    try {
      const { host, port, useSSL, username, password } = registry;
      const protocol = useSSL ? 'https' : 'http';
      
      // Step 1: Get the manifest and its digest
      const manifestUrl = `/v2/${imageName}/manifests/${tag}`;
      
      const headers = new Headers();
      headers.append('Accept', 'application/vnd.docker.distribution.manifest.v2+json');
      
      if (username && password) {
        headers.append('Authorization', `Basic ${encodeAuth(username, password)}`);
      }
      
      const manifestResponse = await fetch(manifestUrl, { 
        method: 'GET',
        headers 
      });
      
      if (!manifestResponse.ok) {
        throw new Error(`Failed to get manifest: ${manifestResponse.status}`);
      }
      
      const digest = manifestResponse.headers.get('Docker-Content-Digest');
      
      if (!digest) {
        throw new Error('Could not obtain manifest digest');
      }
      
      // Step 2: Delete the manifest by digest
      const deleteUrl = `/v2/${imageName}/manifests/${digest}`;
      
      const deleteResponse = await fetch(deleteUrl, {
        method: 'DELETE',
        headers
      });
      
      if (!deleteResponse.ok) {
        throw new Error(`Failed to delete image tag: ${deleteResponse.status}`);
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting ${imageName}:${tag}:`, error);
      throw error;
    }
  };
  
  /**
   * Tests connection to a Docker registry
   * @param {Object} registry - Registry configuration object
   * @returns {Promise<Object>} - Connection test result
   */
  export const testRegistryConnection = async (registry) => {
    try {
      const { host, port, useSSL, username, password } = registry;
      const protocol = useSSL ? 'https' : 'http';
      const url = `/v2/`;
      
      const headers = new Headers();
      headers.append('Accept', 'application/json');
      
      if (username && password) {
        headers.append('Authorization', `Basic ${encodeAuth(username, password)}`);
      }
      
      const startTime = Date.now();
      const response = await fetch(url, { headers });
      const endTime = Date.now();
      
      const responseTime = endTime - startTime;
      
      if (!response.ok) {
        return {
          success: false,
          status: response.status,
          message: `Registry returned ${response.status}: ${response.statusText}`
        };
      }
      
      return {
        success: true,
        apiVersion: 'v2',
        responseTime: `${responseTime}ms`
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  };