import { Outlet } from "react-router-dom";
import Header from "./Header";

function MainLayout({role}:{role:number}) {
  return (
    <div className="flex flex-col min-h-screen">

      <Header role={role} />

      <main className="flex-1 overflow-hidden pt-15">
        <Outlet />
      </main>

      {/* Footer bật khi cần */}
      {/* <Footer /> */}

    </div>
  );
}


export default MainLayout;
