// GoalPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Goal } from "../App";

function GoalPage() {
  const { id } = useParams<{ id: string }>();
  const [goal, setGoal] = useState<Goal | null>(null);

  useEffect(() => {
    fetch(`http://localhost:3000/getGoal/${id}`)
      .then((res) => res.json())
      .then((data) => setGoal(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!goal) return <p>Loading...</p>;

  return (
    <div>
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
