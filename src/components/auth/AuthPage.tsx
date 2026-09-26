import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  KeyRound,
  GraduationCap,
} from 'lucide-react';
import { UserRole } from '../../types';

interface AuthPageProps {
  onSuccess?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const { login, register, resetPassword } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Field Operations Division (FOD)');
  const [cadre, setCadre] = useState('Subordinate Statistical Service (SSS)');
  const [requestedRole, setRequestedRole] = useState<UserRole>('learner');
  const [adminCode, setAdminCode] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // UI helpers
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Password strength calculator
  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };
  const passwordStrength = calculatePasswordStrength(password);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Firebase Auth Login Error:', err);
      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/user-not-found'
      ) {
        setErrorMsg('Invalid email or password. Please verify your credentials or create a new account.');
      } else if (err.code === 'auth/invalid-email') {
        setErrorMsg('Please provide a valid official email address format.');
      } else if (err.code === 'auth/too-many-requests') {
        setErrorMsg('Access temporarily blocked due to multiple failed attempts. Please reset password or try again later.');
      } else {
        setErrorMsg(err.message || 'Authentication failed. Please verify your credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name.trim()) {
      setErrorMsg('Please provide your full legal name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please provide a valid official email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-confirm.');
      return;
    }

    if (requestedRole === 'admin' && adminCode !== 'NSSTA_ADMIN_2026') {
      setErrorMsg('Invalid Administrator Passcode. To register as an Administrator, please enter the designated NSSTA security code.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register(email, password, {
        name,
        department,
        cadre,
        role: requestedRole,
        designation: requestedRole === 'admin' ? 'Training Administrator' : 'Statistical Officer Grade II',
      });
      setSuccessMsg('Account registered successfully with Firebase Authentication!');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Firebase Auth Register Error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('An official account with this email address already exists. Please log in instead.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('The password provided is too weak. Please use combinations of letters, numbers, and symbols.');
      } else {
        setErrorMsg(err.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter your registered official email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(email);
      setSuccessMsg(
        `A password reset link has been dispatched to ${email}. Please check your inbox and spam folder.`
      );
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setErrorMsg('No registered account was found with this email address.');
      } else {
        setErrorMsg(err.message || 'Failed to dispatch password reset email.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Subtle Ambience */}
      <div className="absolute top-0 right-1/4 -mt-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 -mb-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Government Institutional Header */}
        <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 text-white p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg mb-3">
              <Building2 className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">SkillSet AI</h1>
            <p className="text-blue-200 text-xs sm:text-sm mt-1 max-w-md">
              Ministry of Statistics & Programme Implementation · NSSTA
            </p>
            <div className="mt-2 text-[11px] text-blue-300 font-semibold bg-white/10 px-3 py-1 rounded-full border border-white/10">
              Official Statistics Capacity Building Platform
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 p-1.5 text-xs font-bold text-slate-600">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-blue-700 shadow-xs font-extrabold'
                : 'hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-blue-700 shadow-xs font-extrabold'
                : 'hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('forgot');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${
              mode === 'forgot'
                ? 'bg-white text-blue-700 shadow-xs font-extrabold'
                : 'hover:text-slate-900'
            }`}
          >
            Password Reset
          </button>
        </div>

        {/* Alerts / Error & Success Feedback */}
        <div className="px-6 sm:px-8 pt-4">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start space-x-2.5 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start space-x-2.5 animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{successMsg}</div>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 pt-4">
          {/* ================= LOGIN FORM ================= */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Official Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="officer.name@mospi.gov.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMsg(null);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center space-x-2 text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Remember this device</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer mt-2"
              >
                <span>{isSubmitting ? 'Authenticating with Firebase...' : 'Sign In to Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Switch to Registration */}
              <div className="pt-4 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-500">
                  New official user?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-blue-600 hover:text-blue-800 font-bold hover:underline cursor-pointer"
                  >
                    Create an official account
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* ================= REGISTRATION FORM ================= */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Legal Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sumanth Sen"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="officer.name@nic.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Department / Wing
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Field Operations Division (FOD)">Field Operations (FOD)</option>
                    <option value="Central Statistics Office (CSO)">Central Statistics (CSO)</option>
                    <option value="Data Processing Division (DPD)">Data Processing (DPD)</option>
                    <option value="Survey Design & Research (SDRD)">Survey Design (SDRD)</option>
                    <option value="NSSTA Training Academy">NSSTA Academy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cadre Affiliation
                  </label>
                  <select
                    value={cadre}
                    onChange={(e) => setCadre(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Subordinate Statistical Service (SSS)">SSS (Subordinate Service)</option>
                    <option value="Indian Statistical Service (ISS)">ISS (Organized Group A)</option>
                    <option value="Junior Statistical Officer (JSO)">Junior Statistical Officer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Min 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password strength bar */}
              {password.length > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Password Strength</span>
                    <span className="font-semibold">
                      {passwordStrength <= 2 ? 'Weak' : passwordStrength <= 4 ? 'Moderate' : 'Strong'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        passwordStrength <= 2
                          ? 'bg-red-500 w-1/3'
                          : passwordStrength <= 4
                          ? 'bg-amber-500 w-2/3'
                          : 'bg-emerald-500 w-full'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Role Selection */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-800">Assigned Platform Role</div>
                <div className="flex space-x-3 text-xs">
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="roleChoice"
                      checked={requestedRole === 'learner'}
                      onChange={() => setRequestedRole('learner')}
                      className="text-blue-600"
                    />
                    <span>Learner (Civil Servant)</span>
                  </label>
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="roleChoice"
                      checked={requestedRole === 'admin'}
                      onChange={() => setRequestedRole('admin')}
                      className="text-indigo-600"
                    />
                    <span>Training Administrator</span>
                  </label>
                </div>

                {requestedRole === 'admin' && (
                  <div className="pt-2 animate-in fade-in duration-150">
                    <label className="block text-[11px] font-semibold text-indigo-900 mb-1">
                      NSSTA Security Authorization Passcode (Demo: <code className="font-mono bg-indigo-100 px-1 py-0.5 rounded">NSSTA_ADMIN_2026</code>)
                    </label>
                    <input
                      type="password"
                      placeholder="Enter administrative passcode"
                      value={adminCode}
                      onChange={(e) => setAdminCode(e.target.value)}
                      className="w-full p-2 text-xs bg-white border border-indigo-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer mt-2"
              >
                <span>{isSubmitting ? 'Registering User in Firebase...' : 'Create Official Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ================= FORGOT PASSWORD FORM ================= */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div className="text-xs text-slate-600 leading-relaxed">
                Enter your registered government email address. We will transmit an official Firebase password reset link enabling you to securely reconfigure your account password.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="officer.name@mospi.gov.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>{isSubmitting ? 'Sending Reset Email...' : 'Send Password Reset Link'}</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="text-xs font-bold text-slate-600 hover:text-blue-700 cursor-pointer"
                >
                  ← Return to Sign In
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-400">
          Protected by Firebase Authentication · End-to-End Encrypted Session
        </div>
      </div>
    </div>
  );
};
