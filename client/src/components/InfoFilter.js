import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { Context } from "../index";
import { Card, Accordion } from "react-bootstrap";
import InfoBar from "./InfoBar";
import { ChevronRight } from "react-bootstrap-icons";

const InfoFilter = observer(
  ({
    sortedInfoArrayObjects,
    CustomToggle,
    CustomToggle2,
    toggleCategory,
    isOpenMap,
  }) => {
    const { device } = useContext(Context);

    return (
      <Accordion
        defaultActiveKey="ccc" //opened
        // defaultActiveKey="0" //closed
      >
        <Card>
          <Card.Header
            style={{
              display: "flex",
              // justifyContent: "space-around"
            }}
          >
            <div style={{ width: "5rem" }}>
              <CustomToggle
                eventKey="ccc"
                isOpen={isOpenMap && isOpenMap["ccc"]}
                onToggle={toggleCategory}
              >
                <ChevronRight/>
              </CustomToggle>
            </div>
            <span style={{ width: "70%" }}>Filters</span>
          </Card.Header>
          <Accordion.Collapse eventKey="ccc">
            <Card.Body>
              {device.selectedType?.id &&
                sortedInfoArrayObjects?.length &&
                sortedInfoArrayObjects?.map((item, i) => (
                  <InfoBar
                    key={`${item.title}-${i}`}
                    info={item}
                    CustomToggle={CustomToggle}
                    CustomToggle2={CustomToggle2}
                    toggleCategory={toggleCategory}
                    isOpenMap={isOpenMap}
                  />
                ))}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    );
  }
);

export default InfoFilter;
