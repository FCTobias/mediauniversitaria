import { useState, FormEvent } from "react";
import { useAction } from "convex/react"; // <-- Import useAction instead of useMutation
import { useTranslation } from "react-i18next";
import { api } from "../../convex/_generated/api";

export function AuthForm() {
  const { t } = useTranslation();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  
  // Use the useAction hook to call the signIn action
  const signIn = useAction(api.auth.signIn);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // The logic for calling the action remains the same
      await signIn({ email, password });
    } catch (error: any) {
      // Display a user-friendly error message if login fails
      alert(`Errore di accesso: ${error.data ?? "Credenziali non valide"}`);
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
