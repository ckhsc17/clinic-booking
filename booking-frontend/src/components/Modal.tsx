export default function Modal({ children, onClose }) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded shadow-xl relative max-w-md w-full">
          <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>✕</button>
          {children}
        </div>
      </div>
    );
  }
  