import { courseApi, getCourseErrorMessage } from '@/api/courseApi';
import type { CourseDetail, CourseSummary } from '@/types/course';
import { useCallback, useEffect, useState } from 'react';

export function useCourses() {
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCourses(await courseApi.getCourses());
    } catch (requestError) {
      setError(getCourseErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  return { courses, loading, error, refetch };
}

export function useCourse(courseId: number | null) {
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (courseId == null) {
      setError('올바르지 않은 코스 번호입니다.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setCourse(await courseApi.getCourse(courseId));
    } catch (requestError) {
      setError(getCourseErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => { void refetch(); }, [refetch]);
  return { course, loading, error, refetch };
}
