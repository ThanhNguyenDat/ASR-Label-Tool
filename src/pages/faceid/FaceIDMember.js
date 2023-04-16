import React from 'react';
import PropTypes from 'prop-types';

import DataTableModal from '@components/table/DataTableModal'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const data = [
    {
        id: 1,
        key: 1, // drag
        first_name: "Vo",
        last_name: "Danh",
        tags: ['admin', 'leader'],
        to: "/danhvo"
    },
    {
        id: 2,
        key: 2,
        image: "https://scontent.fsgn2-4.fna.fbcdn.net/v/t39.30808-6/272858595_1763530754038181_7657492639481153746_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=aekzWdWIAt0AX-1TgNY&_nc_ht=scontent.fsgn2-4.fna&oh=00_AfC_tWyr5cw5Czn3jcSA_2jeKBmAAmzpoQhI_SETi38ENw&oe=6440C502",
        first_name: "Nguyen",
        last_name: "Thanh",
        tags: ['member'],
        status: "processing",
        to: "/thanhnguyen"
    },
]

const columns = [
    {
        key: "sort",
        width: "2%"
    },
    {
        title: "Avatar",
        key: "image",
        dataIndex: "image",
        width: 100,
        config: {
            style: {
                
            }
        },
    },
    {
        title: "First Name",
        key: "first_name",
        dataIndex: "first_name",
        // editTextArea : {
        //     rows: 4
        // },
        editText: {

        },
        navigate: true,
        enableSearch: true,
        enableSort: true,
        icon: "icon",
    },
    {
        title: "Last Name",
        key: "last_name",
        dataIndex: "last_name"
    },
    {
        title: "Tags",
        key: "tags",
        dataIndex: "tags",  
    },
    {
        title: "Status",
        key: "status",
        dataIndex: "status"
    },
    {
        title: "Progress",
        key: "progress",
        dataIndex: "progress"
    },
    {
        title: "Actions",
        key: "actions",
        dataIndex: "actions",
        width: 100,
    }
]

function FaceIDMember ( props ) {
    const [dataTable, setDataTable] = React.useState(data)

    const [loading, setLoading] = React.useState(false);

    // fetch data from api
    // React.useEffect(() => {
    //     setLoading(true)
    //     setTimeout(() => {
    //         setLoading(false)
    //     }, 2000)
    // }, [])

    const tableProps = {
        loading: loading,
        enableDrag: false,
    }

    return (
        <div>
            <h1>Mebmer</h1>
            <DataTableModal 
                rowKey="key"
                columns={columns} 
                dataSource={dataTable} 
                setDataSource={setDataTable} 
                {...tableProps}
            />
        </div>
    );
};

FaceIDMember.propTypes = {
    
};

export default FaceIDMember;