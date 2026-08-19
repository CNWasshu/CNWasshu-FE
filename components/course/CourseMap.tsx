// Metro selects CourseMap.native.tsx or CourseMap.web.tsx at runtime.
// This export keeps TypeScript and non-platform tooling on the web implementation.
export { CourseMap, buildCourseMarkers, groupMarkersByDay } from './CourseMap.web';
