import React, { useState } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import Webcam from "react-webcam";
import Listar from "../Listar/Listar";

const Body = () => {
  const [showTab2, setShowTab2] = useState(false);
  const [showListar, setShowListar] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const webcamRef = React.useRef(null);

  const toggleTab2 = () => {
    setShowTab2(true);
    setShowListar(false); // se oculta el componente Listar si se estaba mostrando
  };

  const toggleTab1 = () => {
    setShowTab2(false);
    setShowListar(false); // se oculta el componente Listar si se estaba mostrando
  };

  const toggleListar = () => {
    setShowListar(!showListar);
  };

  const takePicture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

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
        <Form className="mt-5">
          <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
          <Button variant="primary" size="lg" onClick={takePicture}>
            Tomar foto
          </Button>
          {capturedImage && (
            <img
              src={capturedImage}
              alt="captured"
              style={{ marginTop: "10px" }}
            />
          )}
          <Form.Group>
            <Form.Control
              as="textarea"
              rows={3}
              type="text"
              placeholder="Cantidad en almacen"
            />
          </Form.Group>
          <Form.Group>
            <Form.Control
              as="textarea"
              rows={3}
              type="text"
              placeholder="Location Shelves"
            />
          </Form.Group>
          <Row style={{ marginTop: "50px" }}>
            <Col xs={12} md={12}>
              <Button variant="primary" size="lg">
                Guardar
              </Button>
            </Col>
          </Row>
        </Form>
      ) : (
        <Form className="mt-5">
          <Form.Group>
            <Form.Control as="textarea" rows={3} placeholder="SKU" />
          </Form.Group>
          <Form.Group>
            <Form.Control as="textarea" rows={3} placeholder="Item" />
          </Form.Group>
          <Form.Group>
            <Form.Control as="textarea" rows={3} placeholder="Descripción" />
          </Form.Group>
          <Row style={{ marginTop: "50px" }}>
            <Col xs={12} md={12}>
              <Button variant="primary" size="lg">
                Guardar
              </Button>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <Button variant="outline-primary" onClick={toggleListar}>
                Listar
              </Button>
            </Col>
            <Col>
              <Button variant="outline-secondary" onClick={toggleListar}>
                Editar
              </Button>
            </Col>
            <Col>
              <Button variant="outline-danger" onClick={toggleListar}>
                Eliminar
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </Container>
  );
};

export default Body;
