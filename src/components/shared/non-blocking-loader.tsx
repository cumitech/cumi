"use client";
import React from 'react';
import { Spin } from 'antd';

interface NonBlockingLoaderProps {
  loading?: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const NonBlockingLoader: React.FC<NonBlockingLoaderProps> = ({
  loading = false,
  children,
  fallback
}) => {
  return (
    <>
      {children}
      {loading && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 9999,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            borderRadius: "12px",
            padding: "12px 16px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {fallback || (
            <>
              <Spin size="small" />
              <span style={{ fontSize: "14px", color: "#666" }}>
                Loading...
              </span>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default NonBlockingLoader;
