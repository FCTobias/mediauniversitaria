// src/App.tsx (Corrected)
import { useState, useEffect } from "react";
import { useConvexAuth } from "convex/react";
import { useTranslation } from "react-i18next";
// --- FIX: Changed the import path to be relative ---
import { AuthForm } from "./components/AuthForm";
import { GradeCalculator } from "./components/GradeCalculator";
import { Navbar } from "./components/Navbar";

function App() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { t } = useTranslation();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const renderContent = () => {
    // This logic is correct. It shows a loading state,
    // then either the calculator or the login form.
    if (isLoading) {
      return <div>{t('loading')}</div>;
    }
    return isAuthenticated ? <GradeCalculator /> : <AuthForm />;
  };

  return (
    <>
      <Navbar
        isAuthenticated={isAuthenticated}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />
      <div className="container">{renderContent()}</div>
    </>
  );
}

export default App;