/* eslint-env mocha */

import {
  preValidateLists,
  markUnknwonCourses,
  markEmptyOrHolePriorities,
  markMissingPriorities,
  markDuplicates
} from "../src/validation";
import { expect } from "chai";

describe("validation", () => {
  let courses;
  let errorPeopleList;

  beforeEach(() => {
    courses = { c1: true, c2: true, c3: true };
    errorPeopleList = [
      {},
      {
        prio1: "c1"
      },
      {
        prio1: "c2",
        prio3: "c2"
      },
      {
        prio1: "unknown c4"
      },
      {
        prio1: "c1",
        prio2: "unknown c5",
        prio3: "unknown c6"
      }
    ];
  });

  it("should throw errors when both params are invalid", () => {
    expect(() => {
      preValidateLists();
    }).to.throw("The first param (coursList) is not a valid array");

    expect(() => {
      preValidateLists([]);
    }).to.throw("The first param (coursList) is empty");

    expect(() => {
      preValidateLists([{ name: "course 1" }]);
    }).to.throw("The second param (peopleList) is not a valid array");

    expect(() => {
      preValidateLists([{ name: "course 1" }], []);
    }).to.throw("The second param (peopleList) is empty");
  });

  it("should mark people who have unknown courses assinged", () => {
    markUnknwonCourses(courses, errorPeopleList);
    expect(errorPeopleList[0]._errors).to.equal(undefined);
    expect(errorPeopleList[1]._errors).to.equal(undefined);
    expect(errorPeopleList[2]._errors).to.equal(undefined);
    expect(errorPeopleList[3]._errors).to.have.lengthOf(1);
    expect(errorPeopleList[4]._errors[0]).to.equal(
      "At least one of the given courses is unknown"
    );
    expect(errorPeopleList[3]._errors).to.have.lengthOf(1);
    expect(errorPeopleList[3]._errors[0]).to.equal(
      "At least one of the given courses is unknown"
    );
  });

  it("should mark people who have no priorities or holes in the priority list", () => {
    markEmptyOrHolePriorities(errorPeopleList);
    expect(errorPeopleList[0]._errors).to.have.lengthOf(1);
    expect(errorPeopleList[0]._errors[0]).to.equal(
      "There are no priorities given"
    );

    expect(errorPeopleList[1]._errors).to.equal(undefined);

    expect(errorPeopleList[2]._errors).to.have.lengthOf(1);
    expect(errorPeopleList[2]._errors[0]).to.equal(
      "Skipping priorities is not allowed"
    );

    expect(errorPeopleList[3]._errors).to.equal(undefined);
    expect(errorPeopleList[4]._errors).to.equal(undefined);
  });

  it("should mark people who have duplicates in their priorities", () => {
    markDuplicates(errorPeopleList);
    expect(errorPeopleList[0]._errors).to.equal(undefined);
    expect(errorPeopleList[1]._errors).to.equal(undefined);
    expect(errorPeopleList[3]._errors).to.equal(undefined);
    expect(errorPeopleList[4]._errors).to.equal(undefined);

    expect(errorPeopleList[2]._errors).to.have.lengthOf(1);
    expect(errorPeopleList[2]._errors[0]).to.equal(
      "There are duplicates in the priorities"
    );
  });

  it("should mark people who have not filled all priorities", () => {
    markMissingPriorities(errorPeopleList);
    expect(errorPeopleList[0]._warnings).to.have.lengthOf(1);
    expect(errorPeopleList[0]._warnings[0]).to.equal(
      "There are not all priorities filled"
    );

    expect(errorPeopleList[1]._warnings).to.have.lengthOf(1);
    expect(errorPeopleList[1]._warnings[0]).to.equal(
      "There are not all priorities filled"
    );

    expect(errorPeopleList[2]._warnings).to.have.lengthOf(1);
    expect(errorPeopleList[2]._warnings[0]).to.equal(
      "There are not all priorities filled"
    );

    expect(errorPeopleList[3]._warnings).to.have.lengthOf(1);
    expect(errorPeopleList[3]._warnings[0]).to.equal(
      "There are not all priorities filled"
    );

    expect(errorPeopleList[4]._warnings).to.equal(undefined);
  });
});
