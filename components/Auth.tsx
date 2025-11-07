

import React, { useState } from 'react';
// FIX: Import ChevronLeftIcon to resolve 'Cannot find name' error.
import { TicketIcon, GoogleIcon, EmailIcon, LockIcon, EyeIcon, EyeOffIcon, UserIcon, PhoneIcon, PencilIcon, ChevronLeftIcon } from './Icons';
import { auth } from '../firebase';
// FIX: Import firebase compat to resolve module export errors for auth functions.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const InputField: React.FC<{
    icon: React.FC<{className?: string}>;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onIconClick?: () => void;
    iconClickable?: boolean;
}> = ({ icon: Icon, type, placeholder, value, onChange, onIconClick, iconClickable = false }) => (
    <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-4">
            <Icon className="h-5 w-5 text-gray-400" />
        </span>
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full bg-[#1A1A1A] text-white p-4 pl-12 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
            required
        />
        {onIconClick && (
             <button type="button" onClick={onIconClick} className="absolute inset-y-0 right-0 flex items-center pr-4">
                {iconClickable ? <EyeOffIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
             </button>
        )}
    </div>
);


const Auth: React.FC = () => {
    const [authView, setAuthView] = useState<'welcome' | 'login' | 'signup' | 'reset'>('welcome');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState<{ message: string; isConfigError?: boolean } | null>(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [rePasswordVisible, setRePasswordVisible] = useState(false);

    const handleAuthError = (err: any) => {
        let errorMessage = err.message?.replace('Firebase: ', '') || 'An unknown error occurred.';
        let isConfigError = false;

        switch (err.code) {
            case 'auth/unauthorized-domain':
                errorMessage = 'This domain is not authorized for sign-in operations.';
                isConfigError = true;
                break;
            case 'auth/user-not-found':
                 errorMessage = 'No account found with this email. Please sign up or try another email.';
                 break;
            case 'auth/wrong-password':
                 errorMessage = 'Incorrect password. Please try again.';
                 break;
            case 'auth/email-already-in-use':
                errorMessage = 'An account with this email already exists. Please sign in.';
                break;
        }
        setError({ message: errorMessage, isConfigError });
    };

    const resetState = () => {
        setError(null);
        setSuccessMessage('');
        setEmail('');
        setPassword('');
        setRePassword('');
        setPhoneNumber('');
        setName('');
    };

    const handleEmailPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        resetState();
        setLoading(true);

        try {
            if (authView === 'login') {
                if (!email || !password) {
                    setError({ message: 'Email and password are required.' });
                    setLoading(false);
                    return;
                }
                await auth.signInWithEmailAndPassword(email, password);
            } else if (authView === 'signup') {
                if (!name || !email || !password || !rePassword) {
                    setError({ message: 'Name, email and passwords are required.' });
                    setLoading(false);
                    return;
                }
                if (password !== rePassword) {
                    setError({ message: 'Passwords do not match.' });
                    setLoading(false);
                    return;
                }
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                await userCredential.user.updateProfile({
                    displayName: name,
                    photoURL: `https://i.pravatar.cc/150?u=${userCredential.user.uid}`
                });
            }
        } catch (err: any) {
            handleAuthError(err);
        } finally {
            setLoading(false);
        }
    };
    
    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setError({ message: 'Please enter your email address.' });
            return;
        }
        resetState();
        setLoading(true);
        try {
            await auth.sendPasswordResetEmail(email);
            setSuccessMessage('Password reset link sent! Check your email inbox.');
        } catch (err: any)
 {
            handleAuthError(err);
        } finally {
            setLoading(false);
        }
    };

    const renderErrorMessage = () => {
        if (!error) return null;
        return (
            <div className="bg-red-900/50 border border-red-700 text-red-300 text-sm p-3 rounded-md mb-4 text-center">
                <p>{error.message}</p>
            </div>
        );
    };

    const renderWelcomeView = () => (
        <div className="text-center flex flex-col items-center justify-center h-full">
            <TicketIcon className="w-28 h-28 text-amber-400" />
            <h1 className="text-5xl font-bold mt-6 mb-16">Welcome</h1>
            <div className="w-full max-w-xs space-y-4">
                <button 
                    onClick={() => { setAuthView('login'); resetState(); }} 
                    className="w-full bg-amber-400 text-black font-bold py-4 rounded-full text-lg hover:bg-amber-300 transition-colors"
                >
                    Login
                </button>
                <button 
                    onClick={() => { setAuthView('signup'); resetState(); }} 
                    className="w-full border-2 border-amber-400 text-amber-400 font-bold py-4 rounded-full text-lg hover:bg-amber-400/10 transition-colors"
                >
                    Sign Up
                </button>
            </div>
        </div>
    );

    const renderLoginView = () => (
        <>
            <div className="text-center mb-8">
                <TicketIcon className="w-20 h-20 text-amber-400 mx-auto" />
                <h1 className="text-4xl font-bold mt-4">Login</h1>
            </div>

            {renderErrorMessage()}
            
            <form onSubmit={handleEmailPasswordSubmit} className="space-y-5">
                <InputField icon={EmailIcon} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <InputField 
                    icon={LockIcon} 
                    type={passwordVisible ? "text" : "password"} 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    onIconClick={() => setPasswordVisible(!passwordVisible)}
                    iconClickable={passwordVisible}
                />

                <div className="text-right">
                    <button type="button" onClick={() => { setAuthView('reset'); resetState(); }} className="text-sm font-medium text-amber-400 hover:underline">
                        Forget Password
                    </button>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-amber-400 text-black font-bold py-4 rounded-full text-lg hover:bg-amber-300 transition-colors disabled:bg-amber-600 disabled:cursor-not-allowed">
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <p className="mt-8 text-center text-gray-400">
                Don't Have Account ?
                <button onClick={() => { setAuthView('signup'); resetState(); }} className="font-semibold text-amber-400 hover:underline ml-2">
                    Create One
                </button>
            </p>
        </>
    );

    const renderSignupView = () => (
         <>
            <h1 className="text-4xl font-bold mt-4 text-center mb-6 flex items-center justify-center gap-2">
                Create <TicketIcon className="w-10 h-10 text-amber-400 inline-block"/> Account
            </h1>

            <div className="relative w-28 h-28 mx-auto mb-6">
                <img src={`https://i.pravatar.cc/150?u=${email || 'default'}`} alt="Avatar" className="w-full h-full rounded-full object-cover border-4 border-gray-700" />
                <button className="absolute bottom-0 right-0 bg-amber-400 text-black p-2 rounded-full border-2 border-black">
                    <PencilIcon className="w-4 h-4"/>
                </button>
            </div>

            {renderErrorMessage()}
            
            <form onSubmit={handleEmailPasswordSubmit} className="space-y-4">
                 <InputField icon={UserIcon} type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                 <InputField icon={EmailIcon} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                 <InputField 
                    icon={LockIcon} 
                    type={passwordVisible ? "text" : "password"} 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    onIconClick={() => setPasswordVisible(!passwordVisible)}
                    iconClickable={passwordVisible}
                />
                <InputField 
                    icon={LockIcon} 
                    type={rePasswordVisible ? "text" : "password"} 
                    placeholder="Re-Password" 
                    value={rePassword} 
                    onChange={(e) => setRePassword(e.target.value)}
                    onIconClick={() => setRePasswordVisible(!rePasswordVisible)}
                    iconClickable={rePasswordVisible}
                />
                <InputField icon={PhoneIcon} type="tel" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />

                <button type="submit" disabled={loading} className="w-full bg-amber-400 text-black font-bold py-4 rounded-full text-lg hover:bg-amber-300 transition-colors disabled:bg-amber-600 disabled:cursor-not-allowed mt-6 !mt-6">
                    {loading ? 'Creating...' : 'Create Account'}
                </button>
            </form>

            <p className="mt-8 text-center text-gray-400">
                Already Have Account ?
                <button onClick={() => { setAuthView('login'); resetState(); }} className="font-semibold text-amber-400 hover:underline ml-2">
                    Login
                </button>
            </p>
        </>
    );

    const renderResetPasswordView = () => (
         <>
            <h1 className="text-3xl font-bold mb-2 text-center">Reset Password</h1>
            <p className="text-gray-400 text-center mb-6 text-sm">Enter your email to receive a reset link.</p>

            {renderErrorMessage()}
            {successMessage && <p className="bg-green-500/20 text-green-400 text-sm p-3 rounded-md mb-4 text-center">{successMessage}</p>}
            
            <form onSubmit={handlePasswordReset} className="space-y-6">
                 <InputField icon={EmailIcon} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <button type="submit" disabled={loading} className="w-full bg-amber-400 text-black font-bold py-4 rounded-full text-lg hover:bg-amber-300 transition-colors disabled:bg-amber-600">
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
            </form>
            <p className="mt-8 text-center text-gray-400">
                <button onClick={() => { setAuthView('login'); resetState(); }} className="font-semibold text-amber-400 hover:underline">
                    Back to Login
                </button>
            </p>
        </>
    );
    
    const renderContent = () => {
        switch(authView) {
            case 'login': return renderLoginView();
            case 'signup': return renderSignupView();
            case 'reset': return renderResetPasswordView();
            case 'welcome':
            default:
                return renderWelcomeView();
        }
    }
    
    return (
        <div className="bg-black text-white h-screen w-full max-w-md mx-auto flex flex-col p-6 font-sans animate-fade-in">
            {authView !== 'welcome' && (
                <div className="absolute top-5 left-5">
                    <button onClick={() => { setAuthView('welcome'); resetState(); }}>
                        <ChevronLeftIcon className="w-6 h-6 text-gray-400 hover:text-white"/>
                    </button>
                </div>
            )}
            <div className="w-full flex-grow flex flex-col justify-center">
                {renderContent()}
            </div>
        </div>
    );
};

export default Auth;