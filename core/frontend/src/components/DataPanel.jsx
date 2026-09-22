export default function DataPanel({ title, subtitle, loading, error, children, actions }) {
  return (
    <section className="panel">
      <header className="panel-header">
        <div>
          <h1>{title}</h1>
          {subtitle && <p className="panel-subtitle">{subtitle}</p>}
        </div>
        {actions}
      </header>
      {loading && <p className="muted">Loading…</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && children}
    </section>
  );
}
