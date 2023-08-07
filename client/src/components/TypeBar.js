import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
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

function CustomToggleBrand({ eventKey, isOpen, onToggle, expand }) {
  const decoratedOnClick = (eventKey, () =>
    console.log("totally custom!", isOpen)
  );
  return (
    <div
      style={{
        marginLeft: "15px",
        cursor: "pointer",
        transform: `rotate(${
          isOpen
              ? "180deg"
              : "0deg"
           
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


const TypeBar = observer((props) => {
  const { device } = useContext(Context);
  const [isOpenMap, set$isOpenMap] = useState({});
  const [IsOpenMapBrand, set$isOpenMapBrand] = useState({});
  // Function to toggle the isOpen state for a specific category
  const toggleCategory = (typeId) => {
    set$isOpenMap((prevIsOpenMap) => ({
      ...prevIsOpenMap,
      [typeId]: !prevIsOpenMap[typeId],
    }));
  };
  const toggleBrand = (brandId) => {
    set$isOpenMapBrand((prevIsOpenMapBrand) => ({
      ...prevIsOpenMapBrand,
      [brandId]: !prevIsOpenMapBrand[brandId],
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
            <span style={{ width: "50%" }}>Categories</span>
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
              {device.types.map((type, i) => (
                <Accordion defaultActiveKey="0" key={type.id}>
                  <Card.Header
                    className={isOpenMap[type.id] ? "open" : ""}
                    style={{ display: "flex" }}
                  >
                    <CustomToggle
                      eventKey={type.id}
                      isOpen={isOpenMap[type.id]}
                      onToggle={toggleCategory} // Pass the callback function
                    />

                    <div
                      style={{
                        display: "flex",
                        // marginTop: "-30px",
                        alignItems: "flex-start",
                        width: "80%",
                      }}
                    >
                      <div
                        className="d-flex justify-content-between"
                        style={{ marginLeft: "20%", width: "70%" }}
                      >
                        {" "}
                        <span>{type.name}</span>
                        {props?.productCountPerType && (
                          <Badge bg="secondary" pill>
                            {props.productCountPerType[type.id] || ""}
                          </Badge>
                        )}
                      </div>
                      <span
                        style={{ marginLeft: "15px", cursor: "pointer" }}
                        onClick={() => {
                          type.id === device.selectedType.id
                            ? device.setSelectedType("")
                            : device.setSelectedType(type);
                          device.setSelectedBrand("");
                        }}
                      >
                        &gt;
                      </span>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse
                    eventKey={type.id}
                    style={{ cursor: "pointer" }}
                    active={type.id === device.selectedType.id}
                    action
                    variant="light"
                    key={type.id}
                  >
                    <Card.Body>
                      {props?.brandCountPerType[type.id]?.map((brandId) => (
                        <div
                          style={{
                            display: "flex",
                            // marginTop: "-30px",
                            alignItems: "flex-start",
                            width: "80%",
                          }}
                        >
                          <div
                            className="d-flex justify-content-between"
                            style={{ marginLeft: "20%", width: "70%" }}
                            key={brandId}
                          >
                            {
                              device.allbrands.find(
                                (brand) => brand.id === brandId
                              )?.name
                            }
                            <Badge bg="secondary" pill>
                              {props?.arrayOfDevicesCountPerTypePerBrand?.find(
                                (el) =>
                                  el.typeId === type.id && el.brand === brandId
                              )?.devicesOfType || ""}
                            </Badge>
                          </div>
                          <span
                            style={{ marginLeft: "15px", cursor: "pointer" }}
                            onClick={() => {
                              device.selectedBrand.id === brandId
                                ? device.setSelectedBrand("")
                                : device.setSelectedBrand(
                                    device.brands.find(
                                      (brand) => brand.id === brandId
                                    )
                                  );
                              device.setSelectedType(type);
                            }}
                          >
                             <CustomToggleBrand
                      eventKey={brandId}
                      isOpen={IsOpenMapBrand[brandId]}
                      onToggle={toggleBrand} // Pass the callback function
                    />
                          </span>
                        </div>
                      ))}
                    </Card.Body>
                  </Accordion.Collapse>
                </Accordion>
              ))}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </>
  );
});

export default TypeBar;
