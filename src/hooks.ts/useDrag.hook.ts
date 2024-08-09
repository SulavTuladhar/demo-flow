import { ReactNode, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

export const useDragImage = (content: ReactNode) => {
  const dragImageRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<any>(null);

  useEffect(() => {
    const dragImage = document.createElement("div");
    dragImageRef.current = dragImage;
    document.body.appendChild(dragImage);

    rootRef.current = createRoot(dragImage);

    return () => {
      if (dragImageRef.current) {
        document.body.removeChild(dragImage);
      }
    };
  }, []);

  useEffect(() => {
    if (dragImageRef.current) {
      rootRef.current.render(
        content as React.ReactElement
        // dragImageRef.current
      );
    }
  }, [content]);

  return dragImageRef;
};
