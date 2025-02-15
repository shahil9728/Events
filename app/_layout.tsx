import React from 'react';
import App from './App';
import { ThemeProvider } from './ThemeContext';
import store from './redux/store';
import { Provider } from "react-redux";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider >
  );
}

