import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, ArrowRight, X } from 'lucide-react';

export default function QuizArea({ questions, onFinish, onCancel }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [answers, setAnswers] = useState({});
    const [isChecked, setIsChecked] = useState(false);
    const [startTime] = useState(Date.now());
    const [timeLeft, setTimeLeft] = useState(questions.length * 60);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleFinishQuiz();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const currentQ = questions[currentIndex];

    const handleOptionSelect = (option) => {
        if (isChecked) return;
        setSelectedOption(option);
    };

    const handleCheck = () => {
        if (!selectedOption) return;
        setIsChecked(true);

        const isCorrect = selectedOption === currentQ.answer;
        import('../utils/sounds').then(m => {
            if (isCorrect) m.playCorrectSound();
            else m.playIncorrectSound();
        });

        setAnswers(prev => ({
            ...prev,
            [currentQ.text]: {
                selected: selectedOption,
                correct: currentQ.answer,
                isCorrect: isCorrect,
                points: currentQ.points || 1
            }
        }));
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsChecked(false);
        } else {
            handleFinishQuiz();
        }
    };

    const handleFinishQuiz = () => {
        import('../utils/sounds').then(m => m.playFinishSound());
        const timeTaken = Math.floor((Date.now() - startTime) / 1000);
        let finalScore = 0;

        // We calculate from answers state, plus the current one if checked but not nexted
        const currentAnswers = { ...answers };
        if (selectedOption && !isChecked) {
            currentAnswers[currentQ.text] = {
                selected: selectedOption,
                correct: currentQ.answer,
                isCorrect: selectedOption === currentQ.answer,
                points: currentQ.points || 1
            };
        }

        Object.values(currentAnswers).forEach(ans => {
            if (ans.isCorrect) finalScore += ans.points;
        });

        onFinish(finalScore, currentAnswers, timeTaken);
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
        <div className="w-full max-w-3xl mx-auto">
            {/* Header Info */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-2 text-slate-500 font-medium">
                    <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
                        Question {currentIndex + 1} of {questions.length}
                    </span>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-slate-600 font-medium bg-white px-3 py-1 rounded-full shadow-sm border border-slate-200">
                        <Clock className="w-4 h-4 text-primary-500" />
                        <span className={timeLeft < 60 ? 'text-rose-500' : ''}>{formatTime(timeLeft)}</span>
                    </div>
                    <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors p-1" title="Cancel Quiz">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 rounded-full h-2 mb-8 overflow-hidden">
                <motion.div
                    className="bg-primary-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10"
                >
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-8 leading-relaxed">
                        {currentQ.text}
                    </h2>

                    <div className="space-y-4">
                        {currentQ.options.map((opt, idx) => {
                            const isSelected = selectedOption === opt;
                            let btnClass = "w-full text-left p-4 sm:p-5 rounded-xl border-2 transition-all duration-200 flex items-center justify-between ";

                            if (!isChecked) {
                                btnClass += isSelected
                                    ? "border-primary-500 bg-primary-50 text-primary-800"
                                    : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50";
                            } else {
                                if (opt === currentQ.answer) {
                                    btnClass += "border-emerald-500 bg-emerald-50 text-emerald-800";
                                } else if (isSelected) {
                                    btnClass += "border-rose-500 bg-rose-50 text-rose-800";
                                } else {
                                    btnClass += "border-slate-200 text-slate-400 opacity-60";
                                }
                            }

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleOptionSelect(opt)}
                                    disabled={isChecked}
                                    className={btnClass}
                                >
                                    <span className="font-medium text-[15px] sm:text-base">{opt}</span>
                                    {isChecked && opt === currentQ.answer && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
                                    {isChecked && isSelected && opt !== currentQ.answer && <XCircle className="w-5 h-5 text-rose-500 shrink-0" />}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-10 flex justify-end">
                        {!isChecked ? (
                            <button
                                onClick={handleCheck}
                                disabled={!selectedOption}
                                className={`px-8 py-3 rounded-xl font-semibold transition-all shadow-sm ${selectedOption
                                    ? 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-md'
                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    }`}
                            >
                                Submit Answer
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                className="px-8 py-3 rounded-xl font-semibold bg-primary-600 text-white hover:bg-primary-700 hover:shadow-md transition-all flex items-center space-x-2"
                            >
                                <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}</span>
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
