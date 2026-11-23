import React from "react";

export const CATEGORIES = {
  food: {
    key: "food",
    label: "Еда",
    color: "#D9B6FF",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M2 7H12M3 7C3 4.5 5 3 7 3C9 3 11 4.5 11 7M3 9.5H11C11 10.5 10 11 9 11H5C4 11 3 10.5 3 9.5Z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  transport: {
    key: "transport",
    label: "Транспорт",
    color: "#FFB53D",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M2.5 8.5L3.5 4.5H10.5L11.5 8.5M2.5 8.5H11.5V10.5H10V9.5H4V10.5H2.5V8.5Z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  housing: {
    key: "housing",
    label: "Жилье",
    color: "#6EE4FE",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M2 6.5L7 2.5L12 6.5M3.5 5.5V11.5H10.5V5.5"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  joy: {
    key: "joy",
    label: "Развлечения",
    color: "#B0AEFF",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.2" />
        <path
          d="M5.5 6H5.51M8.5 6H8.51M5.2 8.2C5.7 8.8 6.3 9 7 9C7.7 9 8.3 8.8 8.8 8.2"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  education: {
    key: "education",
    label: "Образование",
    color: "#BCEC30",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M1.5 5.5L7 3L12.5 5.5L7 8L1.5 5.5ZM3.5 6.5V9.5C3.5 9.5 5 10.8 7 10.8C9 10.8 10.5 9.5 10.5 9.5V6.5"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  others: {
    key: "others",
    label: "Другое",
    color: "#FFB9B8",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect
          x="2.5"
          y="2.5"
          width="9"
          height="9"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path d="M5 7H9M7 5V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
};

export const CATEGORIES_LIST = Object.values(CATEGORIES);
