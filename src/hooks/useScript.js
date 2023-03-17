import { useEffect } from "react";

import PropTypes from "prop-types";

const useScript = (props) => {
  const { url, head } = props
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

useScript.propTypes = {
  url: PropTypes.object.isRequired, //PropTypes.string,

  head: PropTypes.bool,
};

useScript.defaultProps = {
  // url: "",
  head: null,
};

// useScript({ url: "congdonggame.net", head:true });
export default useScript;
