import React, {useState} from 'react';
import Modal from "react-bootstrap/Modal";
import {Button, Form} from "react-bootstrap";
import {sendAllData} from "../../http/deviceAPI";
import { observer } from 'mobx-react-lite';

const CreatePageDevicesByLink = observer(({show, onHide, setResult}) => {
    const [value, setValue] = useState('')
  
    const addPageDevices = () => {
        sendAllData(value).then(data => {
            console.log('data',data)
            setValue('')
            setResult(data)
            onHide()
        })
    }
    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Add page devices by link
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder={"add device link from rozetka"}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>X</Button>
                <Button variant="outline-success" onClick={addPageDevices}>Add</Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CreatePageDevicesByLink;