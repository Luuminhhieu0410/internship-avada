import React, { useEffect } from 'react';
import { Card, Layout, Page, LegacyCard, LegacyTabs, Thumbnail, Text, InlineStack, Button } from '@shopify/polaris';

import { useState, useCallback } from 'react';
import DisplaySetting from '../../components/DisplaySetting/DisplaySetting';
import TriggerSetting from '../../components/TriggerSetting/TriggerSetting';
import useFetchApi from '../../hooks/api/useFetchApi';
import { SaveBar, useAppBridge } from '@shopify/app-bridge-react';
import PageSkeleton from '../../components/skeletons/PageSkeleton';
import useEditApi from '../../hooks/api/useEditApi';

// import '../../global.css'  
// import './Settings.css'
/**
 * @return {JSX.Element}
 */

export default function Settings() {
  const [selected, setSelected] = useState(0);
  const [settings, setSettings] = useState({

  });
  const [initSettings, setInitSettings] = useState({});
  const shopify = useAppBridge();
  const { data, loading } = useFetchApi({ url: "/settings", defaultData: {} });

  const { handleEdit } = useEditApi({ url: "/settings" });
  const tabs = [
    {
      id: 0,
      content: <div style={{ color: selected == 0 ? "black" : "gray" }}>Display</div>,
      body: <DisplaySetting initSettings={initSettings} settings={settings} setSettings={setSettings} />,
      panelID: 'content-1',
    },
    {
      id: 1,
      content: <div style={{ color: selected == 1 ? "black" : "gray" }}>Triggers</div>,
      body: <TriggerSetting initSettings={initSettings} settings={settings} setSettings={setSettings} />,
      panelID: 'content-2',
    },

  ];

  useEffect(() => {
    setInitSettings(data);
    setSettings(data);
  }, [data]);

  useEffect(() => {
    if (JSON.stringify(settings) != JSON.stringify(initSettings)) { 
      shopify.saveBar.show('my-save-bar');
    }
  }, [settings]);
  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );

  const handleSave = async () => {
    console.log('Saving');
    await handleEdit(settings);
    console.log('Saved');
    shopify.saveBar.hide('my-save-bar');
  };

  const handleDiscard = () => {
    console.log('Discarding');
    setSettings({ ...initSettings });

    shopify.saveBar.hide('my-save-bar');
  };

  return (
    <>
      {
        loading ? <PageSkeleton /> :
          <div style={{ paddingRight: "20px" }}>

            <SaveBar id="my-save-bar">
              <button variant="primary" onClick={handleSave}></button>
              <button onClick={handleDiscard}></button>
            </SaveBar>
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
                <LegacyCard 
                  title={<InlineStack align='space-between'>
                    <Text variant="headingMd" as="h2">Preview</Text>
                    <Button size="slim" >Desktop</Button>
                  </InlineStack>}>
                  <div style={{height:"560px",background:"rgb(234,234,234)",margin:"16px", borderRadius:"16px" ,padding:"16px", display:"flex", alignItems:"end"}}>
                      <div style={{ display: "flex" , background:"white", padding:"6px",gap:"10px", borderRadius:"12px", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)"}}>
                        <img src='https://boostsales.apps.avada.io/assets/placeholder-CWwRPaYX.png' style={{width:"65px" , borderRadius:"8px", height:"65px" , objectFit:'fill'}} />

                        {/* Text content */}
                        <div style={{fontSize:"12px"}}>
                          <Text variation="strong">
                            Anthony in New York, United States
                          </Text> 
                          <Text variation="subdued">
                            Purchased <b>Sport Sneaker</b>
                          </Text>
                          <Text>few seconds ago</Text>
                        </div>
      
                    </div>
                  </div>
                  <div style={{height:"8px"}}>

                  </div>
                </LegacyCard>
              </div>
              <div style={{ flex: '3' }}>
                <LegacyCard >
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
      }
    </>
  )

}

