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
     display:"flex",
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

  // Function to toggle the isOpen state for a specific category
  const toggleCategory = (typeId) => {
    set$isOpenMap((prevIsOpenMap) => ({
      ...prevIsOpenMap,
      [typeId]: !prevIsOpenMap[typeId],
    }));
  };

  const info = props?.info;

  // console.log("info ", info);

  return (
    <>
      <Accordion defaultActiveKey="0">
        <Card>
          <Card.Header
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <CustomToggle
              eventKey="888"
              isOpen={isOpenMap[888]}
              onToggle={toggleCategory}
            >
              &gt;
            </CustomToggle>
            <span style={{ width: "80%" }}>{info?.title}</span>
          </Card.Header>
          <Accordion.Collapse eventKey="888">
            <Card.Body>
              {info?.descriptions.length &&
                info?.descriptions.map((descriptionsItem) => (
                  <div
                    key={descriptionsItem?.description}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      width: "95%",
                    }}
                  >
                    <div
                      className="d-flex justify-content-between"
                      style={{ marginLeft: "10%", width: "85%" }}
                    >                      
                      {descriptionsItem?.description}
                      <Badge bg="secondary" text="dark" pill>
                        {descriptionsItem?.count || ""}
                      </Badge>
                    </div>
                    <span
                      style={{ marginLeft: "15px", cursor: "pointer" }}
                      
                 
                      onClick={() => {
                        const currentTitle = info.title;
                        const updatedSelectedInfos = { ...device.selectedInfos };
                        let existingTitle = updatedSelectedInfos[currentTitle] || [];
                      
                        const existingDescription = existingTitle.find(
                          (item) => item.description === descriptionsItem.description  );
                      
                        if (existingDescription) {
                          existingTitle = existingTitle.filter(
                            (item) => item.description !== descriptionsItem.description
                          );
                        } else {
                          existingTitle.push({
                            description: descriptionsItem.description,
                            deviceIdArr: descriptionsItem.deviceIdArr,
                          });
                        }
                      
                        updatedSelectedInfos[currentTitle] = existingTitle;
                      
                        const arraysByKey = {}; 
                      
                        Object.keys(updatedSelectedInfos).forEach((key) => {
                          if (key !== "result" && updatedSelectedInfos[key].length > 0) {
                            arraysByKey[key] = updatedSelectedInfos[key].flatMap((item) => item.deviceIdArr);
                          }
                        });
                      
                        const intersection = Object.keys(arraysByKey).reduce((acc, key, index) => {
                          if (index === 0) {
                            return arraysByKey[key];
                          }
                      
                          return acc.filter(id => arraysByKey[key].includes(id));
                        }, []);
                      
                        updatedSelectedInfos.result = intersection;
                      
                        device.setSelectedInfos(updatedSelectedInfos);
                      }}
  
                    >
                      <CustomToggle2
                        eventKey={descriptionsItem.description}
                        isOpen={isOpenMap[descriptionsItem.description]}
                        onToggle={toggleCategory}
                      >
                        &gt;
                      </CustomToggle2>
                    </span>
                  </div>
                ))}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </>
  );
});

export default InfoBar;
