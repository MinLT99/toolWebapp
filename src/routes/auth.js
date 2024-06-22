// auth.js

// Function to check if user is authenticated
export const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
};

// Function to store token in localStorage
export const setToken = (token) => {
    localStorage.setItem('token', token);
};

// Function to retrieve token from localStorage
export const getToken = () => {
    return localStorage.getItem('token');
};

export const setUsername = (username) => {
    localStorage.setItem('username', username);
};

export const getUsername = () => {
    return localStorage.getItem('username');
};

// Function to remove token from localStorage
export const removeToken = () => {
    localStorage.removeItem('token');
};

// Function to handle login (including storing token)
export const login = (token, username) => {
    setToken(token);
    setUsername(username)
};

// Function to handle logout (including removing token)
export const logout = () => {
    removeToken();
};
