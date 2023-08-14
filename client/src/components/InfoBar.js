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

const InfoBar = observer((props) => {
  // const { device } = useContext(Context);
  const [isOpenMap, set$isOpenMap] = useState({});

  // Function to toggle the isOpen state for a specific category
  const toggleCategory = (typeId) => {
    set$isOpenMap((prevIsOpenMap) => ({
      ...prevIsOpenMap,
      [typeId]: !prevIsOpenMap[typeId],
    }));
  };
 
  const info = props?.info;


  console.log("info ", info);


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
            <span style={{ width: "50%" }}>{info?.title}</span>
            {/* <span
              style={{ marginLeft: "15px", cursor: "pointer" }}
              onClick={() => {
                device.setSelectedType("");
                device.setSelectedBrands("");
              }}
            >
              &gt;
            </span> */}
          </Card.Header>
          <Accordion.Collapse eventKey="888">
            <Card.Body>
              {info?.descriptions.length &&
                info.descriptions?.map((descriptionsItem) => (
                  <Card
                    key={descriptionsItem.description}
                    style={{ cursor: "pointer" }}

                    // border={
                    //   brand.id === device.selectedBrands.id ? "secondary" : "light"
                    // }
                  >
                    {/* {brand.id === device.selectedBrands.id ? ( */}
                    <div
                      className="p-2"
                      // onClick={() => {
                      //   device.setSelectedBrands("");
                      // }}
                    >
                      {" "}
                      {descriptionsItem.description}
                                           
                      <Badge bg="secondary" text="dark" pill>
                          {descriptionsItem.count || ""}
                        </Badge>
                    </div>
                    {/* ) : (
                    <div
                      className="p-2"
                      onClick={() => {
                        device.setSelectedBrands(brand);
                      }}
                    >
                      {" "}
                      {descriptionsItem}
                      {props?.productCountPerBrand && (
                        <Badge bg="secondary" text="dark" pill>
                          {descriptions.count || ""}
                        </Badge>
                      )} 
                    </div>
                  )
                  } */}
                  </Card>
                ))}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </>
  );
});

export default InfoBar;
