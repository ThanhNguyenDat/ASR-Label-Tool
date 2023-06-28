import React, { useState } from "react";
import Box from "@mui/material/Box";
import LabelIcon from "@mui/icons-material/Label";

import { useTranslate, DashboardMenuItem, MenuItemLink, useSidebarState } from "react-admin";

import SubMenu from "./SubMenu";
import routes from "../config/routes";

const Menu = ({ dense = false }) => {
    const [state, setState] = useState({
        menuASR: true,
        menuUser: true,
    });

    const translate = useTranslate();
    const [open] = useSidebarState();

    const handleToggle = (menu) => {
        setState((state) => ({ ...state, [menu]: !state[menu] }));
    };

    const renderRoute = (route, menu) => {
        // route: router.asr
        // const route = routes.asr;
        const childrens = route.childrens;

        return (
            <SubMenu
                handleToggle={() => handleToggle(menu)}
                isOpen={state[menu]}
                name={route.label}
                icon={<LabelIcon />}
                dense={dense}
            >
                {childrens.map((child, index) => {
                    return (
                        <MenuItemLink
                            to={child.to}
                            state={{ _scrollToTop: true }}
                            primaryText={translate(child.label, {
                                smart_count: 2,
                            })}
                            leftIcon={<LabelIcon />}
                            dense={dense}
                            key={index}
                        />
                    );
                })}
            </SubMenu>
        );
    };

    return (
        <Box
            sx={{
                width: open ? 200 : 50,
                marginTop: 1,
                marginBottom: 1,
                transition: (theme) =>
                    theme.transitions.create("width", {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
            }}
        >
            <DashboardMenuItem />
            <SubMenu
                handleToggle={() => handleToggle("menuUser")}
                isOpen={state.menuUser}
                name="User"
                icon={<LabelIcon />}
                dense={dense}
            >
                <MenuItemLink
                    to={routes.users.to}
                    state={{ _scrollToTop: true }}
                    primaryText={translate(`Member`, {
                        smart_count: 2,
                    })}
                    leftIcon={<LabelIcon />}
                    dense={dense}
                />
            </SubMenu>
            {renderRoute(routes.asr, "menuASR")}
        </Box>
    );
};

Menu.propTypes = {};

export default Menu;
