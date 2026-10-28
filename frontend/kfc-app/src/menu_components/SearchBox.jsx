import React from "react";
import styles from "./item.module.css";

const SearchBox = ({ value, onChange }) => (
  <div className={styles.searchbox}>
    <input
      type="search"
      value={value}
      placeholder="Search Our Menu"
      aria-label="Search menu"
      onChange={(event) => onChange(event.target.value)}
    />
  </div>
);

export default SearchBox;
