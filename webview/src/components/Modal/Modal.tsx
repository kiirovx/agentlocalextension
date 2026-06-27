interface Props { children: React.ReactNode; open: boolean; onClose: () => void; }
export default function Modal({ children, open, onClose }: Props) {
  if (!open) return null;
  return <div className="modal-overlay" onClick={onClose}><div className="modal-content" onClick={e => e.stopPropagation()}>{children}</div></div>;
}
