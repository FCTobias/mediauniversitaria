// src/components/AveragesDisplay.tsx
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Doc } from '../../convex/_generated/dataModel';

type AveragesDisplayProps = {
  courses: Doc<"courses">[];
};

export function AveragesDisplay({ courses }: AveragesDisplayProps) {
  const { t } = useTranslation();

  // Helper function to get the numeric value of a grade, treating 'lode' as 31
  const getGradeValue = (grade: number | "lode" | undefined | null): number => {
    if (grade === 'lode') return 31;
    return typeof grade === 'number' ? grade : 0;
  };

  const { currentAverage, futureAverage, projectedGraduationScore } = useMemo(() => {
    // Current Average: Considers only courses marked as "passed" with a valid grade.
    const passedCourses = courses.filter(c => c.passed && c.grade);
    const currentTotalWeightedGrade = passedCourses.reduce((sum, c) => sum + getGradeValue(c.grade) * c.cfu, 0);
    const currentTotalCfu = passedCourses.reduce((sum, c) => sum + c.cfu, 0);
    const currentAvg = currentTotalCfu > 0 ? (currentTotalWeightedGrade / currentTotalCfu) : 0;

    // Future Average: Considers ALL courses with a grade, regardless of the "passed" status.
    const allCoursesWithGrade = courses.filter(c => c.grade);
    const futureTotalWeightedGrade = allCoursesWithGrade.reduce((sum, c) => sum + getGradeValue(c.grade) * c.cfu, 0);
    const futureTotalCfu = allCoursesWithGrade.reduce((sum, c) => sum + c.cfu, 0);
    const futureAvg = futureTotalCfu > 0 ? (futureTotalWeightedGrade / futureTotalCfu) : 0;

    // Projected Graduation Score based on the future average.
    const graduationScore = futureAvg > 0 ? (futureAvg * 110) / 30 : 0;

    return {
      currentAverage: currentAvg.toFixed(2),
      futureAverage: futureAvg.toFixed(2),
      projectedGraduationScore: graduationScore.toFixed(2)
    };
  }, [courses]);

  return (
    <aside className="averages-container">
      <div className="average-item">
        <h3 className="average-label">{t('currentAverage')}</h3>
        <p className="average-value">{currentAverage}</p>
      </div>
      <div className="average-item">
        <h3 className="average-label">{t('futureAverage')}</h3>
        <p className="average-value">{futureAverage}</p>
      </div>
      <div className="average-item">
        <h3 className="average-label">{t('projectedGraduationScore')}</h3>
        <p className="average-value">{projectedGraduationScore} / 110</p>
      </div>
    </aside>
  );
}