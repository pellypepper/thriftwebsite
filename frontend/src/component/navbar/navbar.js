import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faSearch, faBars } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser, useAuth } from "@clerk/clerk-react";
import { setToken, fetchUserData, sendClerkDataToBackend, clearAuth } from "../../features/authSlice";
import { setQuery, fetchSearchResults } from "../../features/searchSlice";
import "./navbar.css";

export default function Navbar({ sellRef }) {
    const menuRef = useRef(null);
    const searchRef = useRef(null); // 🔹 Ref for detecting outside clicks
    const dispatch = useDispatch();
    const { user: clerkUser, isSignedIn } = useUser();
    const { getToken } = useAuth();
    const { loading, clerkSyncStatus } = useSelector(state => state.auth);
    const { query, results } = useSelector(state => state.search);

    const [showResults, setShowResults] = useState(false); // 🔹 State to control dropdown visibility

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

    const handleToggle = () => {
        if (menuRef.current) {
            menuRef.current.classList.toggle("open");
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem("clerk-token");
        dispatch(clearAuth());
    };

    const handleSellClick = () => {
        if (sellRef.current) {
            sellRef.current.classList.toggle("open");
        } 
    };

    const handleSearchChange = (e) => {
        const searchQuery = e.target.value;
        dispatch(setQuery(searchQuery));

        if (searchQuery.trim().length > 0) {
            dispatch(fetchSearchResults(searchQuery));
            setShowResults(true); // 🔹 Show results when typing
        } else {
            setShowResults(false);
        }
    };

    // 🔹 Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <main>
            <header>
                <div className="logo-wrapper"></div>

                <nav ref={menuRef}>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li>Categories</li>
                        <li>Deals</li>
                        <li onClick={handleSellClick}>Sell</li>
                        <li>Help</li>
                        <li className="userbutton">
                            <UserButton afterSignOutCallback={handleSignOut} />
                        </li>
                    </ul>
                    <div className="acct-wrapper">
                        <SignedOut>
                            <div className="signin-btn">
                                <SignInButton mode="modal">
                                    <button className="btn">Account</button>
                                </SignInButton>
                            </div>
                        </SignedOut>
                        <SignedIn>
                            <div className="profile-btn">
                                <span>
                                    {loading ? "Loading..." : clerkUser?.username}
                                    {clerkSyncStatus === "loading" && " (Syncing...)"}
                                </span>
                            </div>
                        </SignedIn>
                    </div>
                </nav>

                {/* 🔹 Search Wrapper with ref */}
                <div className="search-wrapper" ref={searchRef}>
                    <input
                        type="text"
                        placeholder="Search for products, brands and categories"
                        value={query}
                        onChange={handleSearchChange}
                        onFocus={() => setShowResults(true)} // 🔹 Show results when clicking inside
                    />
                    <button aria-label="Search">
                        <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                    
                    {/* 🔹 Conditionally render search results */}
                    {showResults && results.length > 0 && (
                        <ul className="search-results">
                            {results.map((product, index) => (
                                <li key={index}>{product.title}</li>
                            ))}
                        </ul>
                    )}
                </div>

                <aside>
                    <div className="right-menu screen-lg">
                        <FontAwesomeIcon icon={faSearch} />
                        <FontAwesomeIcon icon={faBars} onClick={handleToggle} />
                    </div>
                </aside>
            </header>
        </main>
    );
}
