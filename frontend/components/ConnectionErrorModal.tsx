"use client";
import { useConnectionError } from "@/contexts/ConnectionErrorContext";

export default function ConnectionErrorModal() {
  const { show, setShow } = useConnectionError();

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm text-center">
        <h2 className="text-lg font-semibold mb-4">Connection Error</h2>
        <p>
          Unable to connect to the server. Please check your internet or try
          again later.
        </p>
        <button
          onClick={() => setShow(false)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
