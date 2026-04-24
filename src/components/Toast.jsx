import React from 'react';
import { useStore } from '../store/useStore';
import { CheckCircle2 } from 'lucide-react';

export default function Toast() {
  const { toastMessage } = useStore();

  if (!toastMessage) return null;

  return (
    <div className="toast-container">
      <div className="toast-content">
        <CheckCircle2 size={20} className="toast-icon" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
}
