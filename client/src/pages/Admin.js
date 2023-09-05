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
  sendData,
  sendAllData,
} from "../http/deviceAPI";
// import DeviceList from "../components/DeviceList";
import ListGroup from "react-bootstrap/ListGroup";
import { Context } from "../index";
import EditDevicePage from "../components/modals/editDevicePage";
import CreateDeviceByLink from "../components/modals/createDeviceByLink";
import CreatePageDevicesByLink from "../components/modals/createPageDevicesByLink";

const Admin = observer(() => {
  const [loading, setLoading] = useState(true);
  const [brandVisible, setBrandVisible] = useState(false);
  const [typeVisible, setTypeVisible] = useState(false);
  const [deviceVisible, setDeviceVisible] = useState(false);
  const [deviceVisible2, setDeviceVisible2] = useState(false);
  const [deviceByLinkVisible, setDeviceByLinkVisible] = useState(false);
  const [devicesPageByLinkVisible, setDevicesPageByLinkVisible] =
    useState(false);

  const [result, setResult] = useState("");

  const [id, set$id] = useState(null);
  const { device } = React.useContext(Context);

  React.useEffect(() => {
    device.setLimit(1000);
  }, []);

  React.useEffect(() => {
    fetchTypes().then((data) => device.setTypes(data));

    fetchBrands().then((data) => device.setBrands(data));

    fetchDevices(null, null, device.page, device.limit, device.sort)
      .then((data) => {
        device.setDevices(data.rows);
        device.setTotalCount(data.count);
      })
      .finally(() => setLoading(false));
  }, [result]);

  if (loading) {
    return <Spinner animation={"border"} variant="secondary" />;
  }

  return (
    <>
      <Container
        className="d-flex justify-content-between p-3"
        style={{ wwidth: "90%" }}
      >
        <Button
          style={{ width: "19%" }}
          variant={"outline-dark"}
          className="mt-4 pt-2"
          onClick={() => setTypeVisible(true)}
        >
          add type
        </Button>
        <Button
          style={{ width: "19%" }}
          variant={"outline-dark"}
          className="mt-4 pt-2"
          onClick={() => setBrandVisible(true)}
        >
          add brand
        </Button>
        <Button
          style={{ width: "19%" }}
          variant={"outline-dark"}
          className="mt-4 pt-2"
          onClick={() => setDeviceVisible(true)}
        >
          add device
        </Button>
        <Button
          disabled={process.env.REACT_APP_NODE_ENV === "production" ? true : false}
          style={{ width: "19%" }}
          variant={"outline-dark"}
          className="mt-4 pt-2"
          onClick={() => setDeviceByLinkVisible(true)}
        >
          add one device by link
        </Button>
        <Button
          // disabled={process.env.REACT_APP_NODE_ENV === "production" ? true : false}
          style={{ width: "19%" }}
          variant={"outline-dark"}
          className="mt-4 pt-2"
          onClick={() => setDevicesPageByLinkVisible(true)}
        >
          add page devices by link
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
        <CreateDeviceByLink
          show={deviceByLinkVisible}
          onHide={() => setDeviceByLinkVisible(false)}
          setResult={setResult}
        />
        <CreatePageDevicesByLink          
          show={devicesPageByLinkVisible}
          onHide={() => setDevicesPageByLinkVisible(false)}
          setResult={setResult}
        />
      </Container>
      {result?.name && (
        <>
          <p>Product {result?.name} </p>
        </>
      )}
      {/* <DeviceList /> */}
      <ListGroup variant="flush" style={{ width: "90%" }}>
        {device.devices?.map((device, i) => (
          <div
            className="d-flex justify-content-between"
            style={{ width: "90%", marginLeft: "10%" }}
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
                    src={`${process.env.REACT_APP_API_URL}${device?.img}`}
                  />
                </div>
                <span>{device?.name}</span>

                {/* <span><ChevronRight/></span> */}
              </ListGroup.Item>
            </NavLink>
            <Button
              style={{ width: "7%" }}
              variant={"outline-dark"}
              className="mt-4  mb-4"
              onClick={() => {
                setDeviceVisible2(true);
                set$id(device.id);
              }}
            >
              Edit
            </Button>
            <Button
              style={{ width: "7%" }}
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
        {id && (
          <EditDevicePage
            id={id}
            show={deviceVisible2}
            onHide={() => setDeviceVisible2(false)}
          />
        )}
      </ListGroup>
    </>
  );
});

export default Admin;
