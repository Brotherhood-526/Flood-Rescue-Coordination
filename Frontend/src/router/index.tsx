import { createBrowserRouter} from 'react-router-dom';
import Login from '@/pages/Login'; 
import { ROUTES } from './routes';
import MainLayout from "@/layouts/MainLayout";
export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <Login />,
  },
  {
    path: "/",
    element: <MainLayout />, 
    children: [

    ],
  },
]);