// src/components/UploadModal.tsx
import { useState, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import * as XLSX from 'xlsx';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

type UploadModalProps = { onClose: () => void; };

export function UploadModal({ onClose }: UploadModalProps) {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const addCourses = useMutation(api.courses.addCoursesFromExcel);

  const handleUpload = async () => {
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });

    const coursesToUpload: { name: string; cfu: number; grade?: number | 'lode' }[] = [];
    
    json.slice(0, 100).forEach(row => {
      const name = row[0];
      const cfu = parseInt(row[1], 10);
      let gradeInput = row[2];

      if (typeof name === 'string' && name.trim() && !isNaN(cfu) && cfu > 0) {
        let grade: number | 'lode' | undefined;
        if (typeof gradeInput === 'string' && gradeInput.toLowerCase().includes('lode')) {
          grade = 'lode';
        } else {
          const numGrade = parseInt(gradeInput, 10);
          if (numGrade >= 18 && numGrade <= 30) grade = numGrade;
        }
        coursesToUpload.push({ name: name.trim(), cfu, grade });
      }
    });

    if (coursesToUpload.length > 0) {
      await addCourses({ courses: coursesToUpload });
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t('excelUploadTitle')}</h2>
          <button className="btn btn-icon" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <p className="requirements">{t('excelRequirements')}</p>
          <input type="file" accept=".xlsx, .xls" onChange={(e: ChangeEvent<HTMLInputElement>) => setFile(e.target.files?.[0] ?? null)} />
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>{t('close')}</button>
          <button className="btn btn-primary" onClick={handleUpload} disabled={!file}>{t('upload')}</button>
        </div>
      </div>
    </div>
  );
}