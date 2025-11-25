import useFetchApi from '../../hooks/api/useFetchApi';
import { useState, useEffect } from 'react';
import { Button, Card, Text } from '@shopify/polaris';

import NotificationPopup from '../../components/NotificationPopup/NotificationPopup';
const HomeCustome = () => {


    return (
        <div>
            {/* {data.message} */}
            <div style={{ height: "76px", display: "flex", alignItems: "center" }}>
                <h1 style={{ fontWeight: "500", fontSize: "16px" }}>
                    Home
                </h1>
            </div>
            <Card>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Text as="h2" variant="bodyMd">
                        App status is <span style={{ fontWeight: "700" }}>disabled</span>
                    </Text>
                    <button style={{ width: "76px", height: "36px", borderRadius: "8px", border: "none", background: "#008060" }}>
                        <span style={{ color: "white" }}>Enable</span>
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default HomeCustome;