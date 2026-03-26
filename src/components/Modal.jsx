export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h2
            style={{
              color: "var(--c-text)",
              fontSize: 20,
              fontWeight: 800,
              margin: 0,
            }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "var(--c-text-muted)",
              cursor: "pointer",
              fontSize: 20,
            }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
