import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form, Table } from "react-bootstrap";
import "./Listar.css";

const Listar = () => {
  const [Sku] = useState("");
  const [Nombre] = useState("");
  const [Descripcion] = useState("");
  const [Cantidad] = useState("");
  const [Ubicacion] = useState("");
  const [id, setId] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [hiddenRows] = useState(
    JSON.parse(localStorage.getItem("hiddenRows")) || []
  );
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
            const tableDataWithId = data.body
              .filter((item) => item["Eliminado"] !== true)
              .map((item) => ({
                ...item,
                id: item["ID Interno"],
              }));
            setTableData(tableDataWithId);
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

  useEffect(() => {
    localStorage.setItem("hiddenRows", JSON.stringify(hiddenRows));
  }, [hiddenRows]);

  const handleCheckboxChange = (event, row) => {
    const checked = event.target.checked;
    if (checked) {
      setSelectedRows([row]);
      setId(row["ID Interno"]);
    } else {
      setSelectedRows([]);
      setId(null);
    }
  };

  async function handleEditClick(event) {
    event.preventDefault();
    if (!id) {
      alert("Debe seleccionar una fila para editar.");
      return;
    }
    try {
      const updatedProduct = {};

      let newSku = prompt("Introduce el nuevo valor para el SKU:", Sku);
      if (newSku !== null) {
        updatedProduct.Sku = newSku;
      } else {
        return;
      }

      let newNombre = prompt(
        "Introduce el nuevo valor para el nombre:",
        Nombre
      );
      if (newNombre !== null) {
        updatedProduct.Nombre = newNombre;
      } else {
        return;
      }

      let newDescripcion = prompt(
        "Introduce el nuevo valor para la descripción:",
        Descripcion
      );
      if (newDescripcion !== null) {
        updatedProduct.Descripcion = newDescripcion;
      } else {
        return;
      }

      let newCantidad = prompt(
        "Introduce el nuevo valor para la cantidad:",
        Cantidad
      );
      if (newCantidad !== null) {
        updatedProduct.Cantidad = newCantidad;
      } else {
        return;
      }

      let newUbicacion = prompt(
        "Introduce el nuevo valor para la ubicación:",
        Ubicacion
      );
      if (newUbicacion !== null) {
        updatedProduct.Ubicacion = newUbicacion;
      } else {
        return;
      }

      updatedProduct["ID Interno"] = id;

      const response = await fetch(
        "https://528676oyjb.execute-api.us-east-1.amazonaws.com/prod/sku",
        {
          method: "PUT",
          body: JSON.stringify(updatedProduct),
        }
      );
      const data = await response.json();
      console.log(data);

      setTableData(
        tableData.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              Sku: newSku,
              Nombre: newNombre,
              Descripcion: newDescripcion,
              Cantidad: newCantidad,
              Ubicacion: newUbicacion,
            };
          }
          return item;
        })
      );
      setSelectedRows([]);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeleteClick(event) {
    event.preventDefault();
    if (!id) {
      alert("Debe seleccionar una fila para eliminar.");
      return;
    }
    const confirmed = window.confirm(
      "¿Está seguro de que desea eliminar el producto seleccionado?"
    );
    if (confirmed) {
      const updatedTableData = tableData.filter((item) => item.id !== id);
      setTableData(updatedTableData);
    }
    try {
      const response = await fetch(
        "https://9yst2eottc.execute-api.us-east-1.amazonaws.com/test",
        {
          method: "PUT",
          body: JSON.stringify({ "ID Interno": id, Eliminado: true }),
        }
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  const filteredData = tableData.filter((row) => !hiddenRows.includes(row));

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
                    <th>Nombre</th>
                    <th>Sku</th>
                    <th>Ubicacion</th>
                    <th>Seleccionar</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(filteredData) &&
                    filteredData.map((row) => (
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
                        <td>{row["Nombre"]}</td>
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
