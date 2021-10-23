import React, { useContext, useState } from 'react';
import Modal from "react-bootstrap/Modal";
import { Form, Button, Dropdown, FormControl, Row, Col } from "react-bootstrap";
import { Context } from '../../';
import DropdownToggle from 'react-bootstrap/esm/DropdownToggle';
import DropdownMenu from 'react-overlays/esm/DropdownMenu';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';


const CreateDevice = ( { show, onHide } ) =>
{
    const { device } = useContext( Context )
    const [ value, setValue ] = useState( '' )
    const [ info, setInfo ] = useState( [] )
    const addDevice = () =>
    {
        // createType({name: value}).then(data => {
        //     setValue('')
        //     onHide()
        // })
    }
    const addInfo = () =>
    {
        setInfo( [ ...info, { title: '', description: '', number: Date.now() } ] )
    }
    const removeInfo = (number) =>
    {
        setInfo(info.filter(i=>i.number !==number) )
    }
    return (
        <Modal
            show={ show }
            onHide={ onHide }
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Добавить устройство
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {/* <Form.Control
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder={"Введите название устройства"}
                    /> */}
                    <Dropdown className='mt-3' >
                        <DropdownToggle>Выберите тип</DropdownToggle>
                        <Dropdown.Menu>
                            { device.types.map( type =>
                                <Dropdown.Item
                                    onClick={ () => device.setSelectedType( type ) }
                                    key={ type.id }
                                >
                                    { type.name }
                                </Dropdown.Item>
                            ) }
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown className='mt-3'>
                        <DropdownToggle>Выберите бренд</DropdownToggle>
                        <Dropdown.Menu>
                            { device.brands.map( brand =>
                                <Dropdown.Item
                                    onClick={ () => device.setSelectedBrand( brand ) }
                                    key={ brand.id }
                                >
                                    { brand.name }
                                </Dropdown.Item>
                            ) }
                        </Dropdown.Menu>
                    </Dropdown>
                    <Form.Control
                        className='mt-3'
                        placeholder='введите название устройства' />
                    <Form.Control
                        className='mt-3'
                        placeholder='введите цена устройства'
                        type='number' />
                    <Form.Control
                        className='mt-3'
                        placeholder='введите фото устройства'
                        type='file' />
                    <hr />
                    <Button
                        variant={ 'outline-dark' }
                        onClick={ addInfo }
                    >
                        Добавить новое свойство
                    </Button>
                    { info.map( i =>
                        <Row className='mt-4' key={ i.number }>
                            <Col md={ 4 }>
                                <FormControl
                                    placeholder='название свойства'
                                />

                            </Col>
                            <Col md={ 4 }>
                                <FormControl
                                    placeholder='описание свойства'
                                />

                            </Col>
                            <Col md={ 4 }>
                                <Button 
                                onClick={()=>{removeInfo(i.number)}}
                                variant={ 'outline-danger' }>
                                    Удалить
                                </Button>

                            </Col>
                        </Row>
                    ) }
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={ onHide }>Закрыть</Button>
                <Button variant="outline-success" onClick={ addDevice }>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateDevice;