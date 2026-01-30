import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import store from './redux/store';
import ErrorBoundary from './components/common/ErrorBoundary';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <ErrorBoundary>
                <BrowserRouter>
                    <App />
                    <ToastContainer position="top-right" autoClose={3000} />
                </BrowserRouter>
            </ErrorBoundary>
        </Provider>
    </React.StrictMode>
);
