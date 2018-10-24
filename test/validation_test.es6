/* eslint-env mocha */
import { expect } from "chai";

import {
  preValidateLists,
  markUnknwonCourses,
  markEmptyOrHolePriorities,
  markMissingPriorities,
  markDuplicates
} from "../src/validation";
import messageIds from "../src/messageIds";

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
    }).to.throw(messageIds.COURSE_LIST_NOT_VALID);

    expect(() => {
      preValidateLists([]);
    }).to.throw(messageIds.EMPTY_COURSE_LIST);

    expect(() => {
      preValidateLists([{ name: "course 1" }]);
    }).to.throw(messageIds.PEOPLE_LIST_NOT_VALID);

    expect(() => {
      preValidateLists([{ name: "course 1" }], []);
    }).to.throw(messageIds.EMPTY_PEOPLE_LIST);
  });

  it("should mark people who have unknown courses assinged", () => {
    markUnknwonCourses(courses, errorPeopleList);
    expect(errorPeopleList[0]._errors).to.equal(undefined);
    expect(errorPeopleList[1]._errors).to.equal(undefined);
    expect(errorPeopleList[2]._errors).to.equal(undefined);
    expect(errorPeopleList[3]._errors).to.have.lengthOf(1);
    expect(errorPeopleList[4]._errors[0]).to.equal(
      messageIds.UNKNOWN_COURSE_IN_PRIORITIES
    );
    expect(errorPeopleList[3]._errors).to.have.lengthOf(1);
    expect(errorPeopleList[3]._errors[0]).to.equal(
      messageIds.UNKNOWN_COURSE_IN_PRIORITIES
    );
  });

  it("should mark people who have no priorities or holes in the priority list", () => {
    markEmptyOrHolePriorities(errorPeopleList);
    expect(errorPeopleList[0]._errors).to.have.lengthOf(1);
    expect(errorPeopleList[0]._errors[0]).to.equal(
      messageIds.NO_PRIORITIES_FOUND
    );

    expect(errorPeopleList[1]._errors).to.equal(undefined);

    expect(errorPeopleList[2]._errors).to.have.lengthOf(1);
    expect(errorPeopleList[2]._errors[0]).to.equal(messageIds.PRIORITY_HOLES);

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
      messageIds.DUPLICATED_PRIORITIES
    );
  });

  it("should mark people who have not filled all priorities", () => {
    markMissingPriorities(errorPeopleList);
    expect(errorPeopleList[0]._warnings).to.have.lengthOf(1);
    expect(errorPeopleList[0]._warnings[0]).to.equal(
      messageIds.UNFILLED_PRIORITIES
    );

    expect(errorPeopleList[1]._warnings).to.have.lengthOf(1);
    expect(errorPeopleList[1]._warnings[0]).to.equal(
      messageIds.UNFILLED_PRIORITIES
    );

    expect(errorPeopleList[2]._warnings).to.have.lengthOf(1);
    expect(errorPeopleList[2]._warnings[0]).to.equal(
      messageIds.UNFILLED_PRIORITIES
    );

    expect(errorPeopleList[3]._warnings).to.have.lengthOf(1);
    expect(errorPeopleList[3]._warnings[0]).to.equal(
      messageIds.UNFILLED_PRIORITIES
    );

    expect(errorPeopleList[4]._warnings).to.equal(undefined);
  });
});
