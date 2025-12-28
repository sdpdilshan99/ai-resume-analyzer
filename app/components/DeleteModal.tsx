import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  itemName: string;
}

export default function DeleteModal({ isOpen, onClose, onConfirm, isLoading, itemName }: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 text-center"
      >
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trash2 size={32} />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">Delete Analysis?</h3>
        <p className="text-slate-500 mt-2">
          This will permanently remove the analysis for <span className="font-bold text-slate-900">"{itemName}"</span>.
        </p>
        <div className="flex gap-3 mt-8">
          <button onClick={onClose} className="flex-1 py-3 font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={isLoading} className="flex-1 py-3 font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 disabled:opacity-50">
            {isLoading ? "Deleting..." : "Confirm Delete"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}