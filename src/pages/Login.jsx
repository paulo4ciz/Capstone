// src/pages/Login.jsx
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import "../styles.css"; // Asegúrate de que tu CSS se llame así

export default function Login() {
  const [params] = useSearchParams();
  const section = params.get("section");

  useEffect(() => {
    if (!section) return;
    const el = document.getElementById(`login-${section}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [section]);

  return (
    <main className="page-Login">
        <section>
            <LoginForm />
        </section>
    </main>
  );
}
