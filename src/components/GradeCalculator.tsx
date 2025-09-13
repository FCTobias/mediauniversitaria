// src/components/GradeCalculator.tsx
import { useMutation, useQuery } from 'convex/react';
import { useTranslation } from 'react-i18next';
import { api } from '../../convex/_generated/api';
import { AveragesDisplay } from './AveragesDisplay';
import { CourseRow } from './CourseRow';

export function GradeCalculator() {
  const { t } = useTranslation();
  // Fetch courses and default to an empty array while loading or if there are none
  const courses = useQuery(api.courses.getCourses) ?? [];
  const addCourse = useMutation(api.courses.addCourse);

  return (
    <div className="main-content">
      <main className="calculator-container">
        <div className="table-wrapper">
          <table className="grades-table">
            <thead>
              <tr>
                <th>{t('courseName')}</th>
                <th>{t('cfu')}</th>
                <th>{t('grade')}</th>
                <th>{t('passed')}</th>
                <th>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <CourseRow key={course._id} course={course} />
              ))}
            </tbody>
          </table>
        </div>
        <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => addCourse()}>
          {t('addCourse')}
        </button>
      </main>
      <AveragesDisplay courses={courses} />
    </div>
  );
}