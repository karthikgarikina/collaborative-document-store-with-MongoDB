import { NavLink, Outlet, useLocation } from "react-router-dom";

const getSectionMeta = (pathname: string): { label: string; title: string; description: string } => {
  if (pathname === "/documents/new") {
    return {
      label: "Create Workspace",
      title: "Add A New Document",
      description: "Create a document with title, tags, authorship, and content in one clear publishing flow."
    };
  }

  if (pathname.endsWith("/edit")) {
    return {
      label: "Editing Workspace",
      title: "Edit With Version Safety",
      description: "Update a document while preserving optimistic concurrency protection against stale writes."
    };
  }

  if (pathname.startsWith("/documents/")) {
    return {
      label: "Document View",
      title: "Review Content And Revision History",
      description: "Inspect document metadata, content, and recent revisions in one place."
    };
  }

  return {
    label: "Search Workspace",
    title: "Explore The Collaborative Document Store",
    description: "Search by keyword, narrow by tags, and jump into recent documents without losing context."
  };
};

export const Layout = (): JSX.Element => {
  const location = useLocation();
  const meta = getSectionMeta(location.pathname);

  return (
    <div className="shell">
      <header className="hero">
        <div className="hero-copy">
          <p className="eyebrow">{meta.label}</p>
          <h1>{meta.title}</h1>
          <p className="hero-description">{meta.description}</p>
        </div>

        <div className="hero-panel">
          <p className="panel-label">Current Area</p>
          <div className="nav nav-pills">
            <NavLink className={({ isActive }) => `nav-pill${isActive ? " active" : ""}`} end to="/">
              Search
            </NavLink>
            <NavLink className={({ isActive }) => `nav-pill${isActive ? " active" : ""}`} to="/documents/new">
              Create
            </NavLink>
          </div>
          <p className="panel-note">Use Search to browse documents and Create to add a new page.</p>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
};
