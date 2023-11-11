import React, { ReactNode } from 'react';
import { SnackbarProvider } from 'notistack';

interface MessageProviderProps {
  children: ReactNode;
}

export const MessageProvider: React.FC<MessageProviderProps> = ({ children }) => {
  return (
    <SnackbarProvider
      preventDuplicate={false}
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin = {{ vertical: 'bottom', horizontal: 'left' }}
    >
      {children}
    </SnackbarProvider>
  );
};
