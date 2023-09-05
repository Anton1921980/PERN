import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Button, Form } from "react-bootstrap";
import { createBrand, sendData } from "../../http/deviceAPI";
import { observer } from "mobx-react-lite";

const CreateDeviceByLink = observer(({ show, onHide, setResult }) => {
  const [value, setValue] = useState("");

  const addDevice = () => {
    sendData(value).then((data) => {
      setValue("");
      setResult(data);
      onHide();
    });
  };
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Add device by link
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
        <Button variant="outline-success" onClick={addDevice}>
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default CreateDeviceByLink;
