import React, { useContext, useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavbarBrand,
} from "reactstrap";
import { Link } from "react-router-dom";
import { UserContext } from "../user-context";

const TopNav = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);
  const [collapsed, setCollapsed] = useState(true);
  const toggleNavbar = () => setCollapsed(!collapsed);

  const logoutHandler = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    setIsLoggedIn(false);
  };

  return isLoggedIn ? (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">ReactJS</NavbarBrand>
        <NavbarToggler onClick={toggleNavbar} />
        <Collapse isOpen={!collapsed} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <Link to="/events" className="mr-4">
                Events
              </Link>
            </NavItem>
            <NavItem>
              <Link to="/" className="mr-4">
                Dashboard
              </Link>
            </NavItem>
            <NavItem>
              <Link to="/registration">My Registrations</Link>
            </NavItem>
          </Nav>
          <Link to="/login" onClick={logoutHandler}>
            Logout
          </Link>
        </Collapse>
      </Navbar>
    </div>
  ) : ( ""
  );
};

export default TopNav;
