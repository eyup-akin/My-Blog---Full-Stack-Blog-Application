import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="bg-gradient-to-br from-slate-50 to-sky-100 min-h-screen font-sans text-slate-800">
            {/* Hero Section */}
            <div className="border-b border-sky-100/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <h1 className="text-6xl md:text-8xl font-serif font-medium leading-tight tracking-tight text-slate-900">
                            Ice <span className="text-sky-600">Blue</span> <br /> Perspectives.
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-600 max-w-md font-light leading-relaxed">
                            A cool, clear space to read, write, and deepen your understanding of the world.
                        </p>
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/register"
                                className="inline-block bg-sky-600 text-white rounded-full px-10 py-4 text-lg font-medium hover:bg-sky-700 transition-all shadow-lg hover:shadow-sky-200"
                            >
                                Start Reading
                            </Link>
                            <Link
                                to="/login"
                                className="inline-block text-sky-700 hover:text-sky-900 px-6 py-4 text-lg font-medium transition-colors"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                    <div className="hidden md:block relative">
                        {/* Abstract Art */}
                        <div className="w-full h-[500px] relative animate-float">
                            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-sky-200/60 mix-blend-multiply filter blur-xl opacity-70 absolute top-0 left-0 transform -translate-x-4">
                                <path fill="currentColor" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,79.6,-46.6C87.4,-34.2,90.2,-19.4,87.7,-5.2C85.2,8.9,77.5,22.4,68.2,33.5C58.9,44.6,48.1,53.2,36.5,59.3C24.9,65.4,12.5,69,-0.6,70.1C-13.7,71.1,-27.4,69.6,-39.8,63.2C-52.2,56.8,-63.3,45.5,-70.7,32.3C-78.1,19.1,-81.8,4,-79.6,-10.2C-77.4,-24.4,-69.3,-37.7,-58.5,-47.5C-47.7,-57.3,-34.2,-63.6,-20.9,-69.7C-7.6,-75.8,5.5,-81.7,19.7,-79.8" transform="translate(100 100)" />
                            </svg>
                            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-cyan-200/60 mix-blend-multiply filter blur-2xl opacity-70 absolute top-10 right-0">
                                <path fill="currentColor" d="M38.8,-66.1C50.2,-58.4,59.3,-47.4,67.6,-35.6C75.8,-23.8,83.1,-11.2,81.1,0.5C79.1,12.2,67.7,23,57.1,32.3C46.5,41.6,36.6,49.4,25.6,55.4C14.6,61.4,2.5,65.6,-9.3,65.1C-21.1,64.6,-32.7,59.5,-43.3,51.8C-53.9,44.1,-63.6,33.8,-69.9,21.6C-76.2,9.4,-79.1,-4.7,-74.4,-17.1C-69.7,-29.5,-57.4,-40.2,-45,-47.4C-32.6,-54.6,-20.1,-58.3,-7.4,-57.6C5.3,-56.9,10.6,-51.7,27.4,-73.8" transform="translate(100 100)" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
