import React, { useState } from "react";
import { Container, Row, Col, Button, Form, Table } from "react-bootstrap";

const Listar = () => {
  const [showTable] = useState(true);
  const [tableData, setTableData] = useState([
    { id: 1, name: "Product 1", quantity: 10 },
    { id: 2, name: "Product 2", quantity: 20 },
    { id: 3, name: "Product 3", quantity: 30 },
  ]);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleCheckboxChange = (event, row) => {
    const checked = event.target.checked;
    if (checked) {
      setSelectedRows([...selectedRows, row]);
    } else {
      setSelectedRows(
        selectedRows.filter((selectedRow) => selectedRow.id !== row.id)
      );
    }
  };

  const handleEditClick = () => {
    if (selectedRows.length === 1) {
      const row = selectedRows[0];
      const newName = prompt("Introduzca el nuevo nombre:", row.name);
      const newQuantity = prompt("Introduzca la nueva cantidad:", row.quantity);
      if (newName !== null && newQuantity !== null) {
        setTableData(
          tableData.map((tableRow) => {
            if (tableRow.id === row.id) {
              return { ...tableRow, name: newName, quantity: newQuantity };
            } else {
              return tableRow;
            }
          })
        );
      }
    }
    setSelectedRows([]);
  };

  const handleDeleteClick = () => {
    setTableData(tableData.filter((row) => !selectedRows.includes(row)));
    setSelectedRows([]);
  };

  return (
    <Container>
      {showTable && (
        <>
          <Table className="mt-5" striped bordered hover>
            <thead>
              <tr>
                <th>Cod.</th>
                <th>Nombre</th>
                <th>Cant.</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.name}</td>
                  <td>{row.quantity}</td>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={selectedRows.includes(row)}
                      onChange={(event) => handleCheckboxChange(event, row)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Row className="mt-3">
            <Col>
              <Button
                variant="outline-primary"
                onClick={handleEditClick}
                disabled={selectedRows.length !== 1}
              >
                Editar
              </Button>
            </Col>
            <Col>
              <Button
                variant="outline-danger"
                onClick={handleDeleteClick}
                disabled={selectedRows.length === 0}
              >
                Eliminar
              </Button>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default Listar;
