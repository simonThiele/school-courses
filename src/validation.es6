import messageIds from "./messageIds";

export function preValidateLists(courseList, peopleList) {
  validateParams(courseList, peopleList);
  markMissingPriorities(peopleList);

  const courseMap = getCourseListAsMap(courseList);
  return (
    markUnknwonCourses(courseMap, peopleList) ||
    markEmptyOrHolePriorities(peopleList) ||
    markMissingPriorities(peopleList)
  );
}

function validateParams(courseList, peopleList) {
  if (!Array.isArray(courseList)) {
    throw new Error(messageIds.COURSE_LIST_NOT_VALID);
  }
  if (courseList.length == 0) {
    throw new Error(messageIds.EMPTY_COURSE_LIST);
  }

  if (!Array.isArray(peopleList)) {
    throw new Error(messageIds.PEOPLE_LIST_NOT_VALID);
  }
  if (peopleList.length == 0) {
    throw new Error(messageIds.EMPTY_PEOPLE_LIST);
  }
}

function getCourseListAsMap(courseList) {
  const coursesAsMap = {};
  for (let i = 0; i < courseList.length; i++) {
    coursesAsMap[courseList[i].name] = true;
  }
  return coursesAsMap;
}

export function markUnknwonCourses(courseMap, peopleList) {
  let containsError = false;
  for (let i = 0; i < peopleList.length; i++) {
    const person = peopleList[i];
    if (
      (person.prio1 && !courseMap[person.prio1]) ||
      (person.prio2 && !courseMap[person.prio2]) ||
      (person.prio3 && !courseMap[person.prio3])
    ) {
      createErrorsIfAbsent(person);
      person._errors.push(messageIds.UNKNOWN_COURSE_IN_PRIORITIES);
      containsError = true;
    }
  }
  return containsError;
}

export function markEmptyOrHolePriorities(peopleList) {
  let containsError = false;
  for (let i = 0; i < peopleList.length; i++) {
    const person = peopleList[i];
    if (!person.prio1 && !person.prio2 && !person.prio3) {
      createErrorsIfAbsent(person);
      person._errors.push(messageIds.NO_PRIORITIES_FOUND);
    }
    if (
      (person.prio3 && (!person.prio2 || !person.prio1)) ||
      (person.prio2 && !person.prio1)
    ) {
      createErrorsIfAbsent(person);
      person._errors.push(messageIds.PRIORITY_HOLES);
      containsError = true;
    }
  }
  return containsError;
}

export function markDuplicates(peopleList) {
  let containsError = false;
  for (let i = 0; i < peopleList.length; i++) {
    const person = peopleList[i];

    let prioMap = {};
    let numSetPrios = 0;
    if (person.prio1) {
      prioMap[person.prio1] = true;
      numSetPrios++;
    }
    if (person.prio2) {
      prioMap[person.prio2] = true;
      numSetPrios++;
    }
    if (person.prio3) {
      prioMap[person.prio3] = true;
      numSetPrios++;
    }
    if (numSetPrios !== Object.keys(prioMap).length) {
      createErrorsIfAbsent(person);
      person._errors.push(messageIds.DUPLICATED_PRIORITIES);
      containsError = true;
    }
  }
  return containsError;
}

export function markMissingPriorities(peopleList) {
  for (let i = 0; i < peopleList.length; i++) {
    const person = peopleList[i];
    if (!person.prio1 || !person.prio2 || !person.prio3) {
      createWarningsIfAbsent(person);
      person._warnings.push(messageIds.UNFILLED_PRIORITIES);
    }
  }
}

function createErrorsIfAbsent(person) {
  if (!person._errors) {
    person._errors = [];
  }
}

function createWarningsIfAbsent(person) {
  if (!person._warnings) {
    person._warnings = [];
  }
}
