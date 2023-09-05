import React, { useContext, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import {
  Button,
  Dropdown,
  Form,
  Row,
  Col,
  Card,
  Container,
  Image,
} from "react-bootstrap";
import { Context } from "../../index";
import {
  editOneDevice,
  fetchBrands,
  fetchDevices,
  fetchTypes,
  fetchOneDevice,
} from "../../http/deviceAPI";
import { observer } from "mobx-react-lite";

const EditDevicePage = observer(({ show, onHide, id }) => {
  const { device } = useContext(Context);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [brandId, setBrandId] = useState("choose Brand");
  const [typeId, setTypeId] = useState("choose Type");
  const [file, setFile] = useState(null);
  const [info, setInfo] = useState([]);
  const [infoOldDeleted, setInfoOldDeleted] = useState([]);
  const [device2, set$device2] = useState({ info: [] });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchOneDevice(id).then((data) => {
      set$device2(data);
      setInfo(data.info);
      setName(data.name);
      setPrice(data.price);
      setBrandId(data.brandId);
      setTypeId(data.typeId);
    });
  }, [id]);

  useEffect(() => {
    fetchTypes().then((data) => device.setTypes(data));
    fetchBrands().then((data) => device.setBrands(data));
  }, [show]); //[show] обновляем бренды и типы при их добавлении перед товаром

  const addInfo = () => {
    setInfo([...info, { title: "", description: "", number: Date.now() }]);
  };
  const removeInfo = (num) => {
    let oldInfo = info.find(({ id }) => id == num);
    if (oldInfo) {
      oldInfo.delete = true;
      infoOldDeleted.push(oldInfo);
      setInfoOldDeleted(infoOldDeleted);
    }

    setInfo(info.filter((i) => (i.number || i.id) != num));
  };
  const changeInfo = (key, value, num) => {
    setInfo(
      info.map((i) => ((i.number || i.id) == num ? { ...i, [key]: value } : i))
    );
  };

  const selectFile = (e) => {
    setFile(e.target.files[0]);
    setPreviewImage(URL.createObjectURL(e.target.files[0]));
  };

  const addDevice = () => {
    const formData = new FormData();
    try {
      formData.append("name", name);
      formData.append("price", `${price}`);
      formData.append("img", file);
      formData.append("brandId", device.selectedBrands.id);
      formData.append("typeId", device.selectedType.id);
      formData.append("info", JSON.stringify([...info, ...infoOldDeleted]));
      editOneDevice(formData, id).then((data) => onHide());
      //якщо є видалення старого інфо
    } catch (error) {
      alert(error);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header
      // closeButton
      >
        <Modal.Title id="contained-modal-title-vcenter">
          Edit device
        </Modal.Title>
        <Button variant="outline-danger" onClick={onHide}>
          X
        </Button>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Dropdown className="mt-2 mb-2">
            <Dropdown.Toggle>
              {device.selectedType.name ||
                device.types.filter((type) => type.id === typeId)[0]?.name}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {device.types.map((type) => (
                <Dropdown.Item
                  onClick={() => device.setSelectedType(type)}
                  key={type.id}
                >
                  {type.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown className="mt-2 mb-2">
            <Dropdown.Toggle>
              {device.selectedBrands.name ||
                device.brands.filter((brand) => brand.id === brandId)[0]?.name}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {device.brands.map((brand) => (
                <Dropdown.Item
                  onClick={() => device.setSelectedBrands(brand)}
                  key={brand.id}
                >
                  {brand.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-3"
            // placeholder="Введите название"
          />
          <Form.Control
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="mt-3"
            // placeholder="Введите цену"
            // type="number"
          />
          <Form.Control className="mt-3" type="file" onChange={selectFile} />

          <div style={{ width: "30%", overflow: "hidden" }}>
            <Image
              style={{ objectFit: "contain", width: "70%" }}
              src={
                previewImage ||
                `${process.env.REACT_APP_API_URL}${device2?.img}`
              }
            />
          </div>

          <hr />
          <h1>Properties:</h1>
          <Button variant={"outline-dark"} onClick={addInfo}>
            Add new property
          </Button>
          {/* {info.map((i) => (
            <Row className="mt-4" key={i.number}>
              <Col md={4}>
                <Form.Control
                  value={i.title}
                  onChange={(e) =>
                    changeInfo("title", e.target.value, i.number)
                  }
                  placeholder="name"
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  value={i.description}
                  onChange={(e) =>
                    changeInfo("description", e.target.value, i.number)
                  }
                  placeholder="description"
                />
              </Col>
              <Col md={4}>
                <Button
                  onClick={() => removeInfo(i.number)}
                  variant={"outline-danger"}
                >
                  Delete
                </Button>
              </Col>
            </Row>
          ))} */}
        </Form>

        <Container>
          <Row className="d-flex flex-column m-3">
            {info.map((i) => (
              <Row className="mt-4" key={i.id || i.number}>
                <Col md={4}>
                  <Form.Control
                    value={i.title}
                    onChange={(e) =>
                      changeInfo("title", e.target.value, i.id || i.number)
                    }
                    placeholder="name"
                  />
                </Col>
                <Col md={4}>
                  <Form.Control
                    value={i.description}
                    onChange={(e) =>
                      changeInfo(
                        "description",
                        e.target.value,
                        i.id || i.number
                      )
                    }
                    placeholder="description"
                  />
                </Col>
                <Col md={4}>
                  <Button
                    onClick={() => removeInfo(i.id || i.number)}
                    variant={"outline-danger"}
                  >
                    Delete
                  </Button>
                </Col>
              </Row>

              // <Row
              //   key={i}
              //   style={{
              //     background: index % 2 === 0 ? "lightgrey" : "transparent",
              //     padding: 5,
              //   }}
              // >
              //   {info.title}:{info.description}
              // </Row>
            ))}
          </Row>
        </Container>
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

export default EditDevicePage;
//
