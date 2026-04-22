import Navbar from "../components/Navbar";
import Card from "../components/Card";
import useAuth from "../hooks/useAuth";
function DashboardPage() {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <main className="container">
        <h1>Dashboard</h1>
        <p>Bienvenue, {user?.fullName}.</p>
        <div className="grid">
          <Card title="Élèves"><p>Gérez les élèves.</p></Card>
          <Card title="Devoirs"><p>Publiez les leçons.</p></Card>
        </div>
      </main>
    </>
  );
}
export default DashboardPage;
