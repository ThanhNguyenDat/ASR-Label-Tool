import classNames from "classnames/bind";

// import { Link } from "react-router-dom";

// import routes from "../../../routes";

import styles from "./Header.module.scss";
// import images from "../../../assets/images";

const cx = classNames.bind(styles);

function Header() {
    return (
        <header className={cx("wrapper")}>
            <div className={cx("inner")}>
                {/* <Link to={routes.routes.home} className={cx("logo-link")}>
          <img src={images.logo} alt="AILab" />
        </Link> */}
                <h1>Hi</h1>
            </div>
        </header>
    );
}

export default Header;
