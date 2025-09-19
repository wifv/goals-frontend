// GoalPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Goal } from "../App";

function GoalPage() {
  const { id } = useParams<{ id: string }>();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [subGoal, setSubGoal] = useState("");

  useEffect(() => {
    fetch(`http://localhost:3000/getGoal/${id}`)
      .then((res) => res.json())
      .then((data) => setGoal(data))
      .catch((err) => console.error(err));
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
      // const data = await res.json();

      setSubGoal("");
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div>
      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Enter sub goal"
          value={subGoal}
          onChange={(e) => setSubGoal(e.target.value)}
          style={{ marginRight: "0.5rem" }}
        />
        <button type="submit">Add Goal</button>
      </form>

      <h2>{goal.goal}</h2>
      {goal.subGoals.length > 0 ? (
        <ul>
          {goal.subGoals.map((sg) => (
            <li key={sg.id}>{sg.goal}</li>
          ))}
        </ul>
      ) : (
        <p>No sub-goals yet</p>
      )}
    </div>
  );
}

export default GoalPage;
