/**
 * @file LibraryPage.jsx
 * @description Page de la bibliothèque numérique, listant les ressources et documents partagés.
 */

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { getResourcesRequest, addResourceRequest, deleteResourceRequest } from "../services/resource.api";
import { useToast } from "../context/ToastContext";
import useAuth from "../hooks/useAuth";
import { getFileUrl } from "../utils/fileUrl";

function LibraryPage() {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "Livre",
    subject: "",
    level: ""
  });
  const [file, setFile] = useState(null);

  const fetchResources = async () => {
    try {
      const res = await getResourcesRequest();
      setResources(res?.data || []);
    } catch (err) {
      showToast("Erreur de chargement.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchResources(); 
    const interval = setInterval(fetchResources, 30000); // 30 secondes
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return showToast("Veuillez joindre un fichier.", "error");

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      data.append("file", file);

      await addResourceRequest(data);
      showToast("Ressource ajoutée !");
      setShowAddForm(false);
      setFormData({ title: "", description: "", type: "Livre", subject: "", level: "" });
      setFile(null);
      fetchResources();
    } catch (err) {
      showToast("Erreur lors de l'ajout.", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette ressource ?")) return;
    try {
      await deleteResourceRequest(id);
      showToast("Ressource supprimée.");
      fetchResources();
    } catch (err) {
      showToast("Erreur lors de la suppression.", "error");
    }
  };

  if (user && ["parent", "super_admin"].includes(user.role)) {
    return (
      <>
        <Navbar />
        <main className="container" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "70vh" }}>
          <div style={{ background: "rgba(255,82,82,0.1)", padding: "4rem", borderRadius: "30px", border: "1px solid #ff5252", textAlign: "center", maxWidth: "600px" }}>
            <div style={{ background: "#ff5252", width: "60px", height: "60px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem" }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <h2 style={{ color: "#ff5252", fontSize: "2rem", fontWeight: "800" }}>Accès Restreint</h2>
            <p style={{ marginTop: "1.5rem", opacity: 0.8, fontSize: "1.1rem", lineHeight: "1.6" }}>La bibliothèque numérique est un espace de travail réservé exclusivement aux élèves et au personnel enseignant.</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container">
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "800", background: "linear-gradient(to right, #fff, #888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Bibliothèque Numérique
          </h1>
          <p style={{ opacity: 0.6 }}>Accédez aux livres, exercices et fiches de révision</p>
        </div>

        {["teacher", "admin", "director", "super_admin"].includes(user?.role) && (
          <div style={{ marginBottom: "2rem", textAlign: "right" }}>
            <button onClick={() => setShowAddForm(!showAddForm)} className={`btn ${showAddForm ? 'btn-danger' : 'btn-primary'}`}>
              {showAddForm ? "Annuler" : "Ajouter une ressource"}
            </button>
          </div>
        )}

        {showAddForm && (
          <form onSubmit={handleSubmit} className="form" style={{ marginBottom: "3rem", maxWidth: "100%" }}>
            <h3 style={{ marginBottom: "1.5rem" }}>Publier une ressource</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              <input type="text" placeholder="Titre du document" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              <input 
                type="text" 
                list="subjects-list"
                placeholder="Matière" 
                value={formData.subject} 
                onChange={e => setFormData({...formData, subject: e.target.value})} 
                required 
              />
              <datalist id="subjects-list">
                <option value="Mathématiques" />
                <option value="Français" />
                <option value="Anglais" />
                <option value="Histoire" />
                <option value="Géographie" />
                <option value="Sciences" />
                <option value="Informatique" />
                <option value="Éducation Physique" />
                <option value="Arts Plastiques" />
                <option value="Musique" />
                <option value="Citoyenneté" />
              </datalist>
              <input type="text" placeholder="Niveau (ex: 6ème Primaire)" value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} required />
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="Livre">Livre / Manuel</option>
                <option value="Exercice">Exercice / TP</option>
                <option value="Fiche de révision">Fiche de révision</option>
                <option value="Vidéo">Lien Vidéo</option>
              </select>
            </div>
            <textarea placeholder="Brève description du contenu..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ minHeight: "100px" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
              <input type="file" onChange={e => setFile(e.target.files[0])} style={{ width: "auto", background: "transparent", border: "none", color: "white" }} />
              <button type="submit" className="btn btn-primary" style={{ padding: "0.8rem 3rem" }}>Publier la ressource</button>
            </div>
          </form>
        )}

        {loading ? <Loader /> : (
          <div className="grid">
            {resources.length > 0 ? resources.map(r => (
              <div key={r._id} style={{ 
                background: "transparent", 
                padding: "1.5rem", 
                borderRadius: "15px", 
                border: "3px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.65rem", padding: "3px 8px", borderRadius: "50px", background: "rgba(255,255,255,0.1)", fontWeight: "bold" }}>{r.type}</span>
                    <span style={{ fontSize: "0.65rem", opacity: 0.5 }}>{r.level}</span>
                  </div>
                  <h3 style={{ marginBottom: "0.8rem", fontSize: "1.2rem" }}>{r.title}</h3>
                  <p style={{ fontSize: "0.85rem", opacity: 0.6, marginBottom: "1.5rem" }}>{r.subject} • {r.description}</p>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <a href={getFileUrl(r.fileUrl)} download target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ flex: 1, textAlign: "center", fontSize: "0.8rem" }}>Télécharger</a>
                  {["admin", "director", "super_admin"].includes(user?.role) && (
                    <button onClick={() => handleDelete(r._id)} className="btn btn-danger" style={{ padding: "8px", borderRadius: "8px" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  )}
                </div>              </div>
            )) : (
              <p style={{ textAlign: "center", gridColumn: "1/-1", opacity: 0.3, padding: "4rem" }}>Aucune ressource disponible.</p>
            )}
          </div>
        )}
      </main>
    </>
  );
}

export default LibraryPage;
