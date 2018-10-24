/* eslint-env mocha */

import shedule from "../src/courseSheduler";
import { expect } from "chai";

describe("courseSheduler", () => {
  const courseList = [
    { name: "c1", min: 3, max: 7 },
    { name: "c2", min: 5, max: 6 },
    { name: "c3", min: 5, max: 10 },
    { name: "c4", min: 0, max: 2 }
  ];
  const peopleList = [
    person("p1", "c1", "c3", "c2"),
    person("p2", "c1", "c4", "c2"),
    person("p3", "c1", "c2", "c3"),
    person("p4", "c1", "c2", "c3"),
    person("p5", "c1", "c2", "c4"),
    person("p6", "c1", "c2", "c4"),
    person("p7", "c1", "c3", ""),
    person("p8", "c1", "c4", ""),
    person("p9", "c1", "c3", ""),
    person("p10", "c1", "c3", "")
  ];

  it("", () => {
    const { assignedPeople, unassignedPeople, rejectedPeople } = shedule(
      courseList,
      peopleList
    );

    console.log("-----------------------------------------------");
    console.log(1);
    console.log(assignedPeople);
    console.log(2);
    console.log(unassignedPeople);
    console.log(3);
    console.log(rejectedPeople);
  });
});

function person(name, prio1, prio2, prio3) {
  return {
    name,
    prio1,
    prio2,
    prio3
  };
}
