import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../scss/PriceFilter.css"; // Custom CSS for styling the price filter

const PriceFilter = ({
  minPrice,
  maxPrice,
  onPriceChange,
  setOnPriceChange,
}) => {
  const defaultMin = minPrice;
  const defaultMax = maxPrice;
  const step = 10;

  const [activeInput, setActiveInput] = useState(null); 
  const [inputCoords, setInputCoords] = useState({});

  const handlePriceChange = (event, index) => {
    let newValues = [...onPriceChange];
    newValues[index] = parseInt(event.target.value);
    if (index === 0 && newValues[0] >= newValues[1]) {
      newValues[0] = newValues[1] - 10;
    }
    if (index === 1 && newValues[1] <= newValues[0]) {
      newValues[1] = newValues[0] + 10;
    }
    setOnPriceChange(newValues);
  };

  const handleInputClick = (index) => {
    setActiveInput(index);
  };
  const handleInputBlur = (event) => {
    const { x, y } = event.target.getBoundingClientRect();
    setInputCoords({ position: "relative", top: y, left: x });
  };
  return (
    <div className="price-filter">
      <label>Price Range:</label>
      <div className="price-range">
        <input
          className="range1"
          style={{
            zIndex: activeInput === 0 ? 2 : 1,
          }}
          type="range"
          min={defaultMin}
          max={defaultMax}
          value={onPriceChange[0]}
          onChange={(e) => handlePriceChange(e, 0)}
          step={step}
          onClick={() => handleInputClick(1)}
        />
        <input
          className="range2"
          style={{
            zIndex: activeInput === 1 ? 2 : 1,
            backgroundColor: "red",
            ...inputCoords,
          }}
          type="range"
          min={defaultMin}
          max={defaultMax}
          value={onPriceChange[1]}
          onChange={(e) => handlePriceChange(e, 1)}
          step={step}
          onClick={() => handleInputClick(0)}
          onBlur={handleInputBlur}
        />
      </div>
      <div className="price-values">
        <span>
          {onPriceChange[0] < onPriceChange[1]
            ? onPriceChange[0]
            : onPriceChange[1]}
        </span>{" "}
        -{" "}
        <span>
          {onPriceChange[1] > onPriceChange[0]
            ? onPriceChange[1]
            : onPriceChange[0]}
        </span>
      </div>
    </div>
  );
};

export default PriceFilter;
