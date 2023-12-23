import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import GlobalStyles from "./styles/GlobalStyles";
import Dashboard from "./pages/Dashboard";
import Clubs from "./pages/Clubs";
import Saved from "./pages/Saved";
import Likes from "./pages/Likes";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PageNotFound from "./pages/PageNotFound";
import AppLayout from "./ui/AppLayout";
import SinglePost from "./pages/SinglePost";
import AddClubPost from "./pages/AddClubPost";
import Private from "./ui/Private";
import EditClubPost from "./pages/EditClubPost";
import CreateAdmin from "./pages/CreateAdmin";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClubPosts from "./pages/ClubPosts";


function App() {
  return (
    <>
      <GlobalStyles />
      <BrowserRouter>
        <Routes>
          <Route element={<Private />}>
            <Route element={<AppLayout />}>
              <Route index element={<Navigate replace to="dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="clubs" element={<Clubs />} />
              <Route path="likes" element={<Likes />} />
              <Route path="users" element={<Saved />} />
              <Route path="settings" element={<Settings />} />
              <Route path="posts/view/:id" element={<SinglePost />} />
              <Route path="club/:clubName/post" element={<AddClubPost />} />
              <Route path="/club/:clubName/post/edit/:postId" element={<EditClubPost />} />
              <Route path="club/:clubPosts" element={<ClubPosts />} />
            </Route>
          </Route>


          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="createAdmin" element={<CreateAdmin />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>

      <ToastContainer />
    </>
  );
}

export default App;
