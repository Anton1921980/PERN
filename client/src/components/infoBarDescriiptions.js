import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { Context } from "../index";
import { Badge, Card, Accordion, useAccordionButton } from "react-bootstrap";

import "../scss/styles.scss";

const InfoBarDescriptions = observer((props) => {
  const { device } = useContext(Context);
  const {
    isOpenMap,
    set$isOpenMap,
    toggleCategory,
    CustomToggle2,
    info,
    // infoArr,
  } = props;
  const [currentTitleDescriptions, set$currentTitleDescriptions] = useState([]);
  currentTitleDescriptions?.descriptions?.length>0 && console.log("currentTitleDescriptions: ", info.title, currentTitleDescriptions);

  // const info = props?.info;
  const infoArr =
    currentTitleDescriptions?.descriptions?.length>0 &&
    currentTitleDescriptions?.title === info?.title // якшо є вже збережені дескріпшени у цьому тайтлі
      ? currentTitleDescriptions.descriptions
      : info?.descriptions?.length && info?.descriptions;

  return (
    <>
      {infoArr?.map((descriptionsItem) => (
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

              !currentTitleDescriptions?.descriptions?.length && set$currentTitleDescriptions(info); //додати також із оpenmap?

              const currentTitle = info.title;
              const updatedSelectedInfos = {
                ...device.selectedInfos,
              };
              let existingTitle = updatedSelectedInfos[currentTitle] || [];

              const existingDescription = existingTitle.find(
                (item) => item.description === descriptionsItem.description
              );

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
                  arraysByKey[key] = updatedSelectedInfos[key].flatMap(
                    (item) => item.deviceIdArr
                  );
                }
              });

              const intersection = Object.keys(arraysByKey).reduce(
                (acc, key, index) => {
                  if (index === 0) {
                    return arraysByKey[key];
                  }

                  return acc.filter((id) => arraysByKey[key].includes(id));
                },
                []
              );

              updatedSelectedInfos.result = intersection;
              console.log("result: ", updatedSelectedInfos.result);

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
    </>
  );
});

export default InfoBarDescriptions;
