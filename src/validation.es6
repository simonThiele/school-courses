import messageIds from "./messageIds";

export function preValidateLists(courseList, peopleList) {
  validateParams(courseList, peopleList);

  const courseMap = getCourseListAsMap(courseList);
  return (
    markUnknwonCourses(courseMap, peopleList) ||
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
    const priorities = person.priorities || [];
    for (let iP = 0; iP < priorities.length; iP++) {
      if (!courseMap[priorities[iP]]) {
        createErrorsIfAbsent(person);
        person._errors.push(messageIds.UNKNOWN_COURSE_IN_PRIORITIES);
        containsError = true;
        break;
      }
    }
  }
  return containsError;
}

export function markMissingPriorities(peopleList) {
  let containsError = false;
  for (let i = 0; i < peopleList.length; i++) {
    const person = peopleList[i];
    if (!person.priorities || person.priorities.length === 0) {
      createErrorsIfAbsent(person);
      person._errors.push(messageIds.NO_PRIORITIES_FOUND);
      containsError = true;
    }
  }
  return containsError;
}

export function markDuplicates(peopleList) {
  let containsError = false;
  for (let i = 0; i < peopleList.length; i++) {
    const person = peopleList[i];
    if (!person.priorities || person.priorities === 0) {
      continue;
    }

    let prioMap = {};
    for (let iP = 0; iP < person.priorities.length; iP++) {
      prioMap[person.priorities[iP]] = true;
    }

    if (person.priorities.length !== Object.keys(prioMap).length) {
      createErrorsIfAbsent(person);
      person._errors.push(messageIds.DUPLICATED_PRIORITIES);
      containsError = true;
    }
  }
  return containsError;
}

function createErrorsIfAbsent(person) {
  if (!person._errors) {
    person._errors = [];
  }
}
