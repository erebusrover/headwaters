import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { useAuth0 } from '../react-auth0-spa.jsx';
import Home from './Home.jsx';
import '../styles/home.css';

const NavBar = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar color="white" light expand="md">
        <NavbarBrand className="mr-auto" style={{ color: '#1B3E3A', fontWeight: 'bolder'}}>headwaters</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        {/* Show menu tab when logged in */}
        {isAuthenticated && (
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink tag={Link} to="/calendar">calendar</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/pillbox">pillbox</NavLink>
            </NavItem>
            <NavItem>
                <NavLink tag={Link} to="/medTracker">medicine tracker</NavLink>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                journal
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem tag={Link} to="/journal">
                  new journal entry
                </DropdownItem>
                <DropdownItem tag={Link} to="/journalHistory">
                  journal history
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
        )}
        {/* If now logged in show Log in button */}
        {!isAuthenticated && (
          <Button
            style={{ backgroundColor: '#083855', border: '0px', boxShadow: '0px 0px 10px 2px rgba(0, 0, 0, 0.4)' }}
          onClick={() => loginWithRedirect({})}
          >
            Log in
          </Button>
        )}
        {/* If logged in show Log out button */}
        {isAuthenticated && (
          <Button
            style={{ backgroundColor: '#083855', border: '0px', boxShadow: '0px 0px 10px 2px rgba(0, 0, 0, 0.4)' }}
            tag={Link}
            to="/"
            onClick={() => logout()}>
            Log out
          </Button>
        )}
      </Navbar>
      {!isAuthenticated && <Home />}
    </div>
  );
}

export default NavBar;