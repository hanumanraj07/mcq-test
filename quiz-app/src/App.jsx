import React, { useState } from 'react';
import Library from './components/Library';
import QuizArea from './components/QuizArea';
import ResultSummary from './components/ResultSummary';
import ReviewMode from './components/ReviewMode';

function App() {
  const [quizData, setQuizData] = useState(null);
  const [quizState, setQuizState] = useState('library'); // library, active, finished, review
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeTaken, setTimeTaken] = useState(0);

  const fetchRemoteCategory = async (categoryId, count) => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${backendUrl}/api/questions?category=${categoryId}`);
      if (!res.ok) throw new Error('Database fetch failed. Make sure the Node server is running securely on port 5000.');
      const data = await res.json();

      if (!data.questions || data.questions.length === 0) {
        throw new Error(`The DB collection for category "${categoryId}" appears empty.`);
      }

      const newQuizData = {
        title: `Topic: ${categoryId.toUpperCase()}`,
        questions: data.questions
      };

      selectQuizAndStart(newQuizData, count);
    } catch (err) {
      alert("Backend Error: " + err.message);
    }
  };

  const selectQuizAndStart = (data, count) => {
    let shuffledQuestions = [...data.questions].sort(() => Math.random() - 0.5);
    // If the slider specifies a count smaller than the array, slice it
    if (count && count < shuffledQuestions.length) {
      shuffledQuestions = shuffledQuestions.slice(0, count);
    }

    setQuizData({ ...data, questions: shuffledQuestions });
    setQuizState('active');
    setScore(0);
    setAnswers({});
    setTimeTaken(0);
  };

  const finishQuiz = (finalScore, userAnswers, time) => {
    setScore(finalScore);
    setAnswers(userAnswers);
    setTimeTaken(time);
    setQuizState('finished');

    const pastScores = JSON.parse(localStorage.getItem('quizScores') || '[]');
    const totalPossible = quizData.questions.reduce((acc, q) => acc + (q.points || 1), 0);
    pastScores.push({
      date: new Date().toISOString(),
      score: finalScore,
      total: totalPossible,
      time: time
    });
    localStorage.setItem('quizScores', JSON.stringify(pastScores));
  };

  const restartQuiz = () => {
    selectQuizAndStart(quizData, quizData.questions.length);
  };

  const clearQuiz = () => {
    setQuizData(null);
    setQuizState('library');
    setScore(0);
    setAnswers({});
    setTimeTaken(0);
  };

  return (
    <div className="min-h-screen pt-12 pb-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <h1
            className="text-4xl font-extrabold text-slate-900 tracking-tight cursor-pointer inline-block transition-transform hover:scale-105 active:scale-95"
            onClick={clearQuiz}
          >
            Quiz<span className="text-primary-600">Flow</span>
          </h1>
          <p className="mt-2 text-slate-500 font-medium text-lg">All the best for Mid-term 2</p>
        </header>

        {quizState === 'library' && (
          <Library
            onFetchRemoteCategory={fetchRemoteCategory}
          />
        )}

        {quizState === 'active' && quizData && (
          <QuizArea
            questions={quizData.questions}
            onFinish={finishQuiz}
            onCancel={clearQuiz}
          />
        )}

        {quizState === 'finished' && quizData && (
          <ResultSummary
            score={score}
            totalQuestions={quizData.questions.length}
            answers={answers}
            questions={quizData.questions}
            timeTaken={timeTaken}
            onRestart={restartQuiz}
            onNewQuiz={clearQuiz}
            onReview={() => setQuizState('review')}
          />
        )}

        {quizState === 'review' && quizData && (
          <ReviewMode
            questions={quizData.questions}
            answers={answers}
            onBack={() => setQuizState('finished')}
          />
        )}
      </div>
    </div>
  );
}

export default App;
