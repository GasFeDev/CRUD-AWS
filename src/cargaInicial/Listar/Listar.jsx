import React, { useState, useEffect } from "react";
import { Container, Button, Table } from "react-bootstrap";
import "./Listar.css";
import swal from "sweetalert";

const Listar = () => {
  const [, setId] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [, setSelectedRows] = useState([]);
  const [hiddenRows] = useState(
    JSON.parse(localStorage.getItem("hiddenRows")) || []
  );
  const [loading, setLoading] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [editedRows, setEditedRows] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [, setIsMobileView] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  const handleWindowResize = () => {
    setIsMobileView(window.innerWidth <= 768);
  };

  useEffect(() => {
    handleWindowResize();
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

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
            setShouldRefresh(false);
          });
        console.log(response);
      } catch (error) {
        swal(error);
      }
      setLoading(false);
    };

    getSkus();
  }, [shouldRefresh]);

  useEffect(() => {
    localStorage.setItem("hiddenRows", JSON.stringify(hiddenRows));
  }, [hiddenRows]);

  async function handleEditClick(event, id, row) {
    event.preventDefault();
    if (!id) {
      swal("Debe seleccionar una fila para editar.");
      return;
    }

    setSelectedRowId(id);
    setEditMode(true);

    const editedProduct = {
      Sku: row["Sku"],
      Nombre: row["Nombre"],
      Descripcion: row["Descripcion"],
      Cantidad: row["Cantidad"],
      Ubicacion: row["Ubicacion"],
      "ID Interno": id,
    };

    if (editedRows.includes(id)) {
      try {
        const response = await fetch(
          "https://528676oyjb.execute-api.us-east-1.amazonaws.com/prod/sku",
          {
            method: "PUT",
            body: JSON.stringify(editedProduct),
          }
        );
        const data = await response.json();
        console.log(data);

        setEditedRows(editedRows.filter((rowId) => rowId !== id));
        swal("La fila se ha editado exitosamente");
        setEditMode(false);
        setSelectedRowId(null);
      } catch (error) {
        console.error(error);
      }
    } else {
      setEditedRows([...editedRows, id]);
      swal("Luego de editar haga clic en 'Enviar'");
    }
  }

  async function handleEditCellClick(event, id, column, value) {
    event.preventDefault();
    if (!id) {
      swal("Debe seleccionar una fila para editar.");
      return;
    }

    if (!editMode) {
      return; // no hacer nada si la edición no está habilitada
    }

    setSelectedRowId(id);

    const editedProduct = {};

    const newValue = prompt(`Introduce el nuevo valor para ${column}:`, value);
    if (newValue !== null) {
      editedProduct[column] = newValue;
    } else {
      // Si el usuario cancela el prompt, no se hace nada
      return;
    }

    editedProduct["ID Interno"] = id;

    try {
      // Actualizar la información de la tabla con la celda editada
      setTableData(
        tableData.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              ...editedProduct,
            };
          }
          return item;
        })
      );
      setEditedRows([...editedRows, id]);
    } catch (error) {
      swal(error);
    }
  }

  async function handleDeleteClick(event, productId) {
    event.preventDefault();
    if (!productId) {
      swal("Debe seleccionar una fila para eliminar.");
      return;
    }
    const confirmed = window.confirm(
      "¿Está seguro de que desea eliminar el producto seleccionado?"
    );
    if (confirmed) {
      const updatedTableData = tableData.filter(
        (item) => item.id !== productId
      );
      setTableData(updatedTableData);
      setSelectedRows([]);
      setId(null); // agregamos esta línea para que la variable id se actualice correctamente
    }
    try {
      const response = await fetch(
        "https://9yst2eottc.execute-api.us-east-1.amazonaws.com/test",
        {
          method: "PUT",
          body: JSON.stringify({ "ID Interno": productId, Eliminado: true }),
        }
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      swal(error);
    }
  }

  function handleBackClick() {
    setEditMode(false);
    setSelectedRowId(null);
    setEditedRows([]);
    setShouldRefresh(true);
  }

  const filteredData = selectedRowId
    ? tableData.filter((row) => row.id === selectedRowId)
    : tableData.filter((row) => !hiddenRows.includes(row));

  return (
    <Container fluid className="container">
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          {showTable ? (
            <>
              <Table
                responsive
                striped
                bordered
                hover
                className={editMode ? "table-mobile" : ""}
              >
                <thead>
                  <tr>
                    <th>Sku</th>
                    <th>Nombre</th>
                    {editedRows.length > 0 && (
                      <>
                        <th>Descripcion</th>
                        <th>Cantidad</th>
                        <th>Ubicacion</th>
                        <th className="encabezados">Foto</th>
                      </>
                    )}
                    <th>Seleccionar</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(filteredData) &&
                    filteredData.map((row) => (
                      <tr
                        key={row.id}
                        className={row.id === selectedRowId ? "" : "hidden"}
                      >
                        <td
                          onClick={(event) =>
                            handleEditCellClick(
                              event,
                              row.id,
                              "Sku",
                              row["Sku"]
                            )
                          }
                        >
                          {row["Sku"]}
                        </td>
                        <td
                          onClick={(event) =>
                            handleEditCellClick(
                              event,
                              row.id,
                              "Nombre",
                              row["Nombre"]
                            )
                          }
                        >
                          {row["Nombre"]}
                        </td>
                        {editedRows.includes(row.id) && (
                          <>
                            <td
                              onClick={(event) =>
                                handleEditCellClick(
                                  event,
                                  row.id,
                                  "Descripcion",
                                  row["Descripcion"]
                                )
                              }
                            >
                              {row["Descripcion"]}
                            </td>
                            <td
                              onClick={(event) =>
                                handleEditCellClick(
                                  event,
                                  row.id,
                                  "Cantidad",
                                  row["Cantidad"]
                                )
                              }
                            >
                              {row["Cantidad"]}
                            </td>

                            <td
                              onClick={(event) =>
                                handleEditCellClick(
                                  event,
                                  row.id,
                                  "Ubicacion",
                                  row["Ubicacion"]
                                )
                              }
                            >
                              {row["Ubicacion"]}
                            </td>

                            <td>
                              <>
                                <img
                                  src={row["Foto"]}
                                  alt="Imagen de producto"
                                  className="foto"
                                  onClick={() =>
                                    navigator.clipboard.writeText(row["Foto"])
                                  }
                                />
                              </>
                            </td>
                          </>
                        )}
                        <td className="button-container">
                          <Button
                            variant="primary"
                            size="sm"
                            type="submit"
                            onClick={(event) =>
                              handleEditClick(event, row.id, row)
                            }
                          >
                            {editMode ? "Enviar" : "Editar"}
                          </Button>{" "}
                          {!editMode && (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={(e) => handleDeleteClick(e, row.id)}
                            >
                              Eliminar
                            </Button>
                          )}
                          {editMode && (
                            <Button
                              variant="secondary"
                              size="sm"
                              className="mr-2"
                              onClick={() => {
                                setEditMode(false);
                                setSelectedRowId(null);
                                handleBackClick();
                              }}
                            >
                              Regresar
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
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
