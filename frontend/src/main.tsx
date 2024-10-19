import { createRoot } from 'react-dom/client'
import App from './App'
import {PersistGate} from 'redux-persist/integration/react';
import {GoogleOAuthProvider} from '@react-oauth/google';
import {GOOGLE_CLIENT_ID} from './constants';
import {Provider} from 'react-redux';
import {persistor, store} from './app/store';
import {ThemeProvider} from '@mui/material';
import theme from './theme';
import {BrowserRouter} from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <App/>
          </BrowserRouter>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </GoogleOAuthProvider>
)
