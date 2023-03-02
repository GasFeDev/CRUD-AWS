import React, { useState } from "react";
import { Container, Row, Col, Button, Form, Spinner } from "react-bootstrap";
import Webcam from "react-webcam";
import Listar from "../Listar/Listar";
import swal from "sweetalert";
import "./Body.css";

const Body = () => {
  const [showTab2, setShowTab2] = useState(false);
  const [showListar, setShowListar] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const webcamRef = React.useRef(null);
  const [Sku, setSku] = useState("");
  const [Nombre, setNombre] = useState("");
  const [Descripcion, setDescripcion] = useState("");
  const [Cantidad, setCantidad] = useState("");
  const [Ubicacion, setUbicacion] = useState("");
  const [captured, setCaptured] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);

  const [, setResponseText] = useState("");
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSaveData = () => {
    if (Cantidad.trim() !== "" && Ubicacion.trim() !== "" && captured) {
      setShowConfirmationMessage(true);
    }
    if (canSave()) {
      submitMessage();
    }
    if (confirmationMessage) {
      swal("Su producto ha sido guardado correctamente");
    }
  };

  const toggleTab2 = () => {
    setShowTab2(true);
    setShowListar(false);
  };

  const toggleTab1 = () => {
    setShowTab2(false);
    setShowListar(false);
  };

  const toggleListar = () => {
    setShowListar(!showListar);
  };

  const capture = React.useCallback(() => {
    setCapturing(true);
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturing(false);
    setShowListar(false);
    setShowTab2(true);
    setImgSrc(imageSrc);
    setCaptured(true);
  }, [webcamRef]);

  const canSave = () => {
    return (
      Sku.trim() !== "" &&
      Nombre.trim() !== "" &&
      Descripcion.trim() !== "" &&
      Cantidad.trim() !== "" &&
      Ubicacion.trim() !== "" &&
      captured
    );
  };

  const handleSkuChange = (event) => {
    setSku(event.target.value);
  };

  const handleNombreChange = (event) => {
    setNombre(event.target.value);
  };

  const handleDescripcionChange = (event) => {
    setDescripcion(event.target.value);
  };

  const handleCantidadChange = (event) => {
    setCantidad(event.target.value);
    if (event.target.value.trim() === "") {
      setShowConfirmationMessage(false);
    }
    const input = event.target.value;
    const regex = /^[0-9]*$/;

    if (regex.test(input)) {
      setCantidad(input);
      setShowConfirmationMessage(false);
    } else {
      setCantidad("");
      setShowConfirmationMessage(false);
      swal("Ingrese un número válido");
    }
  };

  const handleUbicacionChange = (event) => {
    setUbicacion(event.target.value);
    if (event.target.value.trim() === "") {
      setShowConfirmationMessage(false);
    }
  };

  async function submitMessage(event) {
    event.preventDefault();
    try {
      setSubmitting(true);
      const response = await fetch(
        "https://528676oyjb.execute-api.us-east-1.amazonaws.com/prod/sku",
        {
          method: "POST",
          body: JSON.stringify({
            Cantidad: Cantidad,
            Descripcion: Descripcion,
            Nombre: Nombre,
            Sku: Sku,
            Ubicacion: Ubicacion,
            Foto: imgSrc,
          }),
        }
      );
      const data = await response.json();
      const text = JSON.stringify(data);
      setResponseText(text);
      setShowConfirmationMessage(false);
      setSubmitting(false);
      setConfirmationMessage(true);
      console.log(text);
    } catch (error) {
      setSubmitError(true);
      console.error(error);
    }
  }

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <Button variant="outline-secondary" onClick={toggleTab1}>
            Tab1
          </Button>
        </Col>
        <Col className="text-right">
          <Button variant="outline-secondary" onClick={toggleTab2}>
            Tab2
          </Button>
        </Col>
      </Row>
      {showListar ? (
        <Listar />
      ) : showTab2 ? (
        <div>
          <div style={{ marginTop: "50px" }}>
            {imgSrc ? (
              <img src={imgSrc} alt="captured" />
            ) : (
              <>
                {capturing ? (
                  <Spinner animation="border" role="status" />
                ) : (
                  <div>
                    <Webcam
                      className="photo-container"
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={{
                        facingMode: "environment",
                      }}
                    />
                    <Button variant="primary" onClick={capture}>
                      Tomar foto
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
          <Form className="mt-5" onSubmit={submitMessage}>
            <Form.Group>
              <Form.Control
                as="textarea"
                rows={2}
                type="number"
                min="0"
                step="1"
                placeholder="Cantidad en almacen"
                className="textarea"
                id="Cantidad"
                value={Cantidad}
                onChange={handleCantidadChange}
                onBlur={handleSaveData}
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                as="textarea"
                rows={2}
                type="text"
                placeholder="Ubicación"
                className="textarea"
                id="Ubicacion"
                value={Ubicacion}
                onChange={handleUbicacionChange}
                onBlur={handleSaveData}
              />
            </Form.Group>
            {showConfirmationMessage && (
              <div className="alert alert-success">
                Los datos en Tab2 se han guardado correctamente, haga click en
                Tab1 para finalizar con el proceso de almacenado.
              </div>
            )}
          </Form>
        </div>
      ) : (
        <Form className="mt-5" onSubmit={submitMessage}>
          <Form.Group>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Código"
              className="textarea"
              id="Sku"
              value={Sku}
              onChange={handleSkuChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Nombre Item"
              className="textarea"
              id="Nombre"
              value={Nombre}
              onChange={handleNombreChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Descripción"
              className="textarea"
              id="Descripcion"
              value={Descripcion}
              onChange={handleDescripcionChange}
            />
          </Form.Group>
          <Row style={{ marginTop: "50px" }}>
            <Col xs={12} md={12}>
              <Button
                variant="primary"
                size="lg"
                disabled={!canSave() || submitting}
                type="submit"
                value="Submit"
              >
                Guardar
              </Button>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <Button variant="outline-primary" onClick={toggleListar}>
                Listado
              </Button>
            </Col>
            <Col>
              <Button variant="outline-secondary" onClick={toggleListar}>
                Editar
              </Button>
            </Col>
          </Row>
          {submitError && (
            <div className="text-danger mb-3">
              El producto no se ha guardado, por favor vuelva a intentarlo
            </div>
          )}
        </Form>
      )}
    </Container>
  );
};

export default Body;
