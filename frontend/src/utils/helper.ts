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

/*
 * Example Usage:
 *   const file = document.querySelector('input[type="file"]').files[0];
 *   console.log(fileToDataUrl(file));
 * @param {File} file The file to be read.
 * @return {Promise<string>} Promise which resolves to the file as a data url.
 */
export const fileToDataUrl = (file: File): Promise<string> => {
  const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const valid = validFileTypes.find((type) => type === file.type);
  // Bad data, let's walk away.
  if (!valid) {
    throw new Error('provided file is not a png, jpg or jpeg image.');
  }

  const reader = new FileReader();
  const dataUrlPromise = new Promise<string>((resolve, reject) => {
    reader.onerror = () => reject(new Error('File reading failed'));
    reader.onload = () => {
      if (reader.result) {
        resolve(reader.result.toString());
      } else {
        reject(new Error('No result from file reader'));
      }
    };
  });
  reader.readAsDataURL(file);
  return dataUrlPromise;
}
