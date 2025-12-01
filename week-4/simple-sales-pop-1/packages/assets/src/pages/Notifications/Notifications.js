import React, { useEffect, useState } from 'react';
import {
    Card,
    Text,
    Banner,
    Button,
    Box,
    Avatar, ResourceItem, ResourceList
}
    from '@shopify/polaris';

import { DeleteIcon } from '@shopify/polaris-icons';
import useFetchApi from '../../hooks/api/useFetchApi';

const Notifications = () => {
    const [selectedItems, setSelectedItems] = useState([]);
    const { data, loading } = useFetchApi({ url: '/notifications' ,defaultData : {}})
    useEffect(() => {
        console.log(" >>>>> " , data);
    } , [data])
    // const items = [
    //     {
    //         id: '1',
    //         image: 'https://via.placeholder.com/60x60/eee?text=Pants', // thay bằng ảnh thật nếu có
    //         customer: 'Hiệu in vĩnh phúc, Vietnam',
    //         product: 'Purchased Quần nam dài LL',
    //         date: 'From November 25',
    //     },
    //     {
    //         id: '2',
    //         image: 'https://via.placeholder.com/60x60/336699?text=Shirt',
    //         customer: 'Hiệu in vĩnh phúc, Vietnam',
    //         product: 'Purchased Áo Polo Nam',
    //         date: 'From November 25',
    //     },
    //     {
    //         id: '3',
    //         image: 'https://via.placeholder.com/60x60/cccccc?text=Tee',
    //         customer: 'Hiệu in vĩnh phúc, Vietnam',
    //         product: 'Purchased Áo nam thể thao',
    //         date: 'From November 24',
    //     },
    //     {
    //         id: '4',
    //         image: 'https://via.placeholder.com/60x60/dddddd?text=Tee',
    //         customer: 'Hiệu in vĩnh phúc, Vietnam',
    //         product: 'Purchased Áo nam thể thao',
    //         date: 'From November 24',
    //     },
    //     {
    //         id: '5',
    //         image: 'https://via.placeholder.com/60x60/bbbbbb?text=Tee',
    //         customer: 'Hiệu in vĩnh phúc, Vietnam',
    //         product: 'Purchased Áo nam thể thao',
    //         date: 'From November 24',
    //     },
    // ];


    const resourceName = {
        singular: 'customer',
        plural: 'customers',
    };

    const items = [
        {
            id: '103',
            url: '#',
            name: 'Mae Jemison',
            location: 'Decatur, USA',
        },
        {
            id: '203',
            url: '#',
            name: 'Ellen Ochoa',
            location: 'Los Angeles, USA',
        },
    ];

    const promotedBulkActions = [
        {
            content: 'Edit customers',
            onAction: () => console.log('Todo: implement bulk edit'),
        },
    ];
    const [sortValue, setSortValue] = useState('DATE_MODIFIED_DESC');


    return (
        <div style={{ margin: 'auto', maxWidth: '950px', padding: '20px 0' }}>

            <div alignment="center" style={{ display: 'flex', justifyContent: "space-between" }} distribution="equalSpacing">
                <h1>Notification: New sales pops</h1>
                <Button plain>
                    Import
                </Button>
            </div>

            <Text variant="bodyMd" color="subdued">
                List of available notifications related to campaign.
            </Text>

            <Box paddingBlockStart="400" >

                <Banner title="If orders are not up to date" status="info">
                    <p>
                        We only keep maximum amount of 30 purchase notifications synchronized from your store. If you find your orders are not up to date, try synchronizing it again.
                    </p>
                    <Box paddingBlockStart="200">
                        <Button primary>Sync manually</Button>
                    </Box>
                </Banner>
            </Box>
            <div style={{ height: "20px" }}>

            </div>
            <Box>
                <Card padding="0">
                    <ResourceList
                        resourceName={resourceName}
                        items={items}
                        sortValue={sortValue}
                        sortOptions={[
                            { label: 'Newest update', value: 'DATE_MODIFIED_DESC' },
                            { label: 'Oldest update', value: 'DATE_MODIFIED_ASC' },
                        ]}
                        onSortChange={(selected) => {
                            setSortValue(selected);
                            console.log(`Sort option changed to ${selected}.`);
                        }}
                        promotedBulkActions={promotedBulkActions}
                        selectedItems={selectedItems}
                        onSelectionChange={setSelectedItems}
                        pagination={{
                            hasNext: true,
                            onNext: () => { },
                        }}
                        renderItem={(item) => {
                            const { id, url, name, location } = item;
                            const media = <Avatar customer size="md" name={name} />;

                            return (
                                <ResourceItem
                                    id={id}
                                    url={url}
                                    media={media}
                                    accessibilityLabel={`View details for ${name}`}
                                >
                                    <h3>
                                        <Text fontWeight="bold" as="span">
                                            {name}
                                        </Text>
                                    </h3>
                                    <div>{location}</div>
                                </ResourceItem>
                            );
                        }}
                    />
                </Card>
            </Box>

        </div>
    );
};

export default Notifications;