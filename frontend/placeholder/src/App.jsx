import React from "react";
import "./App.css";

function ComingSoon() {
  return (
    <div className="container">
      <h1>Plan zajęć - Wkrótce dostępny</h1>
      <p>Pracujemy nad nową wersją systemu. Sprawdź ponownie później.</p>
    </div>
  );
}

function NotFound() {
  return (
    <div className="container not-found">
      <h1>404</h1>
      <p>Nie znaleziono strony.</p>
      <a href="/" className="btn">Powrót do strony głównej</a>
    </div>
  );
}

function App() {
  const path = window.location.pathname;
  return path.includes("404") ? <NotFound /> : <ComingSoon />;
}

export default App;
