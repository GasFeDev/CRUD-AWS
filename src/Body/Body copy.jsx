/* import React, { useState } from "react";
import { Container, Row, Col, Button, Form, Spinner } from "react-bootstrap";
import Webcam from "react-webcam";
import Listar from "../Listar/Listar";

const Body = () => {
  const [showTab2, setShowTab2] = useState(false);
  const [showListar, setShowListar] = useState(false);
  const [accessingCamera, setAccessingCamera] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  const videoConstraints = {
    facingMode: "user",
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

export default Body; */

import React, { useState } from "react";
import { Container, Row, Col, Button, Form, Spinner } from "react-bootstrap";
import Webcam from "react-webcam";
import Listar from "../Listar/Listar";
import "./Body.css";

const Body = () => {
  const [showTab2, setShowTab2] = useState(false);
  const [showListar, setShowListar] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const webcamRef = React.useRef(null);
  const [sku, setSku] = useState("");
  const [item, setItem] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [captured, setCaptured] = useState(false);

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
      sku.trim() !== "" &&
      item.trim() !== "" &&
      descripcion.trim() !== "" &&
      captured
    );
  };

  const handleSkuChange = (event) => {
    setSku(event.target.value);
  };

  const handleItemChange = (event) => {
    setItem(event.target.value);
  };

  const handleDescripcionChange = (event) => {
    setDescripcion(event.target.value);
  };

  const [imgSrc, setImgSrc] = useState(null);

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
          <Form className="mt-5">
            <Form.Group>
              <Form.Control
                as="textarea"
                rows={2}
                type="text"
                placeholder="Cantidad en almacen"
                className="textarea"
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                as="textarea"
                rows={2}
                type="text"
                placeholder="Location Shelves"
                className="textarea"
              />
            </Form.Group>
          </Form>
        </div>
      ) : (
        <Form className="mt-5">
          <Form.Group>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="SKU"
              className="textarea"
              value={sku}
              onChange={handleSkuChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Item"
              className="textarea"
              value={item}
              onChange={handleItemChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Descripción"
              className="textarea"
              value={descripcion}
              onChange={handleDescripcionChange}
            />
          </Form.Group>

          <Row style={{ marginTop: "50px" }}>
            <Col xs={12} md={12}>
              <Button variant="primary" size="lg" disabled={!canSave()}>
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
