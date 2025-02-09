"use client";
import React, { useState, useEffect } from "react";

type Question = {
  description: string;
  options: { id: number; description: string; is_correct: boolean }[];
};

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [selectedAnswers, setSelectedAnswers] = useState<Map<number, { isCorrect: boolean; selectedOption: number | null }>>(new Map());
  const [score, setScore] = useState<number>(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(20);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [showFinalResults, setShowFinalResults] = useState<boolean>(false);

  const startQuiz = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/quiz");
      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      }
      const data = await res.json();
      setQuestions(data.questions);
      setQuizStarted(true);
    } catch (error: any) {
      console.error("Error fetching quiz data:", error);
      setError("Failed to load quiz data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (quizStarted && !quizCompleted) {
      setTimeLeft(20);
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentQuestionIndex, quizStarted]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleNextQuestion();
    }
  }, [timeLeft]);

  const handleAnswerSelection = (questionIndex: number, optionId: number, isCorrect: boolean) => {
    setSelectedAnswers((prevAnswers) => {
      const newAnswers = new Map(prevAnswers);
      newAnswers.set(questionIndex, { isCorrect, selectedOption: optionId });

      const correctAnswers = [...newAnswers.values()].filter((answer) => answer.isCorrect).length;
      setScore(correctAnswers);

      return newAnswers;
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setTimeLeft(20);
    } else {
      setQuizCompleted(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
      setTimeLeft(20);
    }
  };

  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white p-6">
      {!quizStarted ? (
        <div className="w-full max-w-md p-10 bg-blue-900 text-white rounded-lg shadow-lg">
          <h1 className="text-xl font-bold mb-4">Biology quiz <span className="font-extrabold">(10)</span></h1>
          <p className="text-gray-300 mt-2">All the best!</p>
          <p className="text-white font-bold mt-4">200 secs Test Practice</p>
          <div className="w-full h-1.5 bg-gray-700 rounded-full mt-2"></div>
          {error && <p className="text-red-400 mb-4">{error}</p>}
          <button className="mt-6 w-full py-3 bg-teal-500 text-white text-lg font-semibold rounded-full hover:bg-teal-600 transition" onClick={startQuiz}>
            Start Quiz →
          </button>
        </div>
      ) : !quizCompleted ? (
        <div className="w-full max-w-md p-6 bg-blue-900 shadow-lg rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Quiz Time! 🎯</h2>
          {questions.length > 0 && currentQuestionIndex < questions.length ? (
            <div>
              <h3 className="font-bold mb-4">
                Question {currentQuestionIndex + 1}: {questions[currentQuestionIndex].description}
              </h3>
              <ul>
                {questions[currentQuestionIndex].options.map((answer, index) => {
                  const selectedAnswer = selectedAnswers.get(currentQuestionIndex);
                  const isAnswerSelected = selectedAnswer?.selectedOption === answer.id;
                  const isAnswerCorrect = isAnswerSelected && answer.is_correct;
                  const isAnswerWrong = isAnswerSelected && !answer.is_correct;

                  return (
                    <li key={answer.id}
                      className={`mt-2 p-3 rounded cursor-pointer flex items-center hover:bg-gray-600 ${
                        isAnswerCorrect ? "bg-green-500 text-white" : isAnswerWrong ? "bg-red-500 text-white" : "bg-gray-700"
                      }`}
                      onClick={() => handleAnswerSelection(currentQuestionIndex, answer.id, answer.is_correct)}
                    >
                      <span className="font-bold mr-2">{index + 1}.</span> {answer.description}
                    </li>
                  );
                })}
              </ul>

              <div className="mt-4 text-gray-300 font-bold">Your Score: {score} / {questions.length}</div>
              <div className="mt-4 text-yellow-400 font-bold">Time Left: {timeLeft}s</div>

              <div className="mt-6 flex justify-between">
                {currentQuestionIndex > 0 && (
                  <button onClick={handlePreviousQuestion} className="px-4 py-2 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600 transition">
                    Previous
                  </button>
                )}
                <button onClick={handleNextQuestion} className="px-4 py-2 bg-yellow-500 text-blue-900 font-bold rounded-lg hover:bg-yellow-600 transition">
                  Next
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : !showFinalResults ? (
        <div className="w-full max-w-md p-6 bg-blue-900 shadow-lg rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Quiz Summary 📊</h2>
          <ul>
            {questions.map((question, index) => {
              const selectedAnswer = selectedAnswers.get(index);
              return (
                <li key={index} className="mb-3">
                  <strong>Q{index + 1}:</strong> {question.description} <br />
                  <span className={selectedAnswer?.isCorrect ? "text-green-400" : "text-red-400"}>
                    {selectedAnswer?.isCorrect ? "✔ Correct" : "✖ Incorrect"}
                  </span>
                </li>
              );
            })}
          </ul>
          <button onClick={() => setShowFinalResults(true)} className="mt-4 px-4 py-2 bg-yellow-500 text-blue-900 font-bold rounded-lg hover:bg-yellow-600 transition">
            Next →
          </button>
        </div>
      ) : (
        <div className="w-full max-w-lg p-20 bg-gray-900 text-white rounded-xl text-center shadow-lg">
  {/* Badge System */}
  <div className="mb-6">
    {((score / questions.length) * 100) >= 80 ? (
      <span className="text-yellow-400 text-3xl font-extrabold">🥇 Gold Badge</span>
    ) : ((score / questions.length) * 100) >= 50 ? (
      <span className="text-gray-300 text-3xl font-extrabold">🥈 Silver Badge</span>
    ) : (
      <span className="text-orange-500 text-3xl font-extrabold">🥉 Bronze Badge</span>
    )}
  </div>

  
  <h1 className="text-4xl font-extrabold text-green-400">Congratulations! </h1>
  
  
  <p className="text-2xl font-semibold mt-4">Total Score: {score} / {questions.length}</p>
  <p className="text-xl text-green-300 mt-2">Accuracy: {((score / questions.length) * 100).toFixed(0)}%</p>
  <button
    className="mt-6 px-6 py-3 bg-red-500 text-white text-lg font-semibold rounded-lg hover:bg-red-600 transition"
    onClick={() => {
      setQuizStarted(false);
      setQuizCompleted(false);
      setScore(0);
      setCurrentQuestionIndex(0);
      setSelectedAnswers(new Map());
    }}
  >
    End Quiz & Restart 🔄
  </button>
</div>

      )}
    </div>
  );
}
