import React from 'react';
import { motion } from 'framer-motion';
import { Award, Clock, CheckCircle, XCircle, RotateCcw, Home, Eye } from 'lucide-react';

export default function ResultSummary({ score, totalQuestions, answers, questions, timeTaken, onRestart, onNewQuiz, onReview }) {
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}s`;
    };

    const correctCount = Object.values(answers).filter(a => a.isCorrect).length;
    const incorrectCount = totalQuestions - correctCount;
    const totalPossible = questions.reduce((acc, q) => acc + (q.points || 1), 0);
    const percentage = Math.round((score / totalPossible) * 100);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12 text-center max-w-2xl mx-auto"
        >
            <div className="mb-8">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Award className="w-12 h-12 text-primary-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Quiz Completed!</h2>
                <p className="text-slate-500">You scored {score} out of {totalPossible} points ({percentage}%)</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-slate-700">{correctCount}</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Correct</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <XCircle className="w-6 h-6 text-rose-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-slate-700">{incorrectCount}</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Incorrect</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <Award className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-slate-700">{score}</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Points</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-slate-700">{formatTime(timeTaken)}</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Time</div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
                <button
                    onClick={onRestart}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl font-semibold bg-primary-600 text-white hover:bg-primary-700 hover:shadow-md transition-all flex items-center justify-center space-x-2"
                >
                    <RotateCcw className="w-5 h-5" />
                    <span>Try Again</span>
                </button>
                <button
                    onClick={onNewQuiz}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center space-x-2"
                >
                    <Home className="w-5 h-5" />
                    <span>Library</span>
                </button>
            </div>

            <div className="flex justify-center mb-10">
                <button
                    onClick={onReview}
                    className="px-6 py-2 rounded-lg font-medium text-primary-600 hover:bg-primary-50 transition-colors flex items-center justify-center space-x-2"
                >
                    <Eye className="w-4 h-4" />
                    <span>Review Answers</span>
                </button>
            </div>
        </motion.div>
    );
}
