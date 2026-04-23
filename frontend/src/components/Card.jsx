function Card({ title, children, style }) {
  return (
    <div className="card" style={style}>
      {title && <h3>{title}</h3>}
      <div>{children}</div>
    </div>
  );
}
export default Card;
