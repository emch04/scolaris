import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { getAssignmentsRequest } from "../services/assignment.api";

function ViewDevoirPage() {
  const [assignments, setAssignments] = useState([]);
  useEffect(() => { getAssignmentsRequest().then(res => setAssignments(res?.data || [])); }, []);
  return (
    <>
      <Navbar />
      <main className="container">
        <h1>Consulter les devoirs</h1>
        <div className="grid">
          {assignments.map(a => <Card key={a._id} title={a.title}><p>{a.description}</p></Card>)}
        </div>
      </main>
    </>
  );
}
export default ViewDevoirPage;
