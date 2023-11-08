// Local Storage Management
export const storeToken = (token: string) => localStorage.setItem('token', token);
export const getToken = () => localStorage.getItem('token');
export const storeEmail = (email: string) => localStorage.setItem('email', email);
export const getEmail = () => localStorage.getItem('email');
export const clearLocalStorage = () => localStorage.clear();

export const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message
  return String(error)
}
