import React, { useState, useRef, useEffect} from "react";
import './App.css';
import Home from './pages/home/home';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Details from './pages/product/details';
import ChatPage from './pages/chat/chat';
import {  useUser, useAuth} from "@clerk/clerk-react";
import { setToken, fetchUserData, sendClerkDataToBackend, clearAuth } from "./features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import Inbox from "./pages/inbox/inbox";
import Listing from "./pages/listing/listing";
import Category from "./pages/categories/category";
import Sell from './component/sellform/sell'
import Navbar from "./component/navbar/navbar";
import Spinner from './component/spinner/spinner'

const RouteWrapper = ({ component: Component, ...props }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    
    setIsLoading(true);
    
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);
    
    // Clean up timer
    return () => clearTimeout(timer);
  }, []);
  
  return isLoading ? <div className="route-loading-spinner"><Spinner /></div> : <Component {...props} />;
};


function App() {
  const dispatch = useDispatch();
  const { user: clerkUser, isSignedIn } = useUser();
  const sellRef = useRef();
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
    <Navbar
      sellRef={sellRef}
      loading={loading}
      handleSignOut={handleSignOut}
      clerkUser={clerkUser}
      clerkSyncStatus={clerkSyncStatus}
    />
    
    {/* Sell modal visible globally */}
    <section ref={sellRef} className="sellform-wrapper">
      <Sell sellRef={sellRef} />
    </section>
    
    <Routes>
      <Route 
        path="/" 
        element={
          <RouteWrapper 
            component={Home} 
            loading={loading} 
            handleSignOut={handleSignOut} 
            clerkUser={clerkUser} 
            clerkSyncStatus={clerkSyncStatus} 
          />
        } 
      />
      <Route 
        path="/details" 
        element={
          <RouteWrapper 
            component={Details} 
            buyerId={clerkUser?.id} 
          />
        } 
      />
      <Route 
        path="/chat" 
        element={
          <RouteWrapper 
            component={ChatPage} 
            buyerId={clerkUser?.id} 
          />
        } 
      />
      <Route 
        path="/inbox" 
        element={
          <RouteWrapper 
            component={Inbox} 
            userId={clerkUser?.id} 
          />
        } 
      />
      <Route 
        path="/listing" 
        element={
          <RouteWrapper 
            component={Listing} 
            userId={clerkUser?.id} 
          />
        } 
      />
      <Route 
        path="/category" 
        element={
          <RouteWrapper 
            component={Category} 
            userId={clerkUser?.id} 
          />
        } 
      />
    </Routes>
  </Router>
  );
}

export default App;
