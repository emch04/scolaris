import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import Card from "../components/Card";
import { getStudentsRequest } from "../services/student.api";
import formatDate from "../utils/formatDate";

function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getStudentsRequest().then(res => setStudents(res?.data || [])).catch(() => setError("Erreur")).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main className="container">
        <h1>Liste des élèves</h1>
        {loading ? <Loader /> : (
          <div className="grid">
            {students.map(s => <Card key={s._id} title={s.fullName}><p>Matricule: {s.matricule}</p></Card>)}
          </div>
        )}
      </main>
    </>
  );
}
export default StudentsPage;
