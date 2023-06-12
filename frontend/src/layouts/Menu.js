import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import LabelIcon from '@mui/icons-material/Label';
import OrderIcon from '@mui/icons-material/AttachMoney';

import {
    useTranslate,
    DashboardMenuItem,
    MenuItemLink,
    MenuProps,
    useSidebarState,
} from 'react-admin';

import SubMenu from './SubMenu';

const Menu = ({ dense = false }) => {
    const [state, setState] = useState({
        menuProject: true,
        menuUser: true,
    });

    const translate = useTranslate();
    const [open] = useSidebarState();

    const handleToggle = (menu) => {
        setState(state => ({ ...state, [menu]: !state[menu] }));
    };

    return (
        <Box
            sx={{
                width: open ? 200 : 50,
                marginTop: 1,
                marginBottom: 1,
                transition: theme =>
                    theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
            }}
        >
            <DashboardMenuItem />
            <SubMenu
                handleToggle={() => handleToggle('menuUser')}
                isOpen={state.menuUser}
                name="User"
                icon={<LabelIcon />}
                dense={dense}
            >
                <MenuItemLink
                    to="/users"
                    state={{ _scrollToTop: true }}
                    primaryText={translate(`Member`, {
                        smart_count: 2,
                    })}
                    leftIcon={<LabelIcon />}
                    dense={dense}
                />

            </SubMenu>
            <SubMenu
                handleToggle={() => handleToggle('menuProject')}
                isOpen={state.menuProject}
                name="Project"
                icon={<LabelIcon />}
                dense={dense}
            >
                <MenuItemLink
                    to="/asr_segments"
                    state={{ _scrollToTop: true }}
                    primaryText={translate(`ASR`, {
                        smart_count: 2,
                    })}
                    leftIcon={<LabelIcon />}
                    dense={dense}
                />

                <MenuItemLink
                    to="/#"
                    state={{ _scrollToTop: true }}
                    primaryText={translate(`FaceId`, {
                        smart_count: 2,
                    })}
                    leftIcon={<LabelIcon />}
                    dense={dense}
                />

            </SubMenu>
        </Box>
    );
};

Menu.propTypes = {
    
};

export default Menu;