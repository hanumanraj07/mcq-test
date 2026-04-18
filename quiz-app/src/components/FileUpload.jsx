import React, { useState, useCallback } from 'react';
import { UploadCloud, FileJson, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FileUpload({ onUpload }) {
    const [error, setError] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    const processFile = (file) => {
        setError('');
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target.result);
                if (!json.questions || !Array.isArray(json.questions)) {
                    throw new Error('Invalid JSON format: missing "questions" array.');
                }
                onUpload(json);
            } catch (err) {
                setError('Error parsing JSON file. Please ensure it follows the correct format.');
            }
        };
        reader.readAsText(file);
    };

    const onDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const onDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFile(e.dataTransfer.files[0]);
        }
    }, []);

    const onFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            processFile(e.target.files[0]);
        }
    };

    const loadSample = async () => {
        try {
            const response = await fetch('/sample.json');
            const data = await response.json();
            onUpload(data);
        } catch {
            setError('Could not load sample file.');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12 text-center"
        >
            <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`border-2 border-dashed rounded-xl py-16 px-6 transition-all duration-200 ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                    }`}
            >
                <UploadCloud className={`w-16 h-16 mx-auto mb-6 ${isDragging ? 'text-primary-500' : 'text-slate-400'}`} />
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Upload your Quiz JSON</h3>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                    Drag and drop your JSON file here, or click the button below to browse your files.
                </p>

                <input
                    type="file"
                    id="file-upload"
                    accept=".json"
                    className="hidden"
                    onChange={onFileChange}
                />
                <label
                    htmlFor="file-upload"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 cursor-pointer shadow-sm hover:shadow transition-all"
                >
                    Select File
                </label>
            </div>

            {error && (
                <div className="mt-6 flex items-center justify-center space-x-2 text-rose-600 bg-rose-50 p-3 rounded-lg">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}

            <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col items-center">
                <p className="text-sm text-slate-500 mb-4">Don't have a file? Try our sample quiz.</p>
                <button
                    onClick={loadSample}
                    className="inline-flex items-center space-x-2 text-sm font-medium text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-4 py-2 rounded-full transition-colors"
                >
                    <FileJson className="w-4 h-4" />
                    <span>Load Sample Quiz</span>
                </button>
            </div>
        </motion.div>
    );
}
