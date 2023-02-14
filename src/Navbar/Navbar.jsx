import React from "react";
import { Navbar, NavDropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaBars } from "react-icons/fa";

function Navb() {
  return (
    <Navbar bg="light" expand="" className="nav">
      <Navbar.Brand href="#home">
        <img
          src="https://via.placeholder.com/50x50"
          width="50"
          height="50"
          className="d-inline-block align-top rounded-circle"
          alt="Imagen de perfil de usuario"
        />
      </Navbar.Brand>
      <NavDropdown title={<FaBars />} id="basic-nav-dropdown" drop="start">
        <NavDropdown.Item href="#action/3.1">Perfil</NavDropdown.Item>
        <NavDropdown.Item href="#action/3.2">
          Cargar inventario inicial
        </NavDropdown.Item>
        <NavDropdown.Item href="#action/3.3">Dar salida</NavDropdown.Item>
        <NavDropdown.Item href="#action/3.4">Dar ingreso</NavDropdown.Item>
        <NavDropdown.Item href="#action/3.5">
          Ver stunts profiles
        </NavDropdown.Item>
        <NavDropdown.Item href="#action/3.6">
          Ver ult. movimientos
        </NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="#action/3.7">Cerrar sesión</NavDropdown.Item>
      </NavDropdown>
    </Navbar>
  );
}

export default Navb;
