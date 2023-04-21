import Header from "../Header/Header";
import "./App.scss";
import Main from "../Main/Main";
import { useState } from "react";

function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  return (
    <div className={`${"App grid"}${isDarkTheme ? " App--dark" : ""}`}>
      <div className="header">
        <Header isDarkTheme={isDarkTheme} onClick={setIsDarkTheme} />
      </div>

      <div className="main">
        <Main isDarkTheme={isDarkTheme} />
      </div>
    </div>
  );
}

export default App;
