

import React, { useState } from 'react';
// FIX: Import ChevronLeftIcon to resolve 'Cannot find name' error.
import { RIYOBOXLogo, GoogleIcon, EmailIcon, LockIcon, EyeIcon, EyeOffIcon, UserIcon, PhoneIcon, PencilIcon, ChevronLeftIcon, TicketIcon } from './Icons';
import { auth } from '../firebase';
// FIX: Import firebase compat to resolve module export errors for auth functions.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const avatars = Array.from({ length: 9 }, (_, i) => `https://i.pravatar.cc/150?img=${i + 1}`);

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
    const [selectedAvatar, setSelectedAvatar] = useState(avatars[8]);
    const [isAvatarGridVisible, setIsAvatarGridVisible] = useState(false);

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
        setIsAvatarGridVisible(false);
    };

    const handleEmailPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        setError(null);
        setSuccessMessage('');
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
                    setError({ message: 'All fields are required.' });
                    setLoading(false);
                    return;
                }
                if (password !== rePassword) {
                    setError({ message: 'Passwords do not match.' });
                    setLoading(false);
                    return;
                }
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                if (userCredential.user) {
                  await userCredential.user.updateProfile({
                      displayName: name,
                      photoURL: selectedAvatar,
                  });
                }
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
        setError(null);
        setSuccessMessage('');
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
        <div className="text-center flex flex-col items-center h-full py-20">
            <RIYOBOXLogo className="h-10 text-white" />
            <div className="w-full max-w-xs space-y-4 mt-auto">
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
            <RIYOBOXLogo className="h-10 text-white mx-auto mb-16" />
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
                        Forgot Password?
                    </button>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-amber-400 text-black font-bold py-4 rounded-full text-lg hover:bg-amber-300 transition-colors disabled:bg-amber-600 disabled:cursor-not-allowed">
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <p className="mt-8 text-center text-gray-400">
                Don't Have an Account?
                <button onClick={() => { setAuthView('signup'); resetState(); }} className="font-semibold text-amber-400 hover:underline ml-2">
                    Create One
                </button>
            </p>
        </>
    );

    const renderSignupView = () => (
         <>
            <RIYOBOXLogo className="h-10 text-white mx-auto mb-8" />
            <div className="flex flex-col items-center mb-6">
                <div className="relative">
                    <img src={selectedAvatar} alt="Selected Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-gray-700" />
                    <button 
                        type="button" 
                        onClick={() => setIsAvatarGridVisible(true)}
                        className="absolute bottom-0 right-0 bg-amber-400 rounded-full p-1.5 border-2 border-black hover:bg-amber-300 transition-colors"
                    >
                        <PencilIcon className="w-4 h-4 text-black" />
                    </button>
                </div>
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
                    placeholder="Re-enter Password" 
                    value={rePassword} 
                    onChange={(e) => setRePassword(e.target.value)}
                    onIconClick={() => setRePasswordVisible(!rePasswordVisible)}
                    iconClickable={rePasswordVisible}
                />
                
                {isAvatarGridVisible && (
                    <div id="avatar-grid" className="pt-4 animate-fade-in">
                        <p className="text-center text-gray-400 mb-4">Pick an Avatar</p>
                        <div className="grid grid-cols-3 gap-4">
                            {avatars.map(avatarUrl => (
                                <button
                                    type="button"
                                    key={avatarUrl}
                                    onClick={() => {
                                        setSelectedAvatar(avatarUrl);
                                        setIsAvatarGridVisible(false);
                                    }}
                                    className={`rounded-full overflow-hidden transition-all duration-200 ${selectedAvatar === avatarUrl ? 'ring-4 ring-amber-400 scale-110' : 'hover:ring-2 hover:ring-gray-600'}`}
                                >
                                    <img src={avatarUrl} alt="Avatar option" className="w-full h-full object-cover"/>
                                </button>
                            ))}
                        </div>
                    </div>
                )}


                <button type="submit" disabled={loading} className="w-full bg-amber-400 text-black font-bold py-4 rounded-full text-lg hover:bg-amber-300 transition-colors disabled:bg-amber-600 disabled:cursor-not-allowed mt-6 !mt-6">
                    {loading ? 'Creating...' : 'Confirm'}
                </button>
            </form>

            <p className="mt-8 text-center text-gray-400">
                Already Have an Account?
                <button onClick={() => { setAuthView('login'); resetState(); }} className="font-semibold text-amber-400 hover:underline ml-2">
                    Login
                </button>
            </p>
        </>
    );

    const renderResetPasswordView = () => (
         <>
            <RIYOBOXLogo className="h-10 text-white mx-auto mb-16" />
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
                <div className="absolute top-5 left-5 z-10">
                    <button onClick={() => { setAuthView('welcome'); resetState(); }}>
                        <ChevronLeftIcon className="w-6 h-6 text-gray-400 hover:text-white"/>
                    </button>
                </div>
            )}
            <div className="w-full flex-grow flex flex-col justify-center">
                <div className="overflow-y-auto no-scrollbar py-8">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Auth;