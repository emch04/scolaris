import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
function HomePage() {
  return (
    <>
      <Navbar />
      <main className="container">
        <h1>Tshangu Edu Primaire</h1>
        <p>Plateforme scolaire légère pour la gestion des élèves, des classes et des devoirs.</p>
        <div className="actions">
          <Link to="/login" className="btn">Connexion enseignant</Link>
          <Link to="/devoirs" className="btn btn-secondary">Voir les devoirs</Link>
        </div>
      </main>
    </>
  );
}
export default HomePage;
