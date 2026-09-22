import { useRole } from "../context/RoleContext";

export default function AdminOnly({ children, fallback }) {
  const { isAdmin } = useRole();
  if (!isAdmin) {
    return (
      fallback || (
        <div className="role-notice">
          <h2>Admin only</h2>
          <p>
            Switch the role to <strong>Admin</strong> in the sidebar to use
            reports and analytics. Menus stay visible for everyone — no login
            required.
          </p>
        </div>
      )
    );
  }
  return children;
}
