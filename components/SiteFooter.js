export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container footer-row">
        <span>© {year} Aires Publicidad — Cartelería integral.</span>
        <a href="/admin/login">Acceso administrador</a>
      </div>
    </footer>
  );
}
