import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Button, Col, Container, Form } from "react-bootstrap";
import { sendAllData } from "../../http/deviceAPI";
import { observer } from "mobx-react-lite";
import ParserVideo from "../ParserVideo";

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
        <ParserVideo
          playing={playing}
          handleClick={handleClick}
          setPlaying={setPlaying}
        />
      )}
    </Modal>
  );
});

export default CreatePageDevicesByLink;
