import React from 'react';

export default function SlotList({
  slots,
  selectedIndex,
  onSelect,
  onReorder,
  onToggle,
  onAdd,
  onRemove,
}) {
  return (
    <div className="slot-list">
      <h3 className="slot-list__title">Screenshots</h3>
      {slots.map((slot, index) => (
        <div
          key={slot.id}
          className={`slot-item ${index === selectedIndex ? 'slot-item--active' : ''} ${
            !slot.enabled ? 'slot-item--disabled' : ''
          }`}
          onClick={() => onSelect(index)}
        >
          <div className="slot-item__order">{index + 1}</div>
          <div className="slot-item__info">
            <div className="slot-item__name">{slot.name}</div>
            <div className="slot-item__status">
              {slot.screenshotDataUrl ? (
                <span className="status-dot status-dot--ready" />
              ) : (
                <span className="status-dot status-dot--empty" />
              )}
              {slot.screenshotDataUrl ? 'Ready' : 'No image'}
            </div>
          </div>
          <div className="slot-item__actions">
            <button
              className="slot-btn"
              onClick={(e) => {
                e.stopPropagation();
                onToggle(index);
              }}
              title={slot.enabled ? 'Disable' : 'Enable'}
            >
              {slot.enabled ? '●' : '○'}
            </button>
            {slots.length > 1 && (
              <button
                className="slot-btn slot-btn--delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(index);
                }}
                title="Remove screenshot"
              >
                ✕
              </button>
            )}
            <div className="slot-reorder">
              <button
                className="slot-btn slot-btn--sm"
                disabled={index === 0}
                onClick={(e) => {
                  e.stopPropagation();
                  onReorder(index, index - 1);
                }}
                title="Move up"
              >
                ▲
              </button>
              <button
                className="slot-btn slot-btn--sm"
                disabled={index === slots.length - 1}
                onClick={(e) => {
                  e.stopPropagation();
                  onReorder(index, index + 1);
                }}
                title="Move down"
              >
                ▼
              </button>
            </div>
          </div>
        </div>
      ))}
      <button className="slot-add-btn" onClick={onAdd}>
        + Add Screenshot
      </button>
    </div>
  );
}
