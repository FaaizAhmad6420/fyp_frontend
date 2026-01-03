// Save JWT token
export const setToken = (token) => {
  localStorage.setItem("token", token);
};

// Get JWT token
export const getToken = () => {
  return localStorage.getItem("token");
};

// Remove token (logout)
export const logout = () => {
  localStorage.removeItem("token");
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// Authorization header helper (for axios)
export const authHeader = () => {
  const token = getToken();
  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
};
