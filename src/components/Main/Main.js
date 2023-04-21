import React from "react";
import styles from "./Main.module.scss";
import Paintings from "../Paintings/Paintings";

const Main = ({ isDarkTheme }) => {
  return (
    <div className="container">
      <div className={styles.mainWrapper}>
        <Paintings isDarkTheme={isDarkTheme} />
      </div>
    </div>
  );
};

export default Main;
