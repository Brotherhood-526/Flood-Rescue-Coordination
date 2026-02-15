import { createBrowserRouter } from 'react-router-dom';
import Login from '@/pages/LoginPage';
import { ROUTES } from './routes';
import MainLayout from "@/layouts/MainLayout";
import HomePage from '@/pages/HomePage';
import RequestPage from '@/pages/User/RequestPage';
import FindRequestPage from '@/pages/FindRequestPage';
import ContactPage from '@/pages/ContactPage';
import GuidePage from '@/pages/GuidePage';
import ListRequestPage from "@/pages/Coordinator/ListRequestPage";
import RequestDetailPage from "@/pages/Coordinator/RequestDetailPage";
import FullMapPage from "@/pages/Coordinator/FullMapPage";

export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <Login />,
  },
  {
    path: "/",
    element: <MainLayout role={1}/>,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: ROUTES.REQUEST,
        element: <RequestPage />,
      },
      {
        path: ROUTES.SEARCH, 
        element: <FindRequestPage />,
      },
      {
        path: ROUTES.CONTACT,
        element: <ContactPage />,
      },
      {
        path: ROUTES.GUIDE,
        element: <GuidePage />,
      },
    ],
  },
    {
        path: ROUTES.COORDINATE,
        element: <MainLayout role={3} />,
        children: [
            {
                index: true, element: <ListRequestPage />
            },
            {
                path: ROUTES.REQUESTDETAILS,
                element: <RequestDetailPage/>,
            },
        ],
    },
    {
        path: ROUTES.FULLMAP,
        element: <FullMapPage/>,
    }
]);
