import "./admin.css";

export const metadata = {
  title: "Panel administrador — Aires Publicidad",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return <div className="admin-body">{children}</div>;
}
