import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { Context } from "../index";
import { Badge, Card, Accordion, useAccordionButton } from "react-bootstrap";

import "../scss/styles.scss";
import InfoBarDescriptions from "./infoBarDescriiptions";
import { ChevronRight } from "react-bootstrap-icons";


const InfoBar = observer(
  ({ info, toggleCategory, CustomToggle, CustomToggle2, isOpenMap }) => {
    const { device } = useContext(Context);

    return (
      <>
        <Accordion defaultActiveKey="0">
          <Card>
            <Card.Header
              style={{
                display: "flex",
                justifyContent: "space-between",
                // backgroundColor: isOpenMap[info?.title] && "lightgrey",
              }}
            >
              <CustomToggle
                eventKey={info?.title}
                isOpen={isOpenMap[info?.title]}
                onToggle={toggleCategory}
              >
                <ChevronRight/>
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
                />
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </>
    );
  }
);

export default InfoBar;
