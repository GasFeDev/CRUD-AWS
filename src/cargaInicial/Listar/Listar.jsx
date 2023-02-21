import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form, Table } from "react-bootstrap";
import "./Listar.css";

const Listar = () => {
  const [showTable, setShowTable] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getSkus = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://528676oyjb.execute-api.us-east-1.amazonaws.com/prod/sku",
          {
            method: "GET",
          }
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(data.body);
            setTableData(data.body);
            setShowTable(true);
          });
        console.log(response);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    getSkus();
  }, []);

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
  console.log(tableData);

  return (
    <Container fluid>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          {showTable ? (
            <>
              <Table
                className="mt-5 my-table"
                striped
                bordered
                hover
                responsive
              >
                <thead>
                  <tr>
                    <th>Cantidad</th>
                    <th>Descripcion</th>
                    <th>Foto</th>
                    <th>Item</th>
                    <th>Sku</th>
                    <th>Ubicacion</th>
                    <th>Seleccionar</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(tableData) &&
                    tableData.map((row) => (
                      <tr key={row.id}>
                        <td>{row["Cantidad"]}</td>
                        <td>{row["Descripcion"]}</td>
                        <td>
                          {row["Foto"] && (
                            <>
                              <img
                                src={row["Foto"]}
                                alt="Imagen de producto"
                                style={{
                                  width: "100%",
                                  height: "auto",
                                  maxWidth: "200px",
                                }}
                                onClick={() =>
                                  navigator.clipboard.writeText(row["Foto"])
                                }
                              />
                            </>
                          )}
                        </td>
                        <td>{row["Item"]}</td>
                        <td>{row["Sku"]}</td>
                        <td>{row["Ubicacion"]}</td>
                        <td>
                          <Form.Check
                            type="checkbox"
                            checked={selectedRows.includes(row)}
                            onChange={(event) =>
                              handleCheckboxChange(event, row)
                            }
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
          ) : (
            <p>No se encontraron elementos para mostrar.</p>
          )}
        </>
      )}
    </Container>
  );
};

export default Listar;
