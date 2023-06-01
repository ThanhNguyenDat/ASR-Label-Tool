import { SavedQueriesList, FilterLiveSearch, FilterList, FilterListItem } from 'react-admin';
import { Card, CardContent } from '@mui/material';
import MailIcon from '@mui/icons-material/MailOutline';
import CategoryIcon from '@mui/icons-material/LocalOffer';

const UserFilterSidebar = () => (
    <Card sx={{ order: -1, mr: 2, mt: 9, width: 200 }}>
        <CardContent>
            <SavedQueriesList />
            <FilterLiveSearch />
            <FilterList label="Subscribed to newsletter" icon={<MailIcon />}>
                <FilterListItem label="Yes" value={{ has_newsletter: true }} />
                <FilterListItem label="No" value={{ has_newsletter: false }} />
            </FilterList>
            <FilterList label="Website" icon={<CategoryIcon />}>
                <FilterListItem label=".org" value={{ website: '.org' }} />
                <FilterListItem label=".net" value={{ website: '.net' }} />
                <FilterListItem label=".info" value={{ website: '.info' }} />
                <FilterListItem label=".biz" value={{ website: '.biz' }} />
            </FilterList>
        </CardContent>
    </Card>
);

export default UserFilterSidebar;