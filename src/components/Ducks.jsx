import "./styles/Ducks.css";

const DUCKS = [
  { id: 1, name: "Mallard", img: "/ducks/mallard.jpg" },
  { id: 2, name: "Teal",    img: "/ducks/teal.jpg" },
  { id: 3, name: "Pintail", img: "/ducks/pintail.jpg" }
];

export default function Ducks() {
  return (
    <main className="ducks">
      {DUCKS.map((d) => (
        <article key={d.id} className="duck-card">
          <img src={d.img} alt={d.name} />
          <h3>{d.name}</h3>
        </article>
      ))}
    </main>
  );
}
