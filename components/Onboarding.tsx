import React, { useState } from 'react';

interface OnboardingProps {
    onComplete: () => void;
}

const WelcomeIllustration: React.FC = () => (
    <svg viewBox="0 0 300 200" className="w-full h-auto">
        <g transform="translate(150, 100)">
            <circle cx="0" cy="0" r="80" fill="#1E293B" />
            <path d="M-40 -50 H 40 V 50 H -40 Z" fill="#FDE047"/>
            <circle cx="0" cy="0" r="30" fill="#0F172A"/>
            <circle cx="0" cy="0" r="10" fill="#FDE047"/>
            <path d="M-60 60 L-50 40 L-30 50 L-40 70Z" fill="#FBBF24" opacity="0.6"/>
            <path d="M60 60 L50 40 L30 50 L40 70Z" fill="#FBBF24" opacity="0.6"/>
             <path d="M-50 -70 L-40 -90 L-20 -80 L-30 -60Z" fill="#FBBF24" opacity="0.6"/>
            <path d="M50 -70 L40 -90 L20 -80 L30 -60Z" fill="#FBBF24" opacity="0.6"/>
        </g>
    </svg>
);

const DownloadIllustration: React.FC = () => (
    <svg viewBox="0 0 300 200" className="w-full h-auto">
         <rect x="90" y="40" width="120" height="150" rx="10" fill="#1E293B" stroke="#475569" strokeWidth="2"/>
         <rect x="100" y="50" width="100" height="110" fill="#0F172A"/>
         <circle cx="150" cy="105" r="30" fill="#FDE047"/>
         <path d="M142 98 V 108 H 135 L 150 120 L 165 108 H 158 V 98 Z" fill="#0F172A"/>
    </svg>
);

const ProfilesIllustration: React.FC = () => (
     <svg viewBox="0 0 300 200" className="w-full h-auto">
        <circle cx="150" cy="100" r="50" fill="#FDE047"/>
        <circle cx="150" cy="80" r="15" fill="#1E293B"/>
        <path d="M120 120 A 30 30 0 0 0 180 120Z" fill="#1E293B"/>
        <circle cx="80" cy="110" r="40" fill="#FBBF24"/>
        <circle cx="80" cy="95" r="10" fill="#1E293B"/>
        <path d="M60 125 A 20 20 0 0 0 100 125Z" fill="#1E293B"/>
        <circle cx="220" cy="110" r="40" fill="#FBBF24"/>
        <circle cx="220" cy="95" r="10" fill="#1E293B"/>
        <path d="M200 125 A 20 20 0 0 0 240 125Z" fill="#1E293B"/>
    </svg>
);

const WatchlistIllustration: React.FC = () => (
    <svg viewBox="0 0 300 200" className="w-full h-auto">
        <rect x="70" y="50" width="160" height="100" rx="8" fill="#1E293B"/>
        <rect x="70" y="50" width="160" height="20" rx="0" fill="#475569"/>
        <rect x="80" y="80" width="60" height="60" rx="4" fill="#FBBF24"/>
        <path d="M160 85 h 60 M160 100 h 40 M160 115 h 50" stroke="#475569" strokeWidth="4" strokeLinecap="round"/>
        <circle cx="210" cy="60" r="25" fill="#FDE047"/>
        <path d="M202 60 H 218 M 210 52 V 68" stroke="#1E293B" strokeWidth="4" strokeLinecap="round"/>
    </svg>
);

const EnjoyIllustration: React.FC = () => (
    <svg viewBox="0 0 300 200" className="w-full h-auto">
        <path d="M150 40 L165 80 L210 85 L175 115 L185 160 L150 135 L115 160 L125 115 L90 85 L135 80 Z" fill="#FDE047"/>
    </svg>
);


const onboardingSteps = [
    {
        illustration: <WelcomeIllustration />,
        title: "Welcome to RIYOBOX!",
        text: "Discover a huge library of high-quality movies and shows. Watch whatever you want, whenever you want."
    },
    {
        illustration: <DownloadIllustration />,
        title: "Watch Anywhere, Anytime",
        text: "Download your favorite titles to your device and enjoy them on the go, even without an internet connection."
    },
    {
        illustration: <ProfilesIllustration />,
        title: "Personalized For You",
        text: "Create separate profiles for everyone in your family for a unique and tailored experience."
    },
    {
        illustration: <WatchlistIllustration />,
        title: "Never Lose a Find",
        text: "Use your Watchlist to save movies and shows you want to watch later. Your next favorite is just a tap away."
    },
    {
        illustration: <EnjoyIllustration />,
        title: "Ready to Dive In?",
        text: "Your cinematic journey begins now. Press the button below to start exploring."
    }
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [step, setStep] = useState(0);

    const handleNext = () => {
        if (step < onboardingSteps.length - 1) {
            setStep(step + 1);
        } else {
            onComplete();
        }
    };

    const handleBack = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };

    const currentStep = onboardingSteps[step];

    return (
        <div className="bg-[#10111A] h-screen w-full max-w-md mx-auto flex flex-col font-sans text-white overflow-hidden">
            <div className="flex-grow flex items-center justify-center p-8">
                {currentStep.illustration}
            </div>
            <div className="flex-shrink-0 bg-amber-400 text-black text-center rounded-t-[40px] p-8 pt-10">
                <h2 className="text-3xl font-bold mb-3">{currentStep.title}</h2>
                <p className="text-md text-slate-800 mb-8 h-12">{currentStep.text}</p>
                <div className="flex items-center justify-center space-x-2 mb-8">
                    {onboardingSteps.map((_, index) => (
                        <div key={index} className={`w-2 h-2 rounded-full transition-all duration-300 ${step === index ? 'bg-black w-4' : 'bg-black/30'}`}></div>
                    ))}
                </div>
                <div className="space-y-3">
                    <button 
                        onClick={handleNext} 
                        className="w-full bg-white text-black font-bold py-4 rounded-full text-lg hover:bg-gray-200 transition-colors"
                    >
                        {step === onboardingSteps.length - 1 ? "Get Started" : "Next"}
                    </button>
                    {step > 0 && (
                        <button 
                            onClick={handleBack} 
                            className="w-full text-black/60 font-semibold py-2 rounded-full text-md hover:text-black transition-colors"
                        >
                            Back
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
