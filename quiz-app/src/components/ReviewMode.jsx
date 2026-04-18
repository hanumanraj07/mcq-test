import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, CheckCircle2, XCircle } from 'lucide-react';

export default function ReviewMode({ questions, answers, onBack }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-3xl mx-auto"
        >
            <button
                onClick={onBack}
                className="flex items-center text-slate-500 hover:text-slate-700 mb-6 font-medium transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200"
            >
                <ChevronLeft className="w-5 h-5 mr-1" /> Back to Results
            </button>

            <div className="space-y-6 cursor-default">
                {questions.map((q, idx) => {
                    const uAns = answers[q.text];
                    const isCorrect = uAns && uAns.isCorrect;

                    return (
                        <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
                            <div className="flex items-start justify-between mb-6">
                                <h3 className="text-[17px] font-bold text-slate-800 pr-4 leading-relaxed">{idx + 1}. {q.text}</h3>
                                {isCorrect ? (
                                    <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                                ) : (
                                    <XCircle className="w-6 h-6 text-rose-500 shrink-0" />
                                )}
                            </div>

                            <div className="space-y-3 pl-2 sm:pl-4">
                                {q.options.map((opt, i) => {
                                    const isSelected = uAns && uAns.selected === opt;
                                    const isActualCorrect = q.answer === opt;

                                    let style = "p-3 sm:p-4 rounded-xl border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm sm:text-base font-medium transition-colors ";
                                    if (isSelected && isActualCorrect) {
                                        style += "bg-emerald-50 border-emerald-200 text-emerald-800";
                                    } else if (isSelected && !isActualCorrect) {
                                        style += "bg-rose-50 border-rose-200 text-rose-800";
                                    } else if (!isSelected && isActualCorrect) {
                                        style += "bg-emerald-50/50 border-emerald-200 text-emerald-700 border-dashed opacity-80";
                                    } else {
                                        style += "bg-slate-50 border-slate-100 text-slate-500 opacity-60";
                                    }

                                    return (
                                        <div key={i} className={style}>
                                            <span className="mb-2 sm:mb-0 leading-snug pr-4">{opt}</span>
                                            <div className="shrink-0 flex items-center space-x-2">
                                                {isSelected && isActualCorrect && <span className="text-[11px] px-2 py-1 bg-emerald-200/50 rounded uppercase tracking-wider text-emerald-700">Your Answer (Correct)</span>}
                                                {isSelected && !isActualCorrect && <span className="text-[11px] px-2 py-1 bg-rose-200/50 rounded uppercase tracking-wider text-rose-700">Your Answer (Wrong)</span>}
                                                {!isSelected && isActualCorrect && <span className="text-[11px] px-2 py-1 bg-emerald-100 rounded uppercase tracking-wider text-emerald-700">Correct Answer</span>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}
