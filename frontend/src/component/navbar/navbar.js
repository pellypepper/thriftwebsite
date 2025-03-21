import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faSearch, faBars } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { SignedIn, SignedOut, SignInButton, UserButton} from "@clerk/clerk-react";


import { setQuery, fetchSearchResults } from "../../features/searchSlice";
import "./navbar.css";

export default function Navbar({ sellRef, clerkSyncStatus, clerkUser, loading, handleSignOut }) {
    const menuRef = useRef(null);
    const searchRef = useRef(null); // 🔹 Ref for detecting outside clicks
     const dispatch = useDispatch();
    const { query, results } = useSelector(state => state.search);
    const navigate = useNavigate()
    const [showResults, setShowResults] = useState(false); // 🔹 State to control dropdown visibility


    const handleToggle = () => {
        if (menuRef.current) {
            menuRef.current.classList.toggle("open");
        }
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

    const handleSignIn = () => {
        if(clerkUser){
            navigate('/listing')
        }
        else {
            return alert('you must sign in to view this page')
        }
    }

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
                        <li onClick={handleSignIn}>My listings</li>
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
