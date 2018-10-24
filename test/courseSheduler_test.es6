/* eslint-env mocha */
import { expect } from "chai";

import shedule from "../src/courseSheduler";
import messageIds from "../src/messageIds";

describe("courseSheduler", () => {
  let courseList;
  let peopleList;

  beforeEach(() => {
    courseList = [
      { name: "c1", min: 1, max: 2 },
      { name: "c2", min: 1, max: 2 },
      { name: "c3", min: 1, max: 2 },
      { name: "c4", min: 2, max: 10 }
    ];
    peopleList = [
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
  });

  it("should assign people to courses until they are full", () => {
    shedule(courseList, peopleList);
    const p1 = peopleList[0];
    const p2 = peopleList[1];
    const p3 = peopleList[2];
    const p4 = peopleList[3];
    const p8 = peopleList[7];
    const p10 = peopleList[9];

    expect(p1._assignedCourse.name).to.equal("c1");
    expect(p2._assignedCourse.name).to.equal("c1");

    expect(p3._assignedCourse.name).to.equal("c2");
    expect(p4._assignedCourse.name).to.equal("c2");

    expect(p8._assignedCourse.name).to.equal("c3");
    expect(p10._assignedCourse.name).to.equal("c3");
  });

  it("should unassign people, who do not fit into courses because they are full", () => {
    const { unassignedPeople } = shedule(courseList, peopleList);
    expect(unassignedPeople).to.have.lengthOf(3);

    for (let i = 0; i < unassignedPeople.length; i++) {
      const person = unassignedPeople[i];
      expect(person._assignedCourse).to.equal(undefined);
      expect(person._unassignedReason).to.equal(
        messageIds.UNASSIGNABLE_FULL_COURSES
      );
    }
  });

  it("should reject people, who's assigned course has not enough people assigned to it", () => {
    const { rejectedPeople } = shedule(courseList, peopleList);
    expect(rejectedPeople).to.have.lengthOf(1);

    for (let i = 0; i < rejectedPeople.length; i++) {
      const person = rejectedPeople[i];
      expect(person._assignedCourse).to.equal(undefined);
      expect(person._unassignedReason).to.equal(
        messageIds.UNASSIGNABLE_MIN_COURSE_REQUIREMENTS
      );
    }
  });
});

function person(name, priorities) {
  return {
    name,
    priorities
  };
}
