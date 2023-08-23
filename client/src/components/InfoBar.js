import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { Context } from "../index";
import { Badge, Card, Accordion, useAccordionButton } from "react-bootstrap";

import "../scss/styles.scss";
import InfoBarDescriptions from "./infoBarDescriiptions";

function CustomToggle({ eventKey, isOpen, onToggle, expand }) {
  const decoratedOnClick = useAccordionButton(eventKey, () =>
    console.log("totally custom!", isOpen)
  );
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
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
    </div>
  );
}
function CustomToggle2({ eventKey, isOpen, onToggle, expand }) {
  const decoratedOnClick = (eventKey, () => console.log(eventKey));
  return (
    <div
      style={{
        cursor: "pointer",
        transform: `rotate(${isOpen ? "180deg" : "0deg"})`,
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
  const { device } = useContext(Context);
  const [isOpenMap, set$isOpenMap] = useState({});
  console.log("isOpenMap: ", isOpenMap);  

  // Function to toggle the isOpen state for a specific category
  const toggleCategory = (typeId) => {
    console.log("typeId: map ", typeId);
    set$isOpenMap((prevIsOpenMap) => ({
      ...prevIsOpenMap,
      [typeId]: !prevIsOpenMap[typeId],
    }));
  };

  const info = props?.info;

  return (
    <>
      <Accordion defaultActiveKey="0">
        <Card>
          <Card.Header
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <CustomToggle
              eventKey={info?.title}
              isOpen={isOpenMap[info?.title]}
              onToggle={toggleCategory}
            >
              &gt;
            </CustomToggle>
            <span style={{ width: "80%" }}>{info?.title}</span>
          </Card.Header>
          <Accordion.Collapse eventKey={info?.title}>
            <Card.Body>
              <InfoBarDescriptions
                toggleCategory={toggleCategory}
                CustomToggle2={CustomToggle2}
                info={info}
                isOpenMap={isOpenMap}
                set$isOpenMap={set$isOpenMap}
              />           
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </>
  );
});

export default InfoBar;
