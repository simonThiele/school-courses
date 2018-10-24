/* eslint-env mocha */

import shedule from "../src/courseSheduler";
import { expect } from "chai";

describe("courseSheduler", () => {
  const courseList = [
    { name: "c1", min: 1, max: 2 },
    { name: "c2", min: 1, max: 2 },
    { name: "c3", min: 1, max: 2 },
    { name: "c4", min: 2, max: 10 }
  ];
  const peopleList = [
    person("p1", ["c1", "c2", "c3"]),
    person("p2", ["c1", "c2", "c3"]),
    person("p3", ["c1", "c2", "c3"]),
    person("p4", ["c1", "c2", "c3"]),
    person("p5", ["c1", "c2", "c3"]),
    person("p6", ["c1", "c2", "c3"]),
    person("p7", ["c1", "c2", "c3"]),
    person("p8", ["c1", "c3"]),
    person("p9", ["c1", "c4"]),
    person("p10", ["c1", "c3"])
  ];

  it("", () => {
    const { assignedPeople, unassignedPeople, rejectedPeople } = shedule(
      courseList,
      peopleList
    );

    console.log("Assigned");
    console.log(assignedPeople);
    console.log("Unassigned");
    console.log(unassignedPeople);
    console.log("Rejected");
    console.log(rejectedPeople);
  });
});

function person(name, priorities) {
  return {
    name,
    priorities
  };
}
