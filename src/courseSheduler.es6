import { preValidateLists } from "../src/validation";

export default function shedule(courseList, peopleList) {
  if (preValidateLists(courseList, peopleList)) {
    return;
  }

  const courseMap = getCourseListAsMap(courseList);
  trySetCourse("prio1", courseMap, peopleList);
  trySetCourse("prio2", courseMap, peopleList);
  trySetCourse("prio3", courseMap, peopleList);

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

function trySetCourse(priority, courseMap, peopleList) {
  for (let i = 0; i < peopleList.length; i++) {
    const person = peopleList[i];
    if (person._assignedCourse) {
      continue;
    }

    const courseAtPriority = person[priority];
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
    .map(
      person =>
        (person._unassignedReason =
          "Person can't be assigned to one of the given priorities. Courses are full")
    );
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
    person._unassignedReason =
      "Assigned course  does not fit the minimum requirements";
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
