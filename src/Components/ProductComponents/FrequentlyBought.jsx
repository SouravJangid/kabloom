import React, { useState } from "react";
import data from "./data/productData.json";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import "./FrequentlyBought.scss";

const FrequentlyBought = () => {
  const [items, setItems] = useState(data.items);

  const toggleItem = (id) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, selected: !item.selected } : item
    );
    setItems(updated);
  };

  const totalPrice = items
    .filter((i) => i.selected)
    .reduce((sum, i) => sum + i.price, 0)
    .toFixed(2);

  const selectedCount = items.filter((i) => i.selected).length;

  return (
    <div className="frequently-bought">
      <h3>Frequently bought together</h3>
      <div className="fbt-content">
        <div className="fbt-items">
          {items.map((item, idx) => (
            <React.Fragment key={item.id}>
              <div
                className={`fbt-card ${item.selected ? "selected" : ""}`}
                onClick={() => toggleItem(item.id)}
              >
                <div className="img-wrapper">
                  <img src={item.image} alt={item.title} />
                  {item.selected && (
                    <CheckCircleIcon className="check-icon" />
                  )}
                </div>
                <div className="item-details">
                  <p className="item-title">{item.title}</p>
                  <div className="item-price">
                    <strong>${item.price.toFixed(0)}</strong>
                    <span>
                      (${item.perCount.toFixed(2)} / count)
                    </span>
                  </div>
                </div>
              </div>
              {idx < items.length - 1 && (
                <div className="plus-sign">+</div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="total-section">
          <p className="total-text">
            Total Price: <span>${totalPrice}</span>
          </p>
          <button className="add-btn">
            Add all {selectedCount} to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default FrequentlyBought;
