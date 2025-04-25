import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faBars } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import Spinner from "../spinner/spinner"; // Import your spinner component

import { setQuery, fetchSearchResults } from "../../features/searchSlice";
import "./navbar.css";

export default function Navbar({
  sellRef,
  clerkSyncStatus,
  clerkUser,
  loading,
  handleSignOut,
}) {
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const dispatch = useDispatch();
  const { query, results } = useSelector((state) => state.search);
  const navigate = useNavigate();
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMenuClick = async () => {


    if (menuRef.current) {
      menuRef.current.classList.remove("open");
    }


  };

  const handleToggle = () => {
    if (menuRef.current) {
      menuRef.current.classList.toggle("open");
    }
  };

  const handleSellClick = () => {
    if (sellRef && sellRef.current) {
      sellRef.current.classList.toggle("open");
    }

    if (menuRef.current) {
      menuRef.current.classList.remove("open");
    }
  };

  const handleSearchChange = (e) => {
    const searchQuery = e.target.value;
    dispatch(setQuery(searchQuery));

    if (searchQuery.trim().length > 0) {
      dispatch(fetchSearchResults(searchQuery));
      setShowResults(true);
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

  const handleNavigate = (product) => {
    navigate("/details", { state: { product } });
  };

  const handleSubMenuClick = (e) => {
    e.stopPropagation();
    // Toggle dropdown visibility
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCategoryClick = (category) => {
    console.log(category);
    navigate("/category", { state: { category: category } });

    setIsDropdownOpen(false);
    
    // Close the main menu as well
    if (menuRef.current) {
      menuRef.current.classList.remove("open");
    }
  };

  return (
    <main>
      <header>
        <div className="logo-wrapper">
          <Link to="/">
            {" "}
            <span className="logo-icon">🛍️</span>
            <h1 className="logo-text">
              Thrift<span>Store</span>
            </h1>
          </Link>
        </div>

        <nav ref={menuRef}>
     
          <ul>
            <li>
              <Link to="/" onClick={handleMenuClick}>
                Home
              </Link>
            </li>
            <li className="category-nav" onClick={handleSubMenuClick}>
              Categories
              <ul id="dropdown" className={`dropdown ${isDropdownOpen ? "open" : ""}`}>
                <li
                  className="category-nav"
                  onClick={() => handleCategoryClick("HomeGarden")}
                >
                  Home & Garden
                </li>
                <li
                  className="category-nav"
                  onClick={() => handleCategoryClick("Entertainment")}
                >
                  Entertainment
                </li>
                <li
                  className="category-nav"
                  onClick={() => handleCategoryClick("ClothingAccessories")}
                >
                  Clothing & Accessories
                </li>
                <li
                  className="category-nav"
                  onClick={() => handleCategoryClick("Electronics")}
                >
                  Electronics
                </li>
                <li
                  className="category-nav"
                  onClick={() => handleCategoryClick("Family")}
                >
                  Family
                </li>
                <li
                  className="category-nav"
                  onClick={() => handleCategoryClick("Hobbies")}
                >
                  Hobbies
                </li>
              </ul>
            </li>

            <li onClick={handleSellClick}>Sell</li>
            <li>
              <Link to="/inbox" onClick={handleMenuClick}>
                Inbox
              </Link>
            </li>
            <li>
              <Link to="/listing" onClick={handleMenuClick}>
                My Listing
              </Link>
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
      {loading ? (
        <>
          Loading... <Spinner />
        </>
      ) : (
        <>
          {clerkUser?.username}
          {clerkSyncStatus === "loading" && (
            <>
              {" (Syncing..."} <Spinner /> {")"}
            </>
          )}
        </>
      )}
    </span>
  </div>
</SignedIn>
          </div>
        </nav>

        {/* 🔹 Search Wrapper with ref */}
        <div className="user-search">
          <div className="userbutton">
            <UserButton afterSignOutCallback={handleSignOut} />
          </div>
          <div className="search-wrapper" ref={searchRef}>
            <input
              type="text"
              placeholder="Search for products, brands and categories"
              value={query}
              onChange={handleSearchChange}
              onFocus={() => setShowResults(true)} // 🔹 Show results when clicking inside
            />
          

            {/* 🔹 Conditionally render search results */}
            {showResults && results.length > 0 && (
              <ul className="search-results">
                {results.map((product, index) => (
                  <li onClick={() => handleNavigate(product)} key={index}>
                    {product.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <aside className="right-menu screen-lg">
          <FontAwesomeIcon
            style={{ fontSize: "25px" }}
            icon={faBars}
            onClick={handleToggle}
          />
        </aside>
      </header>
    </main>
  );
}
