/**
 * @file Card.jsx
 * @description Composant d'interface réutilisable représentant une carte stylisée pour afficher du contenu segmenté.
 */

function Card({ title, children, style }) {
  return (
    <div className="card" style={style}>
      {title && <h3>{title}</h3>}
      <div>{children}</div>
    </div>
  );
}
export default Card;
