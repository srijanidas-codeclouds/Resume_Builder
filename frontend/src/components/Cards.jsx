import React, { useState } from "react";
import { Award, Clock, Edit, Trash2, TrendingUp, Zap } from "lucide-react";

const cardStyles = {
  resumeCard:
    "group relative h-[360px] sm:h-[380px] lg:h-[400px] flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md",
  previewArea: "p-4 sm:p-6 flex-1 relative overflow-hidden bg-gray-50",
  emptyPreviewIcon: "w-12 h-12 bg-white rounded-md flex items-center justify-center mb-3 border border-gray-200",
  emptyPreviewText: "text-gray-800 text-sm font-semibold",
  emptyPreviewSubtext: "text-gray-500 text-xs mt-1",
  infoArea: "bg-white border-t border-gray-100 p-4 sm:p-6",
  title: "text-sm sm:text-base font-semibold text-gray-800 truncate mb-2",
  dateInfo: "flex items-center gap-2 text-xs text-gray-500",
  actionOverlay:
    "absolute inset-4 sm:inset-6 bg-white/80 flex items-end justify-center p-4 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-xl",
  actionButtonsContainer: "flex gap-2",
  editButton:
    "w-9 h-9 flex items-center justify-center bg-gray-800 rounded-md text-white hover:bg-gray-700 transition-colors",
  deleteButton:
    "w-9 h-9 flex items-center justify-center bg-red-500 rounded-md text-white hover:bg-red-600 transition-colors",
  completionIndicator:
    "absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2 py-1 bg-white border border-gray-200 rounded-full shadow-sm",
  completionDot: "w-2.5 h-2.5 rounded-full",
  completionPercentageText: "text-[11px] font-semibold text-gray-700",
  progressBar: "relative w-full h-2 bg-gray-200 rounded-full overflow-hidden",
  progressFill: "h-full rounded-full transition-all duration-700 ease-out",
  completionStatus: "flex justify-between items-center mt-2 text-xs text-gray-500",
};

const ResumeSummaryCard = ({
  title = "Untitled Resume",
  createdAt = null,
  updatedAt = null,
  onSelect,
  onDelete,
  completion = 85,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const formattedCreatedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  const formattedUpdatedDate = updatedAt
    ? new Date(updatedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  const getCompletionColor = () => {
    if (completion >= 90) return "bg-green-500";
    if (completion >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getCompletionIcon = () => {
    if (completion >= 90) return <Award size={12} />;
    if (completion >= 70) return <TrendingUp size={12} />;
    return <Zap size={12} />;
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete();
  };

  return (
    <div
      className={cardStyles.resumeCard}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Completion indicator */}
      <div className={cardStyles.completionIndicator}>
        <div className={`${cardStyles.completionDot} ${getCompletionColor()}`} />
        <span className={cardStyles.completionPercentageText}>{completion}%</span>
        {getCompletionIcon()}
      </div>

      {/* Preview area */}
      <div className={cardStyles.previewArea}>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={cardStyles.emptyPreviewIcon}>
            <Edit size={22} className="text-gray-700" />
          </div>
          <span className={cardStyles.emptyPreviewText}>{title}</span>
          <span className={cardStyles.emptyPreviewSubtext}>
            {completion === 0 ? "Start building" : `${completion}% completed`}
          </span>

          {/* Mini sections */}
          <div className="mt-3 flex gap-2">
            {["Profile", "Work", "Skills", "Education"].map((section, i) => (
              <div
                key={i}
                className={`px-2 py-0.5 text-[11px] rounded-md ${
                  i < Math.floor(completion / 25)
                    ? "bg-gray-800 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {section}
              </div>
            ))}
          </div>
        </div>

        {/* Hover actions */}
        {isHovered && (
          <div className={cardStyles.actionOverlay}>
            <div className={cardStyles.actionButtonsContainer}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelect) onSelect();
                }}
                className={cardStyles.editButton}
                title="Edit"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={handleDeleteClick}
                className={cardStyles.deleteButton}
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Info area */}
      <div className={cardStyles.infoArea}>
        <h5 className={cardStyles.title}>{title}</h5>
        <div className={cardStyles.dateInfo}>
          <Clock size={12} />
          <span>Created: {formattedCreatedDate}</span>
          <span className="ml-2">Updated: {formattedUpdatedDate}</span>
        </div>

        {/* Progress bar */}
        <div className={cardStyles.progressBar + " mt-3"}>
          <div
            className={`${cardStyles.progressFill} ${getCompletionColor()}`}
            style={{ width: `${completion}%` }}
          />
        </div>

        <div className={cardStyles.completionStatus}>
          <span>
            {completion < 50
              ? "Getting Started"
              : completion < 80
              ? "Almost There"
              : "Ready to Go!"}
          </span>
          <span className="font-semibold">{completion}%</span>
        </div>
      </div>
    </div>
  );
};

export default ResumeSummaryCard;