import { memo } from "react";

function Header() {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Currency Exchange
      </h1>
      <p className="text-gray-600">Convert currencies instantly</p>
    </div>
  );
}

export default memo(Header);
