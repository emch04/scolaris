import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { createAssignmentRequest, getAssignmentsRequest } from "../services/assignment.api";

function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [title, setTitle] = useState("");
  useEffect(() => { getAssignmentsRequest().then(res => setAssignments(res?.data || [])); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createAssignmentRequest({ title, description: "...", classroom: "...", teacher: "..." });
    setTitle("");
  };

  return (
    <>
      <Navbar />
      <main className="container">
        <h1>Devoirs</h1>
        <form onSubmit={handleSubmit} className="form"><input value={title} onChange={e => setTitle(e.target.value)} /></form>
        <div className="grid">
          {assignments.map(a => <Card key={a._id} title={a.title} />)}
        </div>
      </main>
    </>
  );
}
export default AssignmentsPage;
