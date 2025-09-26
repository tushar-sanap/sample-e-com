import React from "react";
import "./test-env.css";

export default function TestEnv() {
  return (
    <div className="test-page">
      <h1>Test Page</h1>

      <div className="section a">
        <button id="btn-a">Action A</button>
        <div id="output-a"></div>
      </div>

      <div className="section b">
        <input id="input-b" placeholder="Type something" />
        <div id="output-b"></div>
      </div>

      <div className="section c">
        <button id="btn-c">Action C</button>
        <div id="output-c"></div>
      </div>

      <div className="section d">
        <button id="btn-d">Action D</button>
        <div id="output-d"></div>
      </div>

      <div className="section e">
        <button id="btn-e">Action E</button>
        <div id="output-e"></div>
      </div>

      <div className="section f">
        <button id="btn-f">Action F</button>
        <div id="output-f"></div>
      </div>

      <div className="section g">
        <button id="btn-g">Action G</button>
        <div id="output-g"></div>
      </div>

      <div className="section h">
        <button id="btn-h">Action H</button>
        <div id="output-h"></div>
      </div>

      <div className="section i">
        <button id="btn-i">Action I</button>
        <div id="output-i"></div>
      </div>

      <div className="section j">
        <button id="btn-j">Action J</button>
        <div id="output-j"></div>
      </div>
    </div>
  );
}
