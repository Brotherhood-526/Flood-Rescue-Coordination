import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
function MainLayout() {
    return (
        <>
            <Header />
            <main className="grow container mx-auto px-4 py-6 mt-10 mb-10">
                <Outlet />
            </main>
            <Footer/>
        </>

    );
}

export default MainLayout;