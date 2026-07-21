"use client";

export default function PrintButton() {
  function handlePrint() {
    window.print();
  }

  return (
    <button onClick={handlePrint} className="btn-primary text-sm">
      Print
    </button>
  );
}
