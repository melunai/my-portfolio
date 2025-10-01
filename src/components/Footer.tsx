import { DATA } from "../data";

export default function Footer() {
  return (
    <footer className="py-12 text-center text-sm opacity-70">
      © {new Date().getFullYear()} {DATA.name}. Сделано с любовью и React.
    </footer>
  );
}
