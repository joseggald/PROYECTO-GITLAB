import { AnimatePresence, motion } from "framer-motion";

export const LoadingOverlay = () => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-background fixed inset-0 z-50 flex flex-col items-center justify-center"
    >
      <div className="animate-spin rounded-full border-4 border-gray-300 border-t-gray-800 h-12 w-12" />
      <p className="mt-4 text-gray-600">Cargando...</p>
    </motion.div>
  </AnimatePresence>
);
