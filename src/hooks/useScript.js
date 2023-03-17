import PropTypes from "prop-types";
import { useEffect } from "react";

const useScript = (props) => {
    const { url, head } = props

    useEffect(() => {
        const script = document.createElement("script");

        script.src = props.url;
        // script.async = true;

        // if (props.head) {
        //   document.head.appendChild(script);
        // } else {
        document.body.appendChild(script);
        // }
        return () => {
            // if (props.head) {
            //   document.head.removeChild(script);
            // } else {
            document.body.removeChild(script);
            // }
        };
    }, [props]);
};

// useScript.propTypes = {
//   url: PropTypes.object.isRequired, //PropTypes.string,

//   head: PropTypes.bool,
// };

// useScript.defaultProps = {
//   // url: "",
//   head: null,
// };

// useScript({ url: "congdonggame.net", head:true });
export default useScript;
