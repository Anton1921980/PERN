import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { Button, Container, Spinner } from "react-bootstrap";
import CreateBrand from "../components/modals/createBrand";
import CreateDevice from "../components/modals/createDevice";
import CreateType from "../components/modals/createType";
import { fetchBrands, fetchDevices, fetchTypes } from "../http/deviceAPI";
import DeviceList from "../components/DeviceList";
import ListGroup from "react-bootstrap/ListGroup";
import { Context } from "../index";

const Admin = observer(() => {
  const [loading, setLoading] = useState(true);
  const [brandVisible, setBrandVisible] = useState(false);
  const [typeVisible, setTypeVisible] = useState(false);
  const [deviceVisible, setDeviceVisible] = useState(false);

  const [data, setData] = useState("");
  const [data2, setData2] = useState("");
  const [result, setResult] = useState("");
  const { device } = React.useContext(Context);
  device.setLimit( 1000 );

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
          <h3>Result</h3>
          <p>product {result.name} added successfully</p>
        </>
      )}
      {/* <DeviceList /> */}
      <ListGroup variant='flush'>
            {device.devices.map( ( device, i )=>
                <ListGroup.Item
                    style={ { cursor: 'pointer' } }
                    // active={ type.id === device.selectedType.id }
                    action variant="light"
                    key={ i }>
                  
                        <div className='d-flex justify-content-between'
                            // onClick={ () => { device.setSelectedType( type ); device.setSelectedBrand( '' ); setChosen( true ) } }
                        > <span>{ device.name }</span><span>&gt;</span>
                        </div>
                       
                    

                </ListGroup.Item>
            ) }
        </ListGroup>

    </>
  );
});

export default Admin;
