import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Play, Settings } from 'lucide-react';

const REMOTE_CATEGORIES = [
    { id: 'mongo', label: 'MongoDB', theme: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { id: 'math', label: 'Mathematics', theme: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    { id: 'node', label: 'Node.js', theme: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
    { id: 'cpp', label: 'C++', theme: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
    { id: 'react', label: 'React', theme: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-200' }
];

export default function Library({ onFetchRemoteCategory }) {
    const [configuringCategory, setConfiguringCategory] = useState(null);
    const [numQuestions, setNumQuestions] = useState(10);

    const handleConfigure = (catId) => {
        if (configuringCategory === catId) return;
        setConfiguringCategory(catId);
        setNumQuestions(10);
    };

    const handleStart = (catId, e) => {
        e.stopPropagation();
        onFetchRemoteCategory(catId, numQuestions);
        setConfiguringCategory(null);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-4xl mx-auto"
        >
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                        <BookOpen className="w-6 h-6 mr-3 text-primary-600" />
                        Select Subject
                    </h2>
                    <p className="text-slate-500 mt-1">Each subject has upto 300 questions.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {REMOTE_CATEGORIES.map(cat => (
                    <motion.div
                        key={cat.id}
                        whileHover={configuringCategory !== cat.id ? { scale: 1.02 } : {}}
                        className={`p-6 rounded-2xl shadow-sm border cursor-pointer flex flex-col transition-all ${configuringCategory === cat.id ? 'border-primary-500 shadow-md ring-1 ring-primary-500 bg-white' : `${cat.bg} ${cat.border} hover:shadow-lg`}`}
                        onClick={() => handleConfigure(cat.id)}
                    >
                        <h3 className={`text-xl font-bold mb-2 truncate ${cat.theme}`}>
                            {cat.label}
                        </h3>

                        {configuringCategory === cat.id ? (
                            <div className="mt-auto pt-4 flex flex-col space-y-4">
                                <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                                    <span>Questions to fetch:</span>
                                    <span className="bg-primary-100 text-primary-700 px-2 py-0.5 rounded-md font-bold">{numQuestions}</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="300"
                                    value={numQuestions}
                                    onChange={(e) => setNumQuestions(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <div className="flex space-x-2 w-full pt-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setConfiguringCategory(null); }}
                                        className="flex-1 px-3 py-2 text-sm text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={(e) => handleStart(cat.id, e)}
                                        className="flex-1 px-3 py-2 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors flex items-center justify-center space-x-1"
                                    >
                                        <Play className="w-4 h-4" />
                                        <span>Start</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-auto flex justify-end">
                                <button className="flex items-center space-x-1 text-slate-600 bg-white/50 border border-slate-200 px-4 py-2 rounded-lg font-medium hover:bg-white transition-colors">
                                    <Settings className="w-4 h-4" />
                                    <span>Configure</span>
                                </button>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
