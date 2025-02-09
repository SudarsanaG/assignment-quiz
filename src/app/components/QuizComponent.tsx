import { useState } from "react";
import { Question } from "../types/quiz";

interface Props {
  questions: Question[];
}

const QuizComponent: React.FC<Props> = ({ questions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleNext = () => {
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
    setSelectedOption("");
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  return (
    <div className="w-full max-w-xl p-6 bg-white shadow-lg rounded-lg">
      {showResult ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold">Quiz Completed!</h2>
          <p className="text-lg">Your Score: {score} / {questions.length}</p>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold">{currentQuestion.question}</h2>
          <div className="mt-4">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                className={`block w-full p-2 mb-2 border ${
                  selectedOption === option ? "bg-blue-400 text-white" : "bg-gray-100"
                }`}
                onClick={() => setSelectedOption(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            className="w-full mt-4 p-2 bg-green-500 text-white rounded-lg"
            onClick={handleNext}
            disabled={!selectedOption}
          >
            {currentIndex === questions.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizComponent;
