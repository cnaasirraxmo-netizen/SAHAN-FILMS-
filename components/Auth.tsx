import React, { useState } from 'react';
import { PrimeLogo, GoogleIcon } from './Icons';
import { auth } from '../firebase';
// FIX: Use modular imports for Firebase v9+ SDK auth functions.
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    updateProfile, 
    GoogleAuthProvider, 
    signInWithPopup, 
    sendPasswordResetEmail 
} from 'firebase/auth';

const Auth: React.FC = () => {
    const [authView, setAuthView] = useState<'login' | 'signup' | 'reset'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState<{ message: string; isConfigError?: boolean } | null>(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

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
    };

    const handleEmailPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError({ message: 'Email and password are required.' });
            return;
        }
        if (authView === 'signup' && !name) {
            setError({ message: 'Name is required for registration.' });
            return;
        }
        resetState();
        setLoading(true);

        try {
            if (authView === 'login') {
                // FIX: Use modularly imported signInWithEmailAndPassword function.
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                // FIX: Use modularly imported createUserWithEmailAndPassword function.
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                // FIX: Use modularly imported updateProfile function.
                await updateProfile(userCredential.user, {
                    displayName: name,
                    photoURL: `https://picsum.photos/seed/${name.toLowerCase()}/200`
                });
            }
        } catch (err: any) {
            handleAuthError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        // FIX: Use modularly imported GoogleAuthProvider class.
        const provider = new GoogleAuthProvider();
        resetState();
        setLoading(true);
        try {
            // FIX: Use modularly imported signInWithPopup function.
            await signInWithPopup(auth, provider);
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
            // FIX: Use modularly imported sendPasswordResetEmail function.
            await sendPasswordResetEmail(auth, email);
            setSuccessMessage('Password reset link sent! Check your email inbox.');
        } catch (err: any) {
            handleAuthError(err);
        } finally {
            setLoading(false);
        }
    };

    const renderErrorMessage = () => {
        if (!error) return null;

        return (
            <div className="bg-red-900/50 border border-red-700 text-red-300 text-sm p-3 rounded-md mb-4 text-left">
                <p className="font-bold text-center mb-2 text-red-200">Authentication Error</p>
                <p className="text-center">{error.message}</p>
                {error.isConfigError && (
                    <div className="mt-3 pt-3 border-t border-red-400/30 text-xs">
                        <p className="font-semibold mb-1 text-red-200">How to fix:</p>
                        <ol className="list-decimal list-inside space-y-1">
                            <li>Go to your <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Firebase Console</a>.</li>
                            <li>Navigate to <strong>Authentication</strong> &gt; <strong>Settings</strong> tab.</li>
                            <li>Under <strong>Authorized domains</strong>, click <strong>Add domain</strong>.</li>
                            <li>Enter the domain where this app is running and click Add.</li>
                        </ol>
                        <p className="mt-2">This is a configuration issue, not a code problem.</p>
                    </div>
                )}
            </div>
        );
    };

    const renderResetPasswordView = () => (
        <>
            <h1 className="text-3xl font-bold mb-2 text-center">Reset Password</h1>
            <p className="text-gray-400 text-center mb-6 text-sm">Enter your email to receive a reset link.</p>

            {renderErrorMessage()}
            {successMessage && <p className="bg-green-500/20 text-green-400 text-sm p-3 rounded-md mb-4 text-center">{successMessage}</p>}
            
            <form onSubmit={handlePasswordReset} className="space-y-6">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-700 p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <button type="submit" disabled={loading} className="w-full bg-sky-600 hover:bg-sky-500 p-3 rounded-md font-semibold text-lg transition-colors disabled:bg-sky-800 disabled:cursor-not-allowed">
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
            </form>
            <p className="mt-8 text-center text-gray-400">
                <button onClick={() => { setAuthView('login'); resetState(); }} className="font-semibold text-sky-400 hover:underline">
                    Back to Sign In
                </button>
            </p>
        </>
    );

    const renderLoginSignupView = () => (
        <>
            <h1 className="text-3xl font-bold mb-6 text-center">{authView === 'login' ? 'Sign In' : 'Create Account'}</h1>
            {renderErrorMessage()}

            <form onSubmit={handleEmailPasswordSubmit} className="space-y-4">
                {authView === 'signup' && (
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-gray-700 p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                )}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-700 p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-gray-700 p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    {authView === 'login' && (
                        <div className="text-right mt-2">
                             <button type="button" onClick={() => { setAuthView('reset'); resetState(); }} className="text-sm font-medium text-sky-400 hover:underline">
                                Forgot Password?
                            </button>
                        </div>
                    )}
                </div>
                <button type="submit" disabled={loading} className="w-full bg-sky-600 hover:bg-sky-500 p-3 rounded-md font-semibold text-lg transition-colors disabled:bg-sky-800 disabled:cursor-not-allowed">
                    {loading ? 'Processing...' : (authView === 'login' ? 'Sign In' : 'Sign Up')}
                </button>
            </form>

            <div className="my-6 flex items-center">
                <div className="flex-grow border-t border-gray-600"></div>
                <span className="flex-shrink mx-4 text-gray-400">OR</span>
                <div className="flex-grow border-t border-gray-600"></div>
            </div>

            <button onClick={handleGoogleSignIn} disabled={loading} className="w-full bg-white text-black p-3 rounded-md font-semibold flex items-center justify-center space-x-2 hover:bg-gray-200 transition-colors disabled:bg-gray-300">
                <GoogleIcon className="w-6 h-6" />
                <span>Sign in with Google</span>
            </button>

            <p className="mt-8 text-center text-gray-400">
                {authView === 'login' ? "Don't have an account?" : "Already have an account?"}
                <button onClick={() => { setAuthView(authView === 'login' ? 'signup' : 'login'); resetState(); }} className="font-semibold text-sky-400 hover:underline ml-2">
                    {authView === 'login' ? 'Sign Up' : 'Sign In'}
                </button>
            </p>
        </>
    );
    
    return (
        <div className="bg-black text-white h-screen w-full max-w-md mx-auto flex flex-col items-center justify-center p-8 animate-fade-in">
            <PrimeLogo className="h-10 mb-12" />
            <div className="w-full bg-[#181818] p-8 rounded-lg shadow-2xl border border-gray-800">
                {authView === 'reset' ? renderResetPasswordView() : renderLoginSignupView()}
            </div>
        </div>
    );
};

export default Auth;