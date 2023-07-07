import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button, Container, Spinner, Image } from "react-bootstrap";
import CreateBrand from "../components/modals/createBrand";
import CreateDevice from "../components/modals/createDevice";
import EditDevice from "../components/modals/editDevice";
import CreateType from "../components/modals/createType";
import {
  fetchBrands,
  fetchDevices,
  fetchTypes,
  deleteOneDevice,
  editOneDevice,
} from "../http/deviceAPI";
// import DeviceList from "../components/DeviceList";
import ListGroup from "react-bootstrap/ListGroup";
import { Context } from "../index";

const Admin = observer(() => {
  const [loading, setLoading] = useState(true);
  const [brandVisible, setBrandVisible] = useState(false);
  const [typeVisible, setTypeVisible] = useState(false);
  const [deviceVisible, setDeviceVisible] = useState(false);
  const [deviceVisible2, setDeviceVisible2] = useState(false);
  const [data, setData] = useState("");
  const [data2, setData2] = useState("");
  const [result, setResult] = useState("");
  const [id,set$id] = useState(null);
  const { device } = React.useContext(Context);

  device.setLimit(1000);

  const sendData = async () => {
    const response = await fetch("http://localhost:5000/send-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify({ data }) : JSON.stringify({ data2 }),
    });
    const jsonResponse = await response.json();
    console.log("jsonResponse: ", jsonResponse);
    setResult(jsonResponse.result);
  };

  //отрабатывает один раз при переходе по url или на /shop
  React.useEffect(() => {
    fetchTypes().then((data) => device.setTypes(data));

    fetchBrands().then((data) => device.setBrands(data));

    fetchDevices(null, null, device.page, device.limit, device.sort)
      .then((data) => {
        device.setDevices(data.rows);
        device.setTotalCount(data.count);
      })
      .finally(() => setLoading(false));
    console.log("device без фильтров:", device);
  }, [result]);

  if (loading) {
    return <Spinner animation={"border"} variant="secondary" />;
  }

  return (
    <>
      <Container className="d-flex flex-column">
        <Button
          variant={"outline-dark"}
          className="mt-4 pt-2"
          onClick={() => setTypeVisible(true)}
        >
          Добавить тип
        </Button>
        <Button
          variant={"outline-dark"}
          className="mt-4 pt-2"
          onClick={() => setBrandVisible(true)}
        >
          Добавить бренд
        </Button>
        <Button
          variant={"outline-dark"}
          className="mt-4 pt-2 mb-4"
          onClick={() => setDeviceVisible(true)}
        >
          Добавить устройство
        </Button>
        <CreateBrand
          show={brandVisible}
          onHide={() => setBrandVisible(false)}
        />
        <CreateType show={typeVisible} onHide={() => setTypeVisible(false)} />
        <CreateDevice
          show={deviceVisible}
          onHide={() => setDeviceVisible(false)}
        />
        <div>
          <input
            type="text"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
          <button onClick={sendData}>додати товар</button>
        </div>
        <div>
          <input
            type="text"
            value={data2}
            onChange={(e) => setData2(e.target.value)}
          />
          <button onClick={sendData}>додати каталог</button>
        </div>
      </Container>
      {result.name && (
        <>
          <p>Product {result.name} </p>
        </>
      )}
      {/* <DeviceList /> */}
      <ListGroup variant="flush">
        {device.devices.map((device, i) => (
          <div
            className="d-flex justify-content-between"
            style={{ width: "80%", marginLeft: "10%" }}    
            // style={{ cursor: "pointer", width: "70%" }}
            // active={ type.id === device.selectedType.id }
            // action
            // variant="light"
            key={i}
          >
            <NavLink to={`/device/${device.id}`} style={{ width: "90%" }}>
              <ListGroup.Item
                action
                variant="light"
                style={{ cursor: "pointer", width: "100%" }}
                className="d-flex justify-content-between mt-1  mb-1"                
              >
                <div style={{ width: 50, height: 50, overflow: "hidden" }}>
                  <Image
                    style={{
                      objectFit: "contain",
                      width: "100%",
                      height: "100%",
                    }}
                    src={"/" + device.img}
                  />
                </div>
                <span>{device.name}</span>

                {/* <span>&gt;</span> */}
              </ListGroup.Item>
            </NavLink>
            <Button
              variant={"outline-dark"}
              className="mt-4  mb-4"
              onClick={() => {setDeviceVisible2(true); set$id(device.id)}}
            >
              Edit
            </Button>
        
            {/* <Button
              variant={"outline-dark"}
              //відкрити модалку форму, отримати та відобразити повні дані товару щод їх відредагувати, зробити зміни textarea? сабміт відправити
              onClick={() =>
                editOneDevice(device)
                  .then((data) => {
                    console.log(data);
                    setResult({ name: `edited: ${device.name}` });
                  })
                  .finally(() => setLoading(false))
              }
            >
              edit
            </Button>{" "} */}
            <Button
               variant={"outline-dark"}
               className="mt-4  mb-4"
              onClick={() =>
                deleteOneDevice(device.id)
                  .then((data) => {
                    console.log(data);
                    setResult({ name: `deleted: ${device.name}` }); //to reload page
                  })
                  .finally(() => setLoading(false))
              }
            >
              Delete
            </Button>{" "}
          </div>
        ))}
           { id && <EditDevice
              id={id}
              show={deviceVisible2}
              onHide={() => setDeviceVisible2(false)}
            />}
      </ListGroup>
    </>
  );
});

export default Admin;
