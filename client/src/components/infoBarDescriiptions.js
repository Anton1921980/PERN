import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { Context } from "../index";

import "../scss/styles.scss";
import { ChevronRight } from "react-bootstrap-icons";

const InfoBarDescriptions = observer((props) => {
  const { device } = useContext(Context);
  const {
    isOpenMap,
    toggleCategory,
    CustomToggle2,
    info,
    // infoArr,
  } = props;
  const [currentTitleDescriptions, set$currentTitleDescriptions] = useState([]);
 
  const infoArr =
    currentTitleDescriptions?.descriptions?.length > 0 &&
    currentTitleDescriptions?.title === info?.title //  if already have descriptionsin this title
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
            backgroundColor:
              isOpenMap[descriptionsItem.description] && "lightgrey",
          }}
        >
          <div
            className="d-flex justify-content-between"
            style={{ marginLeft: "10%", width: "85%" }}
          >
            {descriptionsItem?.description}
            <span
              style={{
                paddingLeft: "10px",
                paddingRight: "10px",
                fontSize: "0.6rem",
                marginTop: "0.4rem",
              }}
            >
              {descriptionsItem?.count || ""}
            </span>
          </div>
          <span
            style={{ marginLeft: "20px", cursor: "pointer" }}
            onClick={() => {
              !currentTitleDescriptions?.descriptions?.length &&
                set$currentTitleDescriptions(info);
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
              device.setSelectedInfos(updatedSelectedInfos);
            }}
          >
            <CustomToggle2
              eventKey={descriptionsItem.description}
              isOpen={isOpenMap[descriptionsItem.description]}
              onToggle={toggleCategory}
              marginRight={"15px"}
            >
              <ChevronRight/>
            </CustomToggle2>
          </span>
        </div>
      ))}
    </>
  );
});

export default InfoBarDescriptions;
