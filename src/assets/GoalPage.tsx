import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Goal } from "../App";
import './GoalPage.css'

function GoalPage() {
  const { id } = useParams<{ id: string }>();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [subGoal, setSubGoal] = useState("");

  // ✅ Extract fetch logic into a function so we can reuse it
  const fetchGoal = async () => {
    try {
      const res = await fetch(`http://localhost:3000/getGoal/${id}`);
      if (!res.ok) throw new Error("Failed to fetch goal");
      const data = await res.json();
      setGoal(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGoal();
  }, [id]);

  if (!goal) return <p>Loading...</p>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (subGoal.trim() === "") return alert("Goal cannot be empty");

    const payload = { goal: subGoal };

    try {
      const res = await fetch(`http://localhost:3000/addSubGoal/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add subGoal");

      setSubGoal("");
      await fetchGoal(); // ✅ Re-fetch goal to get updated subGoals
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <header>Goal number {id}</header>
      <br />
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Enter sub goal"
          value={subGoal}
          onChange={(e) => setSubGoal(e.target.value)}
          style={{ marginRight: "0.5rem" }}
          className="input"
        />
        <button type="submit" className="submit-btn">Add Goal</button>
      </form>

      <h2>{goal.goal}</h2>
      {goal.subGoals.length > 0 ? (
        <ul className="sub-goals">
          {goal.subGoals.map((sg) => (
            <li key={sg.id} className="sub-goal">
              <div>{sg.goal}</div>
              <div className="sub-goal-interactions">
                <img src="/check.svg" alt="bambaleylo" className="sub-goal-interaction" />
                <img src="/delete.svg" alt="bambaleylo" className="sub-goal-interaction" />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No sub-goals yet</p>
      )}
    </div>
  );
}

export default GoalPage;
