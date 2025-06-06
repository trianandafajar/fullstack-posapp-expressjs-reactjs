import { Image } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import secureLocalStorage from "react-secure-storage";
import ProfilModal from "./ProfilModal.jsx";
import { useState, useMemo, useCallback } from "react";
import { FaBuffer, FaChartBar, FaUser, FaSignOutAlt } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";

// Konstanta untuk menu navigasi
const NAVIGATION_MENU = {
  master: {
    title: "Master",
    icon: FaBuffer,
    items: [
      { label: "Category", path: "/category" },
      { label: "Supplier", path: "/supplier" },
      { label: "Product", path: "/product" },
    ],
  },
  transaction: {
    title: "Transaction",
    icon: GrTransaction,
    items: [
      { label: "Sales", path: "/sales" },
      { label: "Sales History", path: "/sales-history" },
      { label: "Purchase", path: "/purchase" },
    ],
  },
  report: {
    title: "Report",
    icon: FaChartBar,
    items: [
      { label: "Supplier", path: "/supplier-report" },
      { label: "Product", path: "/product-report" },
      { label: "Sales", path: "/sales-report" },
      { label: "Purchase", path: "/purchase-report" },
    ],
  },
};

// Komponen untuk menu dropdown
const NavigationDropdown = ({ title, icon: Icon, items }) => (
  <NavDropdown
    title={
      <>
        <Icon /> {title}
      </>
    }
    id={`nav-dropdown-${title.toLowerCase()}`}
  >
    {items.map((item) => (
      <NavDropdown.Item key={item.path} href={item.path}>
        {item.label}
      </NavDropdown.Item>
    ))}
  </NavDropdown>
);

// Komponen untuk user menu
const UserMenu = ({ avatar, name, onProfileClick }) => (
  <NavDropdown
    title={
      <>
        {avatar} {name}
      </>
    }
    id="user-nav-dropdown"
  >
    <NavDropdown.Item href="#" onClick={onProfileClick}>
      <FaUser className="me-2" />
      Profil
    </NavDropdown.Item>
    <NavDropdown.Item href="/logout">
      <FaSignOutAlt className="me-2" />
      Logout
    </NavDropdown.Item>
  </NavDropdown>
);

const NavbarComponent = () => {
  const [modalShow, setModalShow] = useState(false);
  
  // Menggunakan useMemo untuk menghindari re-render yang tidak perlu
  const user = useMemo(() => secureLocalStorage.getItem("user"), []);
  const userName = useMemo(() => user?.name || "User", [user]);

  // Menggunakan useCallback untuk fungsi event handler
  const handleProfileClick = useCallback(() => setModalShow(true), []);
  const handleModalClose = useCallback(() => setModalShow(false), []);

  // Avatar component dengan useMemo
  const avatar = useMemo(
    () => (
      <Image
        src="/img/img_avatar.png"
        alt="User"
        roundedCircle
        style={{ width: "30px" }}
      />
    ),
    []
  );

  return (
    <Navbar expand="lg" className="bg-body-tertiary print">
      <Container fluid>
        <Navbar.Brand href="/">POS APP</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {Object.entries(NAVIGATION_MENU).map(([key, menu]) => (
              <NavigationDropdown
                key={key}
                title={menu.title}
                icon={menu.icon}
                items={menu.items}
              />
            ))}
          </Nav>
          <Nav>
            <UserMenu
              avatar={avatar}
              name={userName}
              onProfileClick={handleProfileClick}
            />
          </Nav>
        </Navbar.Collapse>
      </Container>
      <ProfilModal
        show={modalShow}
        size="xl"
        onHide={handleModalClose}
      />
    </Navbar>
  );
};

export default NavbarComponent;
