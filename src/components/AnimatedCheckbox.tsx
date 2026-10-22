// src/components/AnimatedCheckbox.tsx
'use client';

import React from 'react';

interface AnimatedCheckboxProps {
  checked: boolean;
  onChange: () => void;
  size?: string;
  className?: string;
  title?: string;
  id?: string;
  emeraldOnChecked?: boolean;
}

export function AnimatedCheckbox({
  checked,
  onChange,
  size = '1.15em',
  className = '',
  title,
  id,
  emeraldOnChecked = true,
}: AnimatedCheckboxProps) {
  return (
    <label
      className={`uiverse-checkbox-container ${className}`}
      title={title}
      onClick={(e) => e.stopPropagation()}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <svg
        viewBox="0 0 64 64"
        style={{ width: size, height: size }}
        className="shrink-0 block"
      >
        <path
          d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
          pathLength="575.0541381835938"
          className={`path uiverse-path ${emeraldOnChecked && checked ? 'checked-emerald' : ''}`}
        />
      </svg>
    </label>
  );
}
