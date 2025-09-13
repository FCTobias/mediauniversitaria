// src/components/AuthForm.tsx (Corrected)
import { useState, FormEvent } from "react";
import { useAction } from "convex/react";
import { useTranslation } from "react-i18next";
import { api } from "../../convex/_generated/api";

export function AuthForm() {
  const { t } = useTranslation();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  
  const signIn = useAction(api.auth.signIn);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // --- FIX: Pass arguments inside a 'params' object ---
      // The Password provider's signIn action expects this specific structure.
      await signIn({ params: { email, password } });
    } catch (error: any) {
      alert(`Login Error: ${error.data ?? "Invalid credentials"}`);
    }
  };

  return (
    <div className="auth-wrapper">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 style={{ textAlign: 'center', marginTop: 0 }}>{t('login')}</h2>
        <div className="form-group">
          <label htmlFor="email">{t('email')}</label>
          <input 
            id="email" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            autoComplete="email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">{t('password')}</label>
          <input 
            id="password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            autoComplete="current-password"
          />
        </div>
        <div className="auth-buttons">
          <button type="submit" className="btn btn-primary" style={{width: "100%"}}>{t('signIn')}</button>
        </div>
      </form>
    </div>
  );
}