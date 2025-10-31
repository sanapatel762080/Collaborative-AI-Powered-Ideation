// import React, { useContext } from "react";
// import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
// import { Link, useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import "./Navbar.css";
// export default function AppNavbar() {
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();

//   return (
//     // <Navbar className="bg-primary bg-gradient text-white" variant="dark" expand="lg">
//           <Navbar className="navbar-custom navbar-dark" sticky="top"  variant="dark" expand="lg">

//       <Container>
//         <Navbar.Brand as={Link} to="/">
//           AI Ideation
//         </Navbar.Brand>
//         <Navbar.Toggle aria-controls="basic-navbar-nav" />
//         <Navbar.Collapse id="basic-navbar-nav">
//           <Nav className="me-auto">
//             <Nav.Link as={Link} to="/">
//               Dashboard
//             </Nav.Link>
//             <Nav.Link as={Link} to="/projects">
//               Projects
//             </Nav.Link>
//           </Nav>

//           <Nav>
//             {user ? (
//               <NavDropdown title={user.username} id="user-dropdown">
//                 {user.role === "ADMIN" && (
//                   <NavDropdown.Item as={Link} to="/admin">
//                     Admin Panel
//                   </NavDropdown.Item>
//                 )}
//                 <NavDropdown.Item
//                   onClick={() => {
//                     logout();
//                     navigate("/login");
//                   }}
//                 >
//                   Logout
//                 </NavDropdown.Item>
//               </NavDropdown>
//             ) : (
//               <>
//                 <Nav.Link as={Link} to="/login">
//                   Login
//                 </Nav.Link>
//                 <Nav.Link as={Link} to="/signup">
//                   Signup
//                 </Nav.Link>
//               </>
//             )}
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// }


import React, { useContext } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

export default function AppNavbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard = location.pathname === "/";
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  const handleLogout = () => {
    logout();
    navigate("/"); // redirect to dashboard after logout
  };

  return (
    <Navbar
      className="navbar-custom navbar-dark"
      sticky="top"
      variant="dark"
      expand="lg"
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
          AI Ideation
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* ✅ Always show Dashboard */}
            <Nav.Link as={Link} to="/">
              Dashboard
            </Nav.Link>

            {/* ❌ Hide Projects on login/signup pages */}
            {!isAuthPage && location.pathname !== "/" && (
              <Nav.Link as={Link} to="/projects">
                Projects
              </Nav.Link>
            )}
          </Nav>

          <Nav>
            {isDashboard ? (
              user ? (
                // ✅ Dashboard + logged in → Logout only
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              ) : (
                // ✅ Dashboard + not logged in → Login + Signup
                <>
                  <Nav.Link as={Link} to="/login">
                    Login
                  </Nav.Link>
                  <Nav.Link as={Link} to="/signup">
                    Signup
                  </Nav.Link>
                </>
              )
            ) : isAuthPage ? null : (
              // ✅ On other pages → show user dropdown
              <NavDropdown title={user?.username || "User"} id="user-dropdown">
                {user?.role === "ADMIN" && (
                  <NavDropdown.Item as={Link} to="/admin">
                    Admin Panel
                  </NavDropdown.Item>
                )}
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
