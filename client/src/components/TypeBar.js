import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { Card, Accordion } from "react-bootstrap";
import "../scss/styles.scss";
import { NavLink } from "react-router-dom/cjs/react-router-dom";
import { SHOP_ROUTE } from "../utils/consts";
import { ChevronRight, CaretRight, CaretRightFill } from "react-bootstrap-icons";

const TypeBar = observer(
  ({
    main,
    productCountPerType,
    brandCountPerType,
    arrayOfDevicesCountPerTypePerBrand,
    CustomToggle,
    toggleCategory,
    isOpenMap,
  }) => {
    const { device } = useContext(Context);

    return (
      <>
        <Accordion
          defaultActiveKey="aaa" //opened
          // defaultActiveKey="0" //closed
        >
          <Card>
            <Card.Header
              style={{
                display: "flex",
                justifyContent: main && "space-around",
                backgroundColor:
                  !device.selectedType.id &&
                  device.selectedBrands?.length === 0 &&
                  "lightgrey",
              }}
            >
              {!main && (
                <div style={{ width: "5rem" }}>
                  <CustomToggle
                    eventKey="aaa"
                    isOpen={isOpenMap && isOpenMap["aaa"]}
                    onToggle={toggleCategory}
                  >
                   <ChevronRight/>
                  </CustomToggle>
                </div>
              )}
              <span style={{ width: "70%" }}>Categories</span>
              {!main ? (
                <span
                  style={{
                    marginLeft: "15px",
                    cursor: "pointer",
                    transform: `rotate(${
                      !device.selectedType.id &&
                      device.selectedBrands?.length === 0
                        ? "180deg"
                        : "0deg"
                    })`,
                    transition: "transform 0.3s ease",
                  }}
                  onClick={() => {
                    device.setSelectedType("");
                    device.setSelectedBrands([]);
                  }}
                >
                   <ChevronRight/>
                </span>
              ) : (
                <NavLink
                  style={{ textDecoration: "none", color: "inherit" }}
                  to={SHOP_ROUTE}
                >
                  <span
                    style={{
                      marginLeft: "15px",
                      cursor: "pointer",
                    }}
                  >
                    <ChevronRight/>
                  </span>
                </NavLink>
              )}
            </Card.Header>
            <Accordion.Collapse eventKey="aaa">
              <Card.Body>
                {device?.types?.map((type, i) => (
                  <Accordion
                    //  defaultActiveKey={type.id}// all opened
                    defaultActiveKey="0" // all closed
                    key={type?.id}
                  >
                    <Card.Header
                      className={!main && isOpenMap[type.id] ? "open" : ""}
                      style={{
                        display: "flex",
                        backgroundColor:
                          type.id === device.selectedType.id &&
                          device.selectedBrands?.length === 0 &&
                          "lightgrey",
                      }}
                    >
                      {!main && (
                        <CustomToggle
                          eventKey={type?.id}
                          isOpen={isOpenMap[type.id]}
                          onToggle={toggleCategory} // Pass the callback
                        />
                      )}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          width: "90%",
                        }}
                      >
                        <div
                          className="d-flex justify-content-between"
                          style={{ marginLeft: "20%", width: "70%" }}
                        >
                          {" "}
                          <span>{type?.name}</span>
                          {productCountPerType && (
                            <span
                              style={{
                                paddingLeft: "10px",
                                paddingRight: "10px",
                                fontSize: "0.6rem",
                                marginTop: "0.4rem",
                              }}
                            >
                              {productCountPerType[type.id] || ""}
                            </span>
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
                            device.setSelectedInfos({});
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
                              <ChevronRight/>
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
                        {brandCountPerType &&
                          brandCountPerType[type.id]?.map((brandId) => (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                width: "90%",
                                backgroundColor:
                                  type.id === device.selectedType.id &&
                                  brandId ===
                                    device.selectedBrands.find(
                                      (id) => id === brandId
                                    ) &&
                                  "lightgrey",
                              }}
                              key={brandId}
                            >
                              <div
                                className="d-flex justify-content-between"
                                style={{
                                  marginLeft: "20%",
                                  width: "80%",
                                }}
                              >
                                {
                                  device.allbrands.find(
                                    (brand) => brand.id === brandId
                                  )?.name
                                }
                                <span
                                  style={{
                                    paddingLeft: "10px",
                                    paddingRight: "10px",
                                    fontSize: "0.6rem",
                                    marginTop: "0.4rem",
                                  }}
                                >
                                  {(arrayOfDevicesCountPerTypePerBrand &&
                                    arrayOfDevicesCountPerTypePerBrand?.find(
                                      (el) =>
                                        el.typeId === type.id &&
                                        el.brand === brandId
                                    )?.devicesOfType) ||
                                    ""}
                                </span>
                              </div>
                              <span
                                style={{
                                  marginLeft: "15px",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  if (
                                    device?.selectedType?.id === undefined || // клікаємо вперше тип не визначено
                                    device.selectedType.id !== type.id
                                  ) {
                                    //  клікаємо по бренду з іншої категорії
                                    device.setSelectedBrands([brandId]);
                                    device.setSelectedType(type);
                                    device.setSelectedInfos({});
                                  } else {
                                    device.selectedType.id !== type.id &&
                                      device.setSelectedType(type);
                                    device.selectedBrands.includes(brandId)
                                      ? device.setSelectedBrands(
                                          // ввидаляємо бренд якшо він вже є
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
                                    marginRight: "15px",
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
                                  <ChevronRight/>
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
  }
);

export default TypeBar;
