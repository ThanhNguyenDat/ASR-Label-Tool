import * as React from "react";
import { Card, CardContent } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOnOutlined";
import MailIcon from "@mui/icons-material/MailOutline";
import LocalOfferIcon from "@mui/icons-material/LocalOfferOutlined";
import { FilterLiveSearch, SavedQueriesList } from "react-admin";
import ListFilterAside from "./ListFilterAside";

import CategoryIcon from "@mui/icons-material/LocalOffer";

import AudibilityFilter from "./AudibilityFilter";
import NoiseFilter from "./NoiseFilter";
import RegionFilter from "./RegionFilter";
import UserFilter from "./UserFilter";

const Aside = () => {
    // FILTER SEARCH DONT WORK
    return (
        <Card
            sx={{
                display: {
                    xs: "none",
                    md: "block",
                },
                order: -1,
                flex: "0 0 15em",
                mr: 2,
                mt: 8,
                alignSelf: "flex-start",
            }}
        >
            <CardContent sx={{ pt: 1 }}>
                {/* <FilterLiveSearch /> */}
                <SavedQueriesList />

                <UserFilter />
                <AudibilityFilter />
                <NoiseFilter />
                <RegionFilter />
            </CardContent>
        </Card>
    );
};

export default Aside;
