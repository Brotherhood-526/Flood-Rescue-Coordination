import { createBrowserRouter } from 'react-router-dom';
import Login from '@/pages/LoginPage';
import { ROUTES } from './routes';
import MainLayout from "@/layouts/MainLayout";
import HomePage from '@/pages/HomePage';
import RequestPage from '@/pages/RequestPage';
export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <Login />,
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: ROUTES.REQUEST, 
        element: <RequestPage />,
      },
    ],
  },
]);