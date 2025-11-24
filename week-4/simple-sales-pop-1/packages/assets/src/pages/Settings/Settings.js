import React, { useEffect } from 'react';
import { Card, Layout, Page } from '@shopify/polaris';

import { LegacyCard, LegacyTabs } from '@shopify/polaris';
import { useState, useCallback } from 'react';
import DisplaySetting from '../../components/DisplaySetting/DisplaySetting';
import TriggerSetting from '../../components/TriggerSetting/TriggerSetting';
import { api } from '@assets/helpers';
import useFetchApi from '../../hooks/api/useFetchApi';
// import './Settings.css'
/**
 * @return {JSX.Element}
 */
export default function Settings() {
  const [selected, setSelected] = useState(0);
  const { data, fetchApi } = useFetchApi({ url: "/settings" });
  useEffect(() => {
    const getData = async () => {
      await fetchApi();
    }
    getData();
  }, [])
  useEffect(() => {
    console.log(">>>> ", data);
  }, [data])
  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );
  const tabs = [
    {
      id: 0,
      content: <div style={{ color: selected == 0 ? "black" : "gray" }}>Display</div>,
      body: <DisplaySetting />,
      panelID: 'content-1',
    },
    {
      id: 1,
      content: <div style={{ color: selected == 1 ? "black" : "gray" }}>Triggers</div>,
      body: <TriggerSetting />,
      panelID: 'content-2',
    },

  ];

  return (
    <div style={{ paddingRight: "20px" }}>
      <div style={{ height: "76px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ width: "403px", height: "52px" }}>
          <p style={{ fontSize: "24px", fontWeight: "500", marginBottom: "5px" }}>Settings</p>
          <p style={{ fontSize: "14px", color: "gray" }}>Decide how your notifications will display</p>
        </div>
        <div>
          <button style={{ width: "76px", height: "36px", borderRadius: "8px", border: "none", background: "#008060" }}>
            <span style={{ color: "white" }}>Save</span>
          </button>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "5em" }}>
        <div style={{ flex: '1' }}>
          <Card>
            abc
          </Card>
        </div>
        <div style={{ flex: '2' }}>
          <LegacyCard>
            <LegacyTabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
              <LegacyCard.Section >
                <div style={{ paddingTop: "25px" }}>
                  {tabs.map((tab) => {
                    return tab.id == selected && (
                      tab.body
                    )
                  })}
                </div>
              </LegacyCard.Section>
            </LegacyTabs>
          </LegacyCard>
        </div>
      </div>
    </div>
  );
}

Settings.propTypes = {};
