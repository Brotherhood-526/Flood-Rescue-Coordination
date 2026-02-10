import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
function MainLayout() {
    return (
        <>
            <Header />
            <main className="flex-grow container mx-auto px-4 py-6">
                <Outlet />
            </main>
        </>

    );
}

export default MainLayout;
