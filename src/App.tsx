import { useEffect, useState } from "react";
import { Link, Routes, Route } from "react-router-dom";
import GoalPage from "./assets/GoalPage";
import './App.css'

export interface SubGoal {
  id: number;
  goal: string;
}

export interface Goal {
  id: number;
  goal: string;
  subGoals: SubGoal[];
}

function Home() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [mainGoal, setMainGoal] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/getGoals")
      .then((response) => response.json())
      .then((data: any) => {
        setGoals(data);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mainGoal.trim() === "") return alert("Goal cannot be empty");

    const payload = { goal: mainGoal };

    try {
      const res = await fetch("http://localhost:3000/addGoal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add goal");
      const data = await res.json();

      setGoals([...goals, data.goal]);
      setMainGoal("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <header>My Goals</header>
      <br />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter main goal"
          value={mainGoal}
          onChange={(e) => setMainGoal(e.target.value)}
        />
        <button type="submit">Add Goal</button>
      </form>

      <div className="goals">

        {goals.length === 0 ? (
          <p>No goals yet</p>
        ) : (
          goals.map((goal) => (
            <div key={goal.id}>
              <Link to={`/goal/${goal.id}`} className="goal">
                <div className="goal-left">
                  <strong>{goal.goal}</strong>
                </div>
                <div className="goal-right">
                  <strong>id: {goal.id}</strong>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/goal/:id" element={<GoalPage />} />
    </Routes>
  );
}

export default App;
