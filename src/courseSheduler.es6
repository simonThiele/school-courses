import { preValidateLists } from "./validation";
import messageIds from "./messageIds";

export default function shedule(courseList, peopleList) {
  if (preValidateLists(courseList, peopleList)) {
    return null;
  }

  const courseMap = getCourseListAsMap(courseList);
  const maxPrioLength = getMaxPrioLength(peopleList);
  for (let iP = 0; iP < maxPrioLength; iP++) {
    trySetCourse(iP, courseMap, peopleList);
  }

  const unassignedPeople = getPeopleWhichCantBeAssignedBecauseOfFullCourses(
    peopleList
  );

  const rejectedPeople = rejectAllPeopleWhereAssignedCourseDoesNotFitMinimumRequirements(
    courseList
  );

  return {
    assignedPeople: peopleList.filter(person => person._assignedCourse),
    unassignedPeople,
    rejectedPeople
  };
}

function trySetCourse(priorityIndex, courseMap, peopleList) {
  for (let i = 0; i < peopleList.length; i++) {
    const person = peopleList[i];
    if (person._assignedCourse) {
      continue;
    }

    const courseAtPriority = (person.priorities || [])[priorityIndex];
    const course = courseMap[courseAtPriority];
    if (course) {
      if (course.peopleAttending.length < course.max) {
        course.peopleAttending.push(person);
        person._assignedCourse = course;
      }
    }
  }
}

function getPeopleWhichCantBeAssignedBecauseOfFullCourses(peopleList) {
  return peopleList
    .filter(person => person._assignedCourse == undefined)
    .map(person => {
      person._unassignedReason = messageIds.UNASSIGNABLE_FULL_COURSES;
      return person;
    });
}

function rejectAllPeopleWhereAssignedCourseDoesNotFitMinimumRequirements(
  courseList
) {
  const rejectedPeople = [];
  for (let i = 0; i < courseList.length; i++) {
    const course = courseList[i];
    if (course.peopleAttending.length < course.min) {
      rejectAllPeopleWithAssignedCourse(course, rejectedPeople);
    }
  }
  return rejectedPeople;
}

function rejectAllPeopleWithAssignedCourse(course, rejectedPeople) {
  for (let i = 0; i < course.peopleAttending.length; i++) {
    const person = course.peopleAttending[i];
    delete person._assignedCourse;
    person._unassignedReason = messageIds.UNASSIGNABLE_MIN_COURSE_REQUIREMENTS;
    rejectedPeople.push(person);
  }
}

function getCourseListAsMap(courseList) {
  const coursesAsMap = {};
  for (let i = 0; i < courseList.length; i++) {
    const course = courseList[i];
    course.peopleAttending = [];
    coursesAsMap[course.name] = course;
  }
  return coursesAsMap;
}

function getMaxPrioLength(peopleList) {
  return peopleList
    .map(person => (person.priorities || []).length)
    .reduce((a, b) => (a >= b ? a : b), 0);
}
