import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { Context } from "../index";
import { Badge, Card, Accordion, useAccordionButton } from "react-bootstrap";

import "../scss/styles.scss";

function CustomToggle({ eventKey, isOpen, onToggle, expand }) {
  const decoratedOnClick = useAccordionButton(eventKey, () =>
    console.log("totally custom!", isOpen)
  );
  return (
    <div
      style={{
        marginLeft: "15px",
        cursor: "pointer",
        transform: `rotate(${
          expand !== false
            ? isOpen
              ? "270deg"
              : "90deg"
            : isOpen
            ? "0deg"
            : "180deg"
        })`,
        transition: "transform 0.3s ease",
      }}
      onClick={() => {
        onToggle && onToggle(eventKey);
        expand !== false && decoratedOnClick();
      }}
    >
      &gt;
    </div>
  );
}

const BrandBar = observer((props) => {
  const { device } = useContext(Context);
  const [isOpenMap, set$isOpenMap] = useState({});

  // Function to toggle the isOpen state for a specific category
  const toggleCategory = (typeId) => {
    set$isOpenMap((prevIsOpenMap) => ({
      ...prevIsOpenMap,
      [typeId]: !prevIsOpenMap[typeId],
    }));
  };

  return (
    <>
      <Accordion defaultActiveKey="0">
        <Card>
          <Card.Header
            style={{ display: "flex", justifyContent: "space-around" }}
          >
            <CustomToggle
              eventKey="888"
              isOpen={isOpenMap[888]}
              onToggle={toggleCategory}
            >
              &gt;
            </CustomToggle>
            <span style={{ width: "50%" }}>Brands</span>
            <span
              style={{ marginLeft: "15px", cursor: "pointer" }}
              onClick={() => {
                device.setSelectedType("");
                device.setSelectedBrand("");
              }}
            >
              &gt;
            </span>
          </Card.Header>
          <Accordion.Collapse eventKey="888">
            <Card.Body>
              {device.brands.map((brand, i) => (
                <Card
                  key={i}
                  style={{ cursor: "pointer" }}
                  // style={ brand.id === device.selectedBrand.id ? { cursor: 'pointer', borderBottom: '2px solid black' } : { cursor: 'pointer', borderBottom: '2px solid white' } }
                  border={
                    brand.id === device.selectedBrand.id ? "secondary" : "light"
                  }
                >
                  {brand.id === device.selectedBrand.id ? (
                    <div
                      className="p-2"
                      onClick={() => {
                        device.setSelectedBrand("");
                      }}
                    >
                      {" "}
                      {brand.name}
                      {props?.productCountPerBrand && (
                        <Badge bg="secondary" text="dark" pill>
                          {props.productCountPerBrand[brand.id] || ""}
                        </Badge>
                      )}
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
                        <Badge bg="secondary" text="dark" pill>
                          {props.productCountPerBrand[brand.id] || ""}
                        </Badge>
                      )}
                    </div>
                  )}
                </Card>
              ))}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </>
  );
});

export default BrandBar;
