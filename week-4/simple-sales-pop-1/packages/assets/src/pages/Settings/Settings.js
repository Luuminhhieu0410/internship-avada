import {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Button,
  Frame,
  InlineStack,
  LegacyCard,
  LegacyStack,
  LegacyTabs,
  Modal,
  Text,
  Toast
} from '@shopify/polaris';

import DisplaySetting from '../../components/DisplaySetting/DisplaySetting';
import TriggerSetting from '../../components/TriggerSetting/TriggerSetting';
import useFetchApi from '../../hooks/api/useFetchApi';
import PageSkeleton from '../../components/skeletons/PageSkeleton';
import {SaveBar, useAppBridge} from '@shopify/app-bridge-react';
import {api} from '../../helpers';
import NotificationPopup from '../../components/NotificationPopup/NotificationPopup';
import useScreenType from '@assets/hooks/utils/useScreenType';

export default function Settings() {
  const [selected, setSelected] = useState(0);
  const [settings, setSettings] = useState({});
  const [initSettings, setInitSettings] = useState({});
  const [loadingSaveSetting, setLoadingSaveSetting] = useState(false);
  const [toast, setToast] = useState({active: false, message: '', error: false});
  const [activeModalViewDesktop, setActiveModalViewDesktop] = useState(false);

  const toggleModal = useCallback(() => {
    console.log('click');
    setActiveModalViewDesktop(active => !active);
  }, []);

  const shopify = useAppBridge();
  const {data, loading} = useFetchApi({url: '/settings', defaultData: {}});
  const screenType = useScreenType();
  const tabs = [
    {
      id: 0,
      content: <div style={{color: selected == 0 ? 'black' : 'gray'}}>Display</div>,
      body: (
        <DisplaySetting initSettings={initSettings} settings={settings} setSettings={setSettings} />
      )
    },
    {
      id: 1,
      content: <div style={{color: selected == 1 ? 'black' : 'gray'}}>Triggers</div>,
      body: (
        <TriggerSetting initSettings={initSettings} settings={settings} setSettings={setSettings} />
      )
    }
  ];

  useEffect(() => {
    setInitSettings(data);
    setSettings(data);
  }, [data]);

  useEffect(() => {
    if (JSON.stringify(settings) !== JSON.stringify(initSettings)) {
      shopify.saveBar.show('my-save-bar');
    }
  }, [settings]);

  const handleTabChange = useCallback(index => setSelected(index), []);

  const handleSave = async () => {
    try {
      setLoadingSaveSetting('');

      const res = await api('/settings', {
        method: 'PUT',
        body: {newSettings: settings}
      });
      // console.log(res);
      if (!res.success) throw new Error('Save failed');

      setInitSettings(res.data);
      shopify.saveBar.hide('my-save-bar');

      setToast({active: true, message: 'Saved successfully!', error: false});
    } catch (e) {
      setToast({active: true, message: 'Failed to save settings!', error: true});
    } finally {
      setLoadingSaveSetting(false);
    }
  };
  const handleDiscard = () => {
    setSettings(initSettings);
    shopify.saveBar.hide('my-save-bar');
  };

  const modalContentPositionStyle = useMemo(() => {
    // string => object . "bottom-left" =>  { bottom : 0,  left: 0, }
    const objStyle = settings.position?.split('-').reduce((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {});
    return objStyle;
  }, [settings]);
  return (
    <Frame>
      {toast.active && (
        <Toast
          content={toast.message}
          error={toast.error}
          onDismiss={() => setToast({...toast, active: false})}
        />
      )}

      <Modal
        size="large"
        open={activeModalViewDesktop}
        onClose={toggleModal}
        title="Desktop preview"
        primaryAction={{
          content: 'Close',
          onAction: toggleModal
        }}
      >
        <Modal.Section>
          <LegacyStack vertical>
            <LegacyStack.Item>
              <div style={{height: '400px', position: 'relative'}}>
                <div
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    display: 'flex',
                    width: '350px',
                    height: '80px',
                    ...modalContentPositionStyle,
                    background: 'white',
                    padding: '6px',
                    gap: '10px',
                    borderRadius: '12px',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <img
                    src="https://boostsales.apps.avada.io/assets/placeholder-CWwRPaYX.png"
                    style={{
                      width: '65px',
                      borderRadius: '8px',
                      height: '65px',
                      objectFit: 'fill'
                    }}
                  />

                  <div style={{fontSize: '12px'}}>
                    <Text variation="strong">Anthony in New York, United States</Text>
                    <Text variation="subdued">
                      Purchased <b>Sport Sneaker</b>
                    </Text>
                    <Text>few seconds ago</Text>
                  </div>
                </div>
              </div>
            </LegacyStack.Item>
          </LegacyStack>
        </Modal.Section>
      </Modal>

      {loading ? (
        <PageSkeleton />
      ) : (
        <div style={{paddingRight: '20px'}}>
          <SaveBar id="my-save-bar">
            <button variant="primary" loading={loadingSaveSetting} onClick={handleSave}></button>
            <button onClick={handleDiscard}></button>
          </SaveBar>

          <div
            style={{
              height: '76px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{width: '403px', height: '52px'}}>
              <p style={{fontSize: '24px', fontWeight: '500', marginBottom: '5px'}}>Settings</p>
              <p style={{fontSize: '14px', color: 'gray'}}>
                Decide how your notifications will display
              </p>
            </div>
          </div>

          <div style={{display: 'flex', justifyContent: 'space-between', gap: '5em'}}>
            <div style={{flex: '1', display: `${screenType.isMobile ? 'none' : 'block'}`}}>
              <LegacyCard
                title={
                  <InlineStack align="space-between">
                    <Text variant="headingMd">Preview</Text>
                    <Button
                      onClick={() => {
                        toggleModal();
                      }}
                      size="slim"
                    >
                      Desktop
                    </Button>
                  </InlineStack>
                }
              >
                <div
                  style={{
                    height: '560px',
                    background: 'rgb(234,234,234)',
                    margin: '16px',
                    borderRadius: '16px',
                    padding: '16px 8px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'end'
                  }}
                >
                  <NotificationPopup />
                </div>
                <div style={{height: '8px'}}></div>
              </LegacyCard>
            </div>

            <div style={{flex: '3'}}>
              <LegacyCard>
                <LegacyTabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
                  <LegacyCard.Section>
                    <div style={{paddingTop: '25px'}}>{tabs[selected].body}</div>
                  </LegacyCard.Section>
                </LegacyTabs>
              </LegacyCard>
            </div>
          </div>
        </div>
      )}
    </Frame>
  );
}
