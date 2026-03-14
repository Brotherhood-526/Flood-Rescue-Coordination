import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "./routes";
import ProtectedRoute from "@/components/ProtectedRoute";
import MainLayout from "@/layouts/MainLayout";

// Public & User Pages
import Login from "@/pages/LoginPage";
import HomePage from "@/pages/HomePage";
import RequestPage from "@/pages/User/Request";
import FindRequestPage from "@/pages/FindRequestPage";
import ContactPage from "@/pages/ContactPage";
import GuidePage from "@/pages/GuidePage";

// Rescue Pages
import ListRescuePage from "@/pages/Rescue/ListRescuePage";
import RescueDetailPage from "@/pages/Rescue/RescueDetailPage";
import FullMapRescuePage from "@/pages/Rescue/FullMapRescuePage";
import RescueChatBox from "@/pages/Rescue/RescueChatBox";

// Manager Pages
import { OverviewPage } from "@/pages/Manager/OverviewPage";
import { ManageEmployeePage } from "@/pages/Manager/ManageEmployeePage";
import { ManageTeamPage } from "@/pages/Manager/ManageTeamPage";
import { ManageVehiclePage } from "@/pages/Manager/ManageVehiclePage";

// Coordinator Pages
import ListRequestPage from "@/pages/Coordinator/ListRequestPage";
import RequestDetailPage from "@/pages/Coordinator/RequestDetailPage";
import FullMapCoordinatorPage from "@/pages/Coordinator/FullMapCoordinatorPage";
import TestChatBox from "@/pages/Coordinator/TestChatBox";

export const router = createBrowserRouter([
  { path: ROUTES.LOGIN, element: <Login /> },

  // PUBLIC
  {
    path: "/",
    element: <MainLayout role={1} />,
    children: [
      { index: true, element: <HomePage /> },
      { path: ROUTES.REQUEST, element: <RequestPage /> },
      { path: ROUTES.SEARCH, element: <FindRequestPage /> },
      { path: ROUTES.CONTACT, element: <ContactPage /> },
      { path: ROUTES.GUIDE, element: <GuidePage /> },
    ],
  },

  // NHÓM ĐIỀU PHỐI VIÊN
  {
    element: <ProtectedRoute allowedRoles={["điều phối viên"]} />,
    children: [
      {
        path: ROUTES.COORDINATE,
        element: <MainLayout role={4} />,
        children: [{ index: true, element: <ListRequestPage /> }],
      },
      {
        path: ROUTES.COORDINATE_DETAIL,
        element: <MainLayout role={4} />,
        children: [{ index: true, element: <RequestDetailPage /> }],
      },
      { path: ROUTES.COORDINATE_MAP, element: <FullMapCoordinatorPage /> },
      { path: ROUTES.COORDINATE_CHAT, element: <TestChatBox /> },
    ],
  },

  // NHÓM ĐỘI CỨU HỘ
  {
    element: <ProtectedRoute allowedRoles={["cứu hộ"]} />,
    children: [
      {
        path: ROUTES.RESCUE,
        element: <MainLayout role={2} />,
        children: [{ index: true, element: <ListRescuePage /> }],
      },
      {
        path: ROUTES.RESCUE_DETAIL,
        element: <MainLayout role={2} />,
        children: [{ index: true, element: <RescueDetailPage /> }],
      },
      {
        path: ROUTES.RESCUE_CHAT,
        element: <MainLayout role={2} />,
        children: [{ index: true, element: <RescueChatBox /> }],
      },
      { path: ROUTES.RESCUE_MAP, element: <FullMapRescuePage /> },
    ],
  },

  // NHÓM QUẢN LÝ
  {
    element: <ProtectedRoute allowedRoles={["quản lý"]} />,
    children: [
      {
        path: ROUTES.MANAGER,
        element: <MainLayout role={3} />,
        children: [{ index: true, element: <OverviewPage /> }],
      },
      {
        path: ROUTES.MANAGER_EMPLOYEE,
        element: <MainLayout role={3} />,
        children: [{ index: true, element: <ManageEmployeePage /> }],
      },
      {
        path: ROUTES.MANAGER_TEAM,
        element: <MainLayout role={3} />,
        children: [{ index: true, element: <ManageTeamPage /> }],
      },
      {
        path: ROUTES.MANAGER_VEHICLE,
        element: <MainLayout role={3} />,
        children: [{ index: true, element: <ManageVehiclePage /> }],
      },
    ],
  },
]);
