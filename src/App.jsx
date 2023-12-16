import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import GlobalStyles from "./styles/GlobalStyles";
import Dashboard from "./pages/Dashboard";
import Clubs from "./pages/Clubs";
import Saved from "./pages/Saved";
import Likes from "./pages/Likes";
import Settings from "./pages/Settings";
import Account from "./pages/Account";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import AppLayout from "./ui/AppLayout";
import SinglePost from "./pages/SinglePost";
import AddClubPost from "./pages/AddClubPost";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <GlobalStyles />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate replace to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="bookings" element={<Clubs />} />
            <Route path="cabins" element={<Likes />} />
            <Route path="users" element={<Saved />} />
            <Route path="settings" element={<Settings />} />
            <Route path="account" element={<Account />} /> 
            <Route path="dashboard/:id" element={<SinglePost />} /> 
            <Route path="club/:clubName/post" element={<AddClubPost />} /> 
          </Route>

          <Route path="login" element={<Login />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
      
      <ToastContainer />
    </>
  );
}

export default App;
