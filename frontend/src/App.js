import React, {  useEffect} from "react";
import './App.css';
import Home from './pages/home/home';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import User from './pages/user/user';
import Details from './pages/product/details';
import ChatPage from './pages/chat/chat';
import {  useUser, useAuth} from "@clerk/clerk-react";
import { setToken, fetchUserData, sendClerkDataToBackend, clearAuth } from "./features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import Inbox from "./pages/inbox/inbox";
import Listing from "./pages/listing/listing";

function App() {
  const dispatch = useDispatch();
  const { user: clerkUser, isSignedIn } = useUser();
  
  const { getToken } = useAuth();
  const { loading, clerkSyncStatus } = useSelector(state => state.auth);

    useEffect(() => {
        const initializeAuth = async () => {
            if (isSignedIn && clerkUser) {
                try {
                    const token = await getToken();
                    dispatch(setToken(token));
                    localStorage.setItem("clerk-token", token);
                    
                    await dispatch(sendClerkDataToBackend({ user: clerkUser, token })).unwrap();
                    
                    dispatch(fetchUserData(token));
                } catch (error) {
                    console.error("Auth error:", error);
                }
            }
        };
        initializeAuth();
    }, [isSignedIn, clerkUser, dispatch, getToken]);


    const handleSignOut = () => {
      localStorage.removeItem("clerk-token");
      dispatch(clearAuth());
  };



  return (
    <Router>

    <Routes>
      <Route path="/" element={<Home loading={loading} handleSignOut={handleSignOut} clerkUser={clerkUser} clerkSyncStatus={clerkSyncStatus} />} />
      <Route path="/user" element={<User />} />
      <Route path="/details" element={<Details buyerId={clerkUser?.id} />} />
      <Route path="/chat" element={<ChatPage  buyerId={clerkUser?.id} />} />
      <Route path="/inbox" element={<Inbox userId={clerkUser?.id} />} />
      <Route path="/listing" element={<Listing userId={clerkUser?.id} />} />
    </Routes>
  </Router>
  );
}

export default App;
