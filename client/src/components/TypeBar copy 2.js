import React, { useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import {ListGroup, ButtonGroup, Dropdown, Badge, Card, Accordion, useAccordionButton} from "react-bootstrap";
import "../scss/styles.scss";

function CustomToggle({ children, eventKey }) {
  const decoratedOnClick = useAccordionButton(eventKey, () =>
    console.log('totally custom!'),
  );
  return (
    <button
      type="button"
      style={{ backgroundColor: 'pink' }}
      onClick={decoratedOnClick}
    >
      {children}
    </button>
  );
}


const TypeBar = observer((props) => {
  console.log("props: ", props);
  const { device } = useContext(Context);

  //   const [chosen, setChosen] = useState(false);
  // прибрати ей стейт юзати замість нього device selectedType == type
  return (
    <>
     <Accordion defaultActiveKey="0">
      <Card>
        <Card.Header>
          <CustomToggle eventKey="0">Click me!</CustomToggle>
        </Card.Header>
        <Accordion.Collapse eventKey="0">
          <Card.Body>Hello! I'm the body</Card.Body>
        </Accordion.Collapse>
      </Card>
      <Card>
        <Card.Header>
          <CustomToggle eventKey="1">Click me!</CustomToggle>
        </Card.Header>
        <Accordion.Collapse eventKey="1">
          <Card.Body>Hello! I'm another body</Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>

      <Accordion defaultActiveKey="0">
        <Accordion.Item 
        // className={device.selectedType!=="" ? "open" : ""}
        eventKey="0">
          <Accordion.Header>
            Categories
            <span
              style={{ marginLeft: "15px" }}             
              // className="rotate-icon"
              onClick={() => {
                device.setSelectedType("");
                device.setSelectedBrand("");
              }}
            >
              &gt;
            </span>
          </Accordion.Header>
          <Accordion.Body>
       
            {device.types.map((type, i) => (
              <Accordion defaultActiveKey="0" key={type.id}>
                <Accordion.Item
                  eventKey={type.id}
                  style={{ cursor: "pointer" }}
                  active={type.id === device.selectedType.id}
                  action
                  variant="light"
                  key={type.id}
                  className={type.id === device.selectedType.id ? "open" : ""}
                >
                  <Accordion.Header>
                    <div
                      style={{
                        display: "flex",
                        // marginTop: "-30px",
                        alignItems: "flex-start",
                        width: "80%"
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
                        style={{ marginLeft: "15px" }}
                        className="rotate-icon"
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
                  </Accordion.Header>
                  <Accordion.Body>
                    {props?.brandCountPerType[type.id]?.map((brandId, i) => (
                       <div
                       style={{
                         display: "flex",
                         // marginTop: "-30px",
                         alignItems: "flex-start",
                         width: "80%"
                       }}
                     >
                      <div
                      className="d-flex justify-content-between"
                        style={{ marginLeft: "20%", width: "70%" }}
                      
                      key={brandId}>
                        {
                          device.brands.filter(
                            (brand) => brand.id === brandId
                          )[0]?.name
                        }
                        <Badge bg="secondary" pill>
                          {props?.arrayOfDevicesCountPerTypePerBrand?.find(
                            (el) =>
                              el.typeId === type.id && el.brand === brandId
                          )?.devicesOfType || ""}
                        </Badge>
                      </div>
                        <span
                        style={{ marginLeft: "15px" }}
                        className="rotate-icon"
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
                    ))}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            ))}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
});

export default TypeBar;
