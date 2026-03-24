import { Outlet } from "react-router-dom";
import Header from "./Header";

function MainLayout({ role }: { role: number }) {
  const mainPaddingTop = role === 3 ? "pt-40" : "pt-20";

  return (
    <div className="flex flex-col min-h-screen">
      <Header role={role} />

      <main className={`flex-1 w-full ${mainPaddingTop}`}>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
