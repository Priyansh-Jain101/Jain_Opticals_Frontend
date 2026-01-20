import { useEffect, useState } from "react";
import "../static/PinModal.css";

export default function PinModal({
  open,
  title = "Enter PIN",
  subtitle = "Verify to continue",
  correctPin,
  onClose,
  onSuccess,
}) {
  const [enteredPin, setEnteredPin] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setEnteredPin("");
      setError("");
    }
  }, [open]);

  function verifyPin() {
    if (enteredPin === String(correctPin)) {
      onSuccess?.();
      onClose?.();
    } else {
      setError("Incorrect PIN. Try again.");
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") verifyPin();
    if (e.key === "Escape") onClose?.();
  }

  if (!open) return null;

  return (
    <div className="pin-modal-overlay" onClick={onClose}>
      <div className="pin-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="pin-title">{title}</h2>
        <p className="pin-subtitle">{subtitle}</p>

        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          placeholder="****"
          value={enteredPin}
          onChange={(e) => {
            setEnteredPin(e.target.value);
            setError("");
          }}
          onKeyDown={handleKeyDown}
          className="pin-input"
          autoFocus
        />

        {error && <p className="pin-error">{error}</p>}

        <div className="pin-actions">
          <button className="pin-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="pin-verify" onClick={verifyPin}>
            Verify
          </button>
        </div>
      </div>
    </div>
  );
}
