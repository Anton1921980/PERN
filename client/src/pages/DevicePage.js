import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";
import bigStar from "../assets/bigStar.png";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import {
  fetchBrands,
  fetchOneDevice,
  fetchTypes,
  addtoBasket,
  getBasket,
} from "../http/deviceAPI";

const DevicePage = observer(() => {
  const { user, device } = useContext(Context);

  useEffect(() => {
    fetchTypes().then((data) => device.setTypes(data));
    fetchBrands().then((data) => device.setBrands(data));
  }, []);

  const [deviceCurrent, set$deviceCurrent] = useState({ info: [] }); 
  const { id } = useParams();

  useEffect(() => {
    fetchOneDevice(id).then((data) => set$deviceCurrent(data));
  }, []);

  const add = async () => {
    const formData = new FormData();
    await formData.append("deviceId", id);
    await addtoBasket(formData);
    await getBasket().then((data) => device.setBaskets(data));
  };

  const addLocal = async () => {
    const arr = JSON.parse(localStorage.getItem("ids")) || [];
    const ids = [...arr, id];
    localStorage.setItem("ids", JSON.stringify(ids));
    device.setLocalBasket(JSON.parse(localStorage.getItem("ids")).length);
  };

  return (
    <Container>
      <Row className="mt-3">
        <Col md={3}>
          <div style={{ width: "100%", overflow: "hidden" }}>
            <Image
              style={{ objectFit: "contain", width: "70%" }}
              src={`${process.env.REACT_APP_API_URL}${deviceCurrent.img}`}
            />
          </div>
        </Col>
        <Col md={9}>
          <div className="d-flex flex-column">
            <h2>
              {deviceCurrent.name}&nbsp;
              <div style={{ color: "lightgrey" }}>
                {device.brands.map((brand, i) => (
                  <span key={i}>
                    {brand.id === deviceCurrent.brandId ? brand.name : ""}
                  </span>
                ))}
                &nbsp;
                {device.types.map((type, i) => (
                  <span key={i}>
                    {type.id === deviceCurrent.typeId ? type.name : ""}
                  </span>
                ))}
              </div>
            </h2>
            <div className="d-flex flex-row">
              <Card
                className="d-flex flex-row align-items-center justify-content-around"
                style={{
                  width: "100%",
                  height: 120,
                  fontSize: 32,
                  border: "1px solid lightgrey",
                }}
              >
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    background: `url(${bigStar}) no-repeat center center`,
                    width: 80,
                    height: 80,
                    backgroundSize: "cover",
                    fontSize: 24,
                  }}
                >
                  {deviceCurrent.rating}
                </div>
                <h3>{deviceCurrent.price?.toLocaleString("en-GB").replace(/,/g, " ")} &#x20B4;</h3>

                <Button
                  variant={"outline-dark"}
                  onClick={user.isAuth ? add : addLocal}
                >
                  Add to Basket
                </Button>
              </Card>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="d-flex flex-column m-3">
        <h1>Properties:</h1>
        {deviceCurrent.info.map((info, index) => (
          <Row
            key={index}
            style={{
              background: index % 2 === 0 ? "lightgrey" : "transparent",
              padding: 5,
            }}
          >
            {info.title}:{info.description}
          </Row>
        ))}
      </Row>
    </Container>
  );
});

export default DevicePage;
