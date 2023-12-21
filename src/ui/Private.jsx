import React,{ useState } from "react";
import { Navigate,Outlet } from "react-router-dom";


function Private() {
    const auth = localStorage.getItem("user");
    return auth ? <Outlet /> : <Navigate to="/login" />
}


export default Private;