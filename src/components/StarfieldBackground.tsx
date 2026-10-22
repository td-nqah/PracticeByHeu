// src/components/StarfieldBackground.tsx

export function StarfieldBackground() {
  return (
    <div
      className="stars-container fixed inset-0 overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    >
      <div id="stars" />
      <div id="stars2" />
      <div id="stars3" />
    </div>
  );
}

export const RainBackground = StarfieldBackground;
