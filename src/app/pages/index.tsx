import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // Navigate to the quiz page
  const startQuiz = () => {
    router.push("/quiz");
  };

  useEffect(() => {
    setLoading(false); // Simulate loading
  }, []);

  return (
    <div className="container">
      <h1>Welcome to the Quiz App</h1>
      <button onClick={startQuiz} disabled={loading}>
        {loading ? "Loading..." : "Start Quiz"}
      </button>
    </div>
  );
}
