// src/routes/routes.js
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import Wallet from '../pages/Wallet';
import Home from '../pages/Home';
import UploadHealthInfo from '../components/UploadHealthInfo';
import UploadUserInfo from '../components/UploadUserInfo';
import GetHealthInfo from '../components/GetHealthInfo';

export const routes = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            { path: "/", element: <Wallet /> },
            { path: "/home", element: <Home /> },
            { path: "/uploadHealthInfo", element: <UploadHealthInfo /> },
            { path: "/uploadUserInfo", element: <UploadUserInfo /> },
            { path: "/getHealthInfo/:hash/:userAddress", element: <GetHealthInfo /> },
        ],
    },
]);

