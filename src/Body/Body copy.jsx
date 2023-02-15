import React, { useState } from "react";
import { Container, Row, Col, Button, Form, Spinner } from "react-bootstrap";
import Webcam from "react-webcam";
import Listar from "../Listar/Listar";

const Body = () => {
  const [showTab2, setShowTab2] = useState(false);
  const [showListar, setShowListar] = useState(false);
  const [accessingCamera, setAccessingCamera] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  const videoConstraints = {
    facingMode: "environment",
  };

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

  const handleTakePhoto = () => {
    setAccessingCamera(true);
    const imageSrc = webcamRef.current.getScreenshot();
    setAccessingCamera(false);
    setImageSrc(imageSrc);
  };

  const webcamRef = React.useRef(null);

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
          <Form.Group>
            <Webcam
              audio={false}
              height={"100%"}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={"100%"}
              videoConstraints={videoConstraints}
            />
          </Form.Group>
          <Row style={{ marginTop: "50px" }}>
            <Col xs={12} md={12}>
              <Button variant="primary" size="lg" onClick={handleTakePhoto}>
                Tomar foto
              </Button>
            </Col>
          </Row>
          {accessingCamera && (
            <Row style={{ marginTop: "50px" }}>
              <Col xs={12} md={12}>
                <Spinner animation="border" variant="primary" />
              </Col>
            </Row>
          )}
          {imageSrc && (
            <Row style={{ marginTop: "50px" }}>
              <Col xs={12} md={12}>
                <img src={imageSrc} alt="captured" />
              </Col>
            </Row>
          )}
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
