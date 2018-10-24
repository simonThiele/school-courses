import { PageHeader } from "react-bootstrap";
import React from "react";

import locals from "./App.less";

export default function App() {
  return (
    <div className={locals.app}>
      <PageHeader>Course Sheduler</PageHeader>
      <p>foobar</p>
    </div>
  );
}
