export default function Modal({ children, onClose, showCloseButton = true }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div
        className="bg-white p-6 rounded-2xl shadow-xl border-2 relative max-w-md w-full text-center"
        style={{ borderColor: "#e1cac2" }}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
              className="absolute top-3 right-4 text-2xl text-gray-500 hover:text-gray-700 font-bold"
          >
            ✕
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
