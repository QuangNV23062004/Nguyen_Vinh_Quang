import { memo } from "react";

function ConvertButton({
  handleConvert,
  isLoading,
}: {
  handleConvert: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="mt-6">
      <button
        onClick={handleConvert}
        disabled={isLoading}
        className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-200 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isLoading ? "Converting..." : "Convert"}
      </button>
    </div>
  );
}

export default memo(ConvertButton);
