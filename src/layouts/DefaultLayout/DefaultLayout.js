import PropTypes from "prop-types";
import classNames from "classnames/bind";
import Header from "../components/Header";
// import Sidebar from "../components/Sidebar";
import styles from "./DefaultLayout.module.scss";

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
  return (
    <div className={cx("wrapper hello")}>
      <Header />
      <div className={cx("")}>
        <div className="row">
          <div className={cx("col-md-2 left-column")}> This is sidebar </div>
          <div className="col-md-10 right-column"> {children} </div>
          {/* <div className={cx("content")}>{children}</div> */}

        </div>

        
      </div>
    </div>
  );
}

DefaultLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DefaultLayout;
