import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
import Menu, { MenuItem } from './Menu';
import {
    HomeIcon,
    HomeActiveIcon,
    UserGroupIcon,
    UserGroupActiveIcon,
    LiveIcon,
    LiveActiveIcon,
} from '~/components/Icons';
import config from '~/config';

const cx = classNames.bind(styles);

function Sidebar() {
    return (
        <aside className={cx('wrapper')}>
            <Menu>
                <MenuItem title="Label" to={config.routes.label} />
                <MenuItem title="Benchmark" to={config.routes.benchmark} />
                <MenuItem title="History" to={config.routes.history} />
            </Menu>
        </aside>
    );
}

export default Sidebar;
