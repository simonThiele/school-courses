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
    throw new Error("The first param (coursList) is not a valid array");
  }
  if (courseList.length == 0) {
    throw new Error("The first param (coursList) is empty");
  }

  if (!Array.isArray(peopleList)) {
    throw new Error("The second param (peopleList) is not a valid array");
  }
  if (peopleList.length == 0) {
    throw new Error("The second param (peopleList) is empty");
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
      person._errors.push("At least one of the given courses is unknown");
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
      person._errors.push("There are no priorities given");
    }
    if (
      (person.prio3 && (!person.prio2 || !person.prio1)) ||
      (person.prio2 && !person.prio1)
    ) {
      createErrorsIfAbsent(person);
      person._errors.push("Skipping priorities is not allowed");
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
      person._errors.push("There are duplicates in the priorities");
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
      person._warnings.push("There are not all priorities filled");
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
