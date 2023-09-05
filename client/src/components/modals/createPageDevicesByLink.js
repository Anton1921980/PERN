import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Button, Col, Container, Form } from "react-bootstrap";
import { sendAllData } from "../../http/deviceAPI";
import { observer } from "mobx-react-lite";

const CreatePageDevicesByLink = observer(({ show, onHide, setResult }) => {
  const [value, setValue] = useState("");
  const [playing, setPlaying] = useState(false);

  const handleClick = () => {
    !playing ? setPlaying(true) : setPlaying(false);
    setTimeout(() => setPlaying(true), 1000);
  };

  const addPageDevices = () => {
    sendAllData(value).then((data) => {
      setValue("");
      setResult(data);
      onHide();
    });
  };
  return (
    <Modal show={show} onHide={onHide} centered>
      {process.env.NODE_ENV !== "production" ? (
        <>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Add page devices by link
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Control
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={"add device link from rozetka"}
              />
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-danger" onClick={onHide}>
              X
            </Button>
            <Button variant="outline-success" onClick={addPageDevices}>
              Add
            </Button>
          </Modal.Footer>
        </>
      ) : (
        <Container
          className={`
  
       d-flex flex-column flex-lg-row mt-3`}
        >
          <Col className="col-12 ">
            <div style={{ cursor: "pointer" }} onClick={handleClick}>
              {playing ? (
                <video
                  width="100%"
                  height="100%"
                  autoPlay
                  onEnded={() => setPlaying(false)}
                >
                  <source
                    src={`${process.env.REACT_APP_API_URL}parser.mp4`}
                    type="video/mp4"
                  />
                  Sorry, your browser does not support video tags
                </video>
              ) : (
                <img
                  src={`${process.env.REACT_APP_API_URL}parser-thumb.jpg`}
                  alt="placeholder"
                  width="100%"
                  height="100%"
                />
              )}
            </div>
          </Col>
        </Container>
      )}
    </Modal>
  );
});

export default CreatePageDevicesByLink;
