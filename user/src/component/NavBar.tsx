import { Link, Route, Routes, useNavigate } from "react-router-dom";
import Home from "../pages/Home.tsx";
import ChefsSelectPage from "../pages/ChefsSelectPage.tsx";
import LoginPage from "../pages/LoginPage.tsx";
import RegisterPage from "../pages/RegisterPage.tsx";
import "../App.css";
import { useEffect } from "react";
import DishDisplayPage from "../pages/DishDisplayPage.tsx";
import ShoppingCartPage from "../pages/ShoppingCartPage.tsx";
import AddressManagementPage from "../pages/AddressManagementPage.tsx";
const NavBar = () => {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.clear();
    navigate("/");
  }
  function handleAddress() {
    navigate("/AddressManagementPage");
  }
  useEffect(() => {
    localStorage.getItem("user");
  }, [localStorage.getItem("user")]);

  return (
    <>
      <div className="container-fluid d-flex justify-content-center">
        <nav className="navbar navBar navbar-expand-lg navbar-light bg-light col-10 flex p-2  shadow rounded m-2">
          <div className="container-fluid">
            <Link to="/Home" className="navbar-brand">
              Glads
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link
                    to="/Home"
                    className="nav-link active"
                    aria-current="page"
                  >
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/ChefsSelectPage"
                    className="nav-link active"
                    aria-current="page"
                  >
                    Chefs
                  </Link>
                </li>
              </ul>

              {localStorage.getItem("token") == null && (
                <Link to="/LoginPage" className="pl-4 btn btn-outline-success">
                  login
                </Link>
              )}

              {localStorage.getItem("token") != null && (
                <>
                  <div className="p-2 d-inline-flex"></div>

                  <div className="dropdown">
                    <button
                      className="btn btn-warning dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      {localStorage.getItem("name")}
                    </button>
                    <ul className="dropdown-menu">
                      <li
                        className="dropdown-item"
                        onClick={() => {
                          navigate("/ShoppingCartPage");
                        }}
                      >
                        <i className="bi bi-cart">Shopping cart</i>
                      </li>
                      <li className="dropdown-item" onClick={handleAddress}>
                        Addresses
                      </li>
                      <li className="dropdown-item">
                        <a onClick={handleLogout}>Log out</a>
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </nav>
      </div>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/Home" element={<Home />} />
        <Route path="/ChefsSelectPage" element={<ChefsSelectPage />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/RegisterPage" element={<RegisterPage />} />
        <Route path="/DishDisplayPage" element={<DishDisplayPage />} />
        <Route path="/ShoppingCartPage" element={<ShoppingCartPage />} />
        <Route
          path="/AddressManagementPage"
          element={<AddressManagementPage />}
        />
      </Routes>
    </>
  );
};
export default NavBar;
