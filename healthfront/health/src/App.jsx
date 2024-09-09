
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import {Toaster} from 'react-hot-toast'
import { routes } from './routes/routes';
import Web3Provider from './contexts/Web3Provider';
import './styles/index.css';

const App = () => {
    return (
        <Web3Provider>
            <RouterProvider router={routes} />
            <Toaster/>
        </Web3Provider>
    );
};

export default App;
