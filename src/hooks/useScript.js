import { useEffect } from "react";

const useScript = ({ url, head }) => {
  useEffect(() => {
    const script = document.createElement("script");

    script.src = url;
    // script.async = true;
    if (head) {
      document.head.appendChild(script);
    } else {
      document.body.appendChild(script);
    }
    return () => {
      if (head) {
        document.head.removeChild(script);
      } else {
        document.body.removeChild(script);
      }
    };
  }, [url, head]);
};

// useScript({ url: "congdonggame.net", head:true });
export default useScript;
