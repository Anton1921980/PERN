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

const TypeBar = observer((props) => {
  const { device } = useContext(Context);
  // const [isOpenMap, set$isOpenMap] = useState(Object.fromEntries(device.types.map((type) => [type.id, true]))); //all categories except main rotated
  const [isOpenMap, set$isOpenMap] = useState({ 888: true }); //main only rotated
  console.log("isOpenMap: ", isOpenMap);

  // Function to toggle the isOpen state for a specific category
  const toggleCategory = (typeId) => {
    set$isOpenMap((prevIsOpenMap) => ({
      ...prevIsOpenMap,
      [typeId]: !prevIsOpenMap[typeId],
    }));
  };

  return (
    <>
      <Accordion
        defaultActiveKey="888" //opened
        // defaultActiveKey="0" //closed
      >
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
                device.setSelectedBrands([]);
              }}
            >
              &gt;
            </span>
          </Card.Header>
          <Accordion.Collapse eventKey="888">
            <Card.Body>
              {device.types.map((type, i) => (
                <Accordion
                  //  defaultActiveKey={type.id}// all opened
                  defaultActiveKey="0" // all closed
                  key={type.id}
                >
                  <Card.Header
                    className={isOpenMap[type.id] ? "open" : ""}
                    style={{
                      display: "flex",
                      backgroundColor: isOpenMap[type.id] && "lightgrey",
                    }}
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
                          <Badge bg="light" text="dark" pill>
                            {props.productCountPerType[type.id] || ""}
                          </Badge>
                        )}
                      </div>
                      <span
                        style={{ marginLeft: "15px", cursor: "pointer" }}
                        onClick={() => {
                          type.id === device.selectedType.id &&
                          !device?.selectedBrands?.length //вибраний тип нема бренду
                            ? device.setSelectedType("")
                            : device.setSelectedType(type);
                          device.setSelectedBrands([]);
                        }}
                      >
                        <div
                          style={{
                            marginLeft: "15px",
                            cursor: "pointer",
                            transform: `rotate(${
                              type.id === device.selectedType.id &&
                              device.selectedBrands?.length === 0
                                ? "180deg"
                                : "0deg"
                            })`,
                            transition: "transform 0.3s ease",
                          }}
                        >
                          &gt;
                        </div>
                      </span>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse
                    eventKey={type.id}
                    style={{ cursor: "pointer" }}
                    // active={type?.id === device.selectedType?.id?"true":"false"}
                    action="true"
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
                          key={brandId}
                        >
                          <div
                            className="d-flex justify-content-between"
                            style={{ marginLeft: "20%", width: "70%" }}
                            // key={brandId}
                          >
                            {
                              device.allbrands.find(
                                (brand) => brand.id === brandId
                              )?.name
                            }
                            <Badge bg="light" text="dark" pill>
                              {props?.arrayOfDevicesCountPerTypePerBrand?.find(
                                (el) =>
                                  el.typeId === type.id && el.brand === brandId
                              )?.devicesOfType || ""}
                            </Badge>
                          </div>
                          <span
                            style={{ marginLeft: "15px", cursor: "pointer" }}
                            onClick={() => {
                              if (
                                device?.selectedType?.id === undefined || // клікаємо вперше тип не визначено
                                device.selectedType.id !== type.id
                              ) {
                                //  клікаємо по бренду з іншої категорії
                                device.setSelectedBrands([brandId]);
                                device.setSelectedType(type);
                              } else {
                                device.selectedType.id !== type.id &&
                                  device.setSelectedType(type);
                                device.selectedBrands.includes(brandId)
                                  ? device.setSelectedBrands(
                                      //case ввидаляємо бренд якшо він вже є
                                      device.selectedBrands.filter(
                                        (id) => id !== brandId
                                      )
                                    )
                                  : device.setSelectedBrands([
                                      // додоємо якшо не було
                                      ...device.selectedBrands,
                                      brandId,
                                    ]);
                              }
                            }}
                          >
                            <div
                              style={{
                                marginLeft: "15px",
                                cursor: "pointer",
                                transform: `rotate(${
                                  type.id === device.selectedType.id &&
                                  brandId ===
                                    device.selectedBrands.find(
                                      (id) => id === brandId
                                    )
                                    ? "180deg"
                                    : "0deg"
                                })`,
                                transition: "transform 0.3s ease",
                              }}
                            >
                              &gt;
                            </div>
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
