/* eslint-env mocha */
import { expect } from "chai";

import shedule from "../src/courseSheduler";
import messageIds from "../src/messageIds";

describe("courseSheduler", () => {
  it("should assign people to courses until they are full", () => {
    const courseList = [
      { name: "c1", min: 1, max: 2 },
      { name: "c2", min: 1, max: 2 },
      { name: "c3", min: 1, max: 2 }
    ];
    const peopleList = [
      person("p1", ["c1", "c2", "c3"]),
      person("p2", ["c1", "c2", "c3"]),
      person("p3", ["c1", "c2", "c3"]),
      person("p4", ["c1", "c2", "c3"]),
      person("p5", ["c1", "c2", "c3"]),
      person("p6", ["c1", "c2", "c3"]),
      person("p7", ["c1", "c2", "c3"])
    ];

    shedule(courseList, peopleList);
    const p1 = peopleList[0];
    const p2 = peopleList[1];
    const p3 = peopleList[2];
    const p4 = peopleList[3];
    const p5 = peopleList[4];
    const p6 = peopleList[5];
    const p7 = peopleList[6];

    expect(p1._assignedCourse.name).to.equal("c1");
    expect(p2._assignedCourse.name).to.equal("c1");

    expect(p3._assignedCourse.name).to.equal("c2");
    expect(p4._assignedCourse.name).to.equal("c2");

    expect(p5._assignedCourse.name).to.equal("c3");
    expect(p6._assignedCourse.name).to.equal("c3");

    expect(p7._assignedCourse).to.equal(undefined);
    expect(p7._unassignedReason).to.equal(messageIds.UNASSIGNABLE_FULL_COURSES);
  });

  it("should reject people, who's assigned course has not enough people assigned to it", () => {
    const courseList = [
      { name: "c1", min: 1, max: 1 },
      { name: "c2", min: 1, max: 1 },
      { name: "c3", min: 2, max: 2 }
    ];
    const peopleList = [
      person("p1", ["c1", "c2"]),
      person("p2", ["c1", "c2"]),
      person("p3", ["c1", "c2", "c3"])
    ];

    const { rejectedPeople } = shedule(courseList, peopleList);
    expect(rejectedPeople).to.have.lengthOf(1);

    const p3 = rejectedPeople[0];
    expect(p3.name).to.equal("p3");
    expect(p3._assignedCourse).to.equal(undefined);
    expect(p3._unassignedReason).to.equal(
      messageIds.UNASSIGNABLE_MIN_COURSE_REQUIREMENTS
    );
  });
});

function person(name, priorities) {
  return {
    name,
    priorities
  };
}
