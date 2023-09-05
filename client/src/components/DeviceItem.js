import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Card, Col, Image } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { Context } from "../index";
import star from "../assets/star.png";
import { DEVICE_ROUTE } from "../utils/consts";

const DeviceItem = observer((props) => {
  const { device } = useContext(Context);
  const deviceProps = props.device;
  const history = useHistory();

  return (
    <Col
      className="mt-3"
      md={4}
      onClick={() => history.push(DEVICE_ROUTE + "/" + deviceProps.id)}
    >
      <Card
        className="ml-3"
        style={{ width: 250, height: 400, cursor: "pointer" }}
        border={"light"}
      >
        <div style={{ width: 250, height: 250, overflow: "hidden" }}>
          <Image
            style={{ objectFit: "contain", width: "100%", height: "100%" }}
            src={`${process.env.REACT_APP_API_URL}${deviceProps.img}`}
          />
        </div>
        <div className="text-black-50 mt-3 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <div>
              {device.brands.map((brand, i) => (
                <span key={i}>
                  {brand.id === deviceProps.brandId ? brand.name : ""}
                </span>
              ))}
              &nbsp;
              {device.types.map((type, i) => (
                <span key={i}>
                  {type.id === deviceProps.typeId ? type.name : ""}
                </span>
              ))}
              <span>
                {" "}
                {deviceProps.price
                  ?.toLocaleString("en-GB")
                  .replace(/,/g, " ")}{" "}
                &#x20B4;
              </span>
              &nbsp;
              {/* { deviceProps.rating } */}
            </div>
            {/* <Image width={ 18 } height={ 18 } src={ star } /> */}
          </div>
        </div>
        <div className="mt-1">{deviceProps.name}</div>
      </Card>
    </Col>
  );
});

export default DeviceItem;
