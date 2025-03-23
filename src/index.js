import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from "react-redux";
import { store, persistor } from "./app/store";
import { PersistGate } from "redux-persist/integration/react";
import { initializeApi } from "./utils/api";
import AppInInitializer from "./components/AppInInitializer";

initializeApi(store.dispatch);

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate persistor={persistor} loading={null}>
                <AppInInitializer />
                <App />
            </PersistGate>
        </Provider>
    </React.StrictMode>
);

reportWebVitals();
