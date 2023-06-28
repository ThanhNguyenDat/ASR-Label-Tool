import * as React from "react";
import { Card, CardContent } from "@mui/material";
import { SavedQueriesList } from "react-admin";

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
