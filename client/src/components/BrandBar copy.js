import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { Context } from "../index";
import { Card } from "react-bootstrap";
import Badge from 'react-bootstrap/Badge';
import "../scss/styles.scss";

const BrandBar = observer((props) => {
  const { device } = useContext(Context);
  console.log("device:brandbar ", device);

  return (
    <div className="d-flex flex-direction-row flex-wrap ">
      {device.brands.map((brand, i) => (
        <Card
          key={i}
          style={{ cursor: "pointer" }}
          // style={ brand.id === device.selectedBrand.id ? { cursor: 'pointer', borderBottom: '2px solid black' } : { cursor: 'pointer', borderBottom: '2px solid white' } }
          border={brand.id === device.selectedBrand.id ? "secondary" : "light"}
        >
         { brand.id === device.selectedBrand.id ? (
            <div
              className="p-2"
              onClick={() => {
                device.setSelectedBrand("");
              }}               
            >
              {" "}
              {brand.name}  
              {props?.productCountPerBrand && (
                  <Badge bg="secondary" text="dark" pill>{props.productCountPerBrand[brand.id] || ""}</Badge>)}    
              </div>
          ) : (
            <div
              className="p-2"
              onClick={() => {
                device.setSelectedBrand(brand);               
              }}
            >
              {" "}
              {brand.name}
              {props?.productCountPerBrand && (
                  <Badge bg="secondary" text="dark" pill>{props.productCountPerBrand[brand.id] || ""}</Badge>)}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
});

export default BrandBar;
