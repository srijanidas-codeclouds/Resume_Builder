import React from "react";
import { X } from "lucide-react";

const Modal = ({
  children,
  isOpen,
  onClose,
  title,
  hideHeader = false,
  showActionBtn = false,
  actionBtnIcon = null,
  actionBtnText = "",
  actionBtnClassName = "bg-gray-800 hover:bg-gray-700",
  onActionClick = () => {},
  maxWidth = "max-w-xl",
}) => {
  if (!isOpen) return null;

  return (
    // Modal overlay
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-300">
      {/* Modal container */}
      <div
        className={`relative flex flex-col w-full ${maxWidth} bg-white rounded-2xl border border-gray-200 shadow-xl max-h-[85vh] m-4 sm:m-6 overflow-hidden`}
      >
        {/* Header section */}
        {!hideHeader && (
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
              {title}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-md text-gray-500 hover:text-red-500 hover:bg-gray-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Main body section */}
        <div className="flex-1 overflow-y-auto px-5 py-4 bg-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {children}
        </div>

        {/* Footer section (only when action button is visible) */}
        {showActionBtn && (
          <div className="flex justify-end items-center gap-2 px-5 py-3 border-t border-gray-100 bg-gray-50">
            <button
              type="button"
              onClick={onActionClick}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors duration-200 ${actionBtnClassName}`}
            >
              {actionBtnIcon}
              {actionBtnText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
