import { memo } from "react";
import { ArrowRightLeft } from "lucide-react";

function SwapButton({ onSwap }: { onSwap: () => void }) {
  return (
    <div className="flex justify-center my-4">
      <button
        onClick={onSwap}
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 transition-all duration-200 shadow-md hover:shadow-lg"
      >
        <ArrowRightLeft size={20} />
      </button>
    </div>
  );
}

export default memo(SwapButton);
