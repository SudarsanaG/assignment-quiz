"use client";
import React, { useState, useEffect } from "react";


type Question = {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  
  const startQuiz = async () => {
    setLoading(true);
    setError(""); 
    const headers = {
      
    
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-encoding": "gzip, deflate, br, zstd",
      "accept-language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
      "cache-control": "max-age=0",
      "cookie": "__cf_bm=UhnBxZat46pPkKW1tohNDc6lZg5gHIVqM39c2HWSDNg-1739113616-1.0.1.1-gx3bBHmMjdVVu1qv6TMrYGa.ACww2DlOmgusN.SkE5nXL5o6EUnkB_ptI3pX5wKUrvwYF6lddWNpvlV6qkpboQ", // Replace with actual cookie value
      "if-modified-since": "Sun, 09 Feb 2025 15:06:56 GMT",
      "priority": "u=0, i",
      "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "none",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36"
    };
  
    try {
      const res = await fetch("https://api.jsonserve.com/Uw5CrX", {
        method: "GET",
        headers: headers,
      });
    

      console.log(res);
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

  if (loading) return <h1>Loading quiz...</h1>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Welcome to the quiz</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>} 

      {!quizStarted ? (
        <button
          className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition"
          onClick={startQuiz} 
        >
          Start quiz!
        </button>
      ) : (
        <div className="w-full max-w-md p-4 bg-white shadow-lg rounded-lg">
          <h2 className="text-lg font-semibold">Quiz Time! 🎯</h2>
          {questions.map((q, index) => (
            <div key={index} className="mb-6">
              <h3 className="font-bold">{q.question}</h3>
              <ul>
                {[...q.incorrect_answers, q.correct_answer]
                  .sort(() => Math.random() - 0.5) 
                  .map((answer, i) => (
                    <li
                      key={i}
                      className="mt-2 p-2 bg-gray-200 rounded cursor-pointer hover:bg-gray-300"
                    >
                      {answer}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
