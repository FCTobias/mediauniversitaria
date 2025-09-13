// src/components/Navbar.tsx
import { useState } from 'react';
import { useMutation, useQuery } from "convex/react";
import { useTranslation } from 'react-i18next';
import { Sun, Moon, Upload, Download, LogOut } from 'lucide-react';
import { UploadModal } from './UploadModal';
import { api } from '../../convex/_generated/api';

type NavbarProps = {
  isAuthenticated: boolean;
  isDarkMode: boolean;
  toggleTheme: () => void;
};

export function Navbar({ isAuthenticated, isDarkMode, toggleTheme }: NavbarProps) {
  const { t, i18n } = useTranslation();
  const signOut = useMutation(api.auth.signOut);
  const courses = useQuery(api.courses.getCourses);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'it' ? 'en' : 'it');
  };

  const handleDownload = () => {
    if (!courses) return;
    const dataStr = JSON.stringify(courses, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'i-miei-voti.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <nav className="navbar">
        <h1 style={{ fontSize: '1.25rem', margin: 0 }}>🎓 Calcolatore Media</h1>
        <div className="navbar-actions">
          {isAuthenticated && (
            <>
              <button className="btn btn-icon" title={t('uploadExcel')} onClick={() => setIsModalOpen(true)}><Upload size={20} /></button>
              <button className="btn btn-icon" title={t('downloadData')} onClick={handleDownload}><Download size={20} /></button>
            </>
          )}
          <button className="btn btn-icon" onClick={toggleTheme}>{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
          <button className="btn btn-lang" onClick={toggleLanguage}>{i18n.language.toUpperCase()}</button>
          {isAuthenticated && <button className="btn btn-icon" title={t('logout')} onClick={() => signOut()}><LogOut size={20} /></button>}
        </div>
      </nav>
      {isModalOpen && <UploadModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}