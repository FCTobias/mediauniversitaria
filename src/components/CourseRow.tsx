// src/components/CourseRow.tsx
import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { useMutation } from 'convex/react';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import { api } from '../../convex/_generated/api';
import { Doc } from '../../convex/_generated/dataModel';

type CourseRowProps = {
  course: Doc<"courses">;
};

export function CourseRow({ course }: CourseRowProps) {
  const { t } = useTranslation();
  const [name, setName] = useState<string>(course.name);
  const [cfu, setCfu] = useState<number>(course.cfu);
  const [grade, setGrade] = useState<string | number>(course.grade ?? '');
  const [passed, setPassed] = useState<boolean>(course.passed);
  
  const updateCourse = useMutation(api.courses.updateCourse);
  const deleteCourse = useMutation(api.courses.deleteCourse);
  
  const debounceTimeout = useRef<number | null>(null);

  // Syncs local state if the course data from Convex changes
  useEffect(() => {
    setName(course.name);
    setCfu(course.cfu);
    setGrade(course.grade ?? '');
    setPassed(course.passed);
  }, [course]);

  // Debounced effect to save changes to the backend
  useEffect(() => {
    // Clear previous timeout on every change
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    // Set a new timeout to trigger the update after 500ms of inactivity
    debounceTimeout.current = window.setTimeout(() => {
      const finalGrade = grade === 'lode' ? 'lode' : (Number(grade) || undefined);
      
      const hasChanged = name !== course.name || cfu !== course.cfu || finalGrade !== course.grade || passed !== course.passed;
      
      if (hasChanged) {
        updateCourse({
          courseId: course._id,
          name,
          cfu,
          grade: finalGrade,
          passed,
        });
      }
    }, 500);

    // Cleanup function to clear timeout on component unmount
    return () => { if (debounceTimeout.current) clearTimeout(debounceTimeout.current); };
  }, [name, cfu, grade, passed, course, updateCourse]);

  const handleGradeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newGrade = e.target.value;
    setGrade(newGrade);
    // Automatically mark as passed if a grade is selected
    if (newGrade !== '') setPassed(true);
  };
  
  return (
    <tr>
      <td><input type="text" className="table-input" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('courseName')} /></td>
      <td><input type="number" className="table-input" value={cfu} onChange={(e) => setCfu(Number(e.target.value))} min="0" /></td>
      <td>
        <select className="table-select" value={grade} onChange={handleGradeChange}>
          <option value="">{t('noGrade')}</option>
          {Array.from({ length: 13 }, (_, i) => 18 + i).map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
          <option value="lode">{t('gradeLode')}</option>
        </select>
      </td>
      <td style={{ textAlign: 'center' }}>
        <input type="checkbox" className="passed-checkbox" checked={passed} onChange={(e) => setPassed(e.target.checked)} />
      </td>
      <td style={{ textAlign: 'center' }}>
        <button className="btn btn-icon delete-btn" onClick={() => deleteCourse({ courseId: course._id })}>
          <Trash2 size={18} />
        </button>
      </td>
    </tr>
  );
}