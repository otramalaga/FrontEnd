import axios from "axios";

import { API_BASE_URL } from '../config/apiConfig';
import { PREDEFINED_CATEGORIES, PREDEFINED_TAGS } from '../constants/predefinedData';
const API_BASE = API_BASE_URL;


const baseUrl = `${API_BASE}/bookmarks`;
const categoriesUrl = `${API_BASE}/categories/all`;
const tagsUrl = `${API_BASE}/tags/all`;
const usersUrl = `${API_BASE}/user`; 

const CACHE_KEYS = {
  BOOKMARKS: 'cached_bookmarks',
  CATEGORIES: 'cached_categories',
  TAGS: 'cached_tags',
  USERS: 'cached_users',
  TIMESTAMP: '_timestamp'
};

function getRequestOptions() {
  const user = JSON.parse(localStorage.getItem("user"));
  return {
    headers: {
      ...(user && user.token ? { Authorization: `Bearer ${user.token}` } : {}),
      ...(user && user.id ? { "X-User-ID": user.id } : {}),
    },
  };
}

const setCacheItem = (key, data) => {
  try {
    const cacheData = {
      data,
      timestamp: new Date().getTime()
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
  } catch (error) {
  }
};

const clearCache = () => {
  Object.values(CACHE_KEYS).forEach(key => localStorage.removeItem(key));
};

export function peekStaleBookmarks() {
  try {
    const item = localStorage.getItem(CACHE_KEYS.BOOKMARKS);
    if (!item) return null;
    const { data } = JSON.parse(item);
    return Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
}

/**
 * Siempre pide la lista al API y actualiza localStorage (para mostrar datos viejos al instante con peekStaleBookmarks mientras carga).
 * Así los marcadores reflejan el servidor en cada carga; no hay ventana de horas sin refrescar.
 */
export function getAllBookmarks() {
  return axios
    .get(baseUrl)
    .then((response) => {
      const data = response.data;
      setCacheItem(CACHE_KEYS.BOOKMARKS, data);
      return data;
    })
    .catch((error) => {
      throw error;
    });
}

export function searchBookmarks(searchTerm) {
  return axios
    .get(`${baseUrl}/search`, {
      ...getRequestOptions(),
      params: { title: searchTerm.trim() },
    })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}

export function getBookmarkById(id) {
  const url = `${baseUrl}/${id}`;
  return axios
    .get(url, getRequestOptions())
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}

export function createBookmark(bookmarkData) {
  const isFormData = bookmarkData instanceof FormData;
  return axios
    .post(baseUrl, bookmarkData, {
      headers: {
        ...getRequestOptions().headers,
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
      },
    })
    .then((response) => {
      clearCache();
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}

export function updateBookmark(id, updatedExperiences) {
  const url = `${baseUrl}/${id}`;
  return axios
    .put(url, updatedExperiences, getRequestOptions())
    .then((response) => {
      clearCache(); 
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}

export function deleteBookmark(id) {
  const url = `${baseUrl}/${id}`;
  return axios
    .delete(url, getRequestOptions())
    .then((response) => {
      clearCache();
      if (response.status === 204) {
        
        return true;
      } else {
        throw new Error(`Respuesta inesperada: ${response.status}`);
      }
    })
    .catch((error) => {
      throw error;
    });
}

export function getCategories() {
  return Promise.resolve(PREDEFINED_CATEGORIES);
}

export function getTags() {
  return Promise.resolve(PREDEFINED_TAGS);
}

export function getUserById(id) {
  const cacheKey = `${CACHE_KEYS.USERS}_${id}`;
  localStorage.removeItem(cacheKey);
  
  const bookmarkUser = JSON.parse(localStorage.getItem("user"));
  if (bookmarkUser && bookmarkUser.id === parseInt(id)) {
    return Promise.resolve({
      id: bookmarkUser.id,
      name: bookmarkUser.name || bookmarkUser.username || "Usuario Anónimo"
    });
  }
  
  const url = `${API_BASE}/auth/user/${id}`;
  
  return axios
    .get(url, {
      ...getRequestOptions(),
      headers: {
        ...getRequestOptions().headers,
        'Accept': 'application/json'
      }
    })
    .then((response) => {
      const data = response.data;
      
      const userData = {
        id: data.id,
        name: data.name || data.username || "Usuario Anónimo",
      };
      
      setCacheItem(cacheKey, userData);
      return userData;
    })
    .catch((error) => {
      if (bookmarkUser) {
        const defaultUser = {
          id: id,
          name: bookmarkUser.name || "Usuario Anónimo"
        };
        return defaultUser;
      }

      const defaultUser = {
        id: id,
        name: "Usuario Anónimo"
      };
      return defaultUser;
    });
}


export function refreshData() {
  clearCache();
  return Promise.all([
    getAllBookmarks(),
    getCategories(),
    getTags()
  ]);
}
