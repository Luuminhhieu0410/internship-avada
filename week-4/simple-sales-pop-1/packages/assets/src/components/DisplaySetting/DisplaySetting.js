import React, { useState, useCallback } from 'react';
import DesktopPositionInput from '../DesktopPositionInput/DesktopPositionInput';
import { Checkbox, RangeSlider } from '@shopify/polaris';

const DisplaySetting = () => {
  const [settings, setSettings] = useState({
    position: 'bottom-left',
    hideTimeAgo: false,
    truncateContentText: false,
    displayDuration: 100, // thời gian mỗi popup hiển thị (seconds)
    initialDelay: 100, // thời gian đợi trước popup đầu tiên (seconds)
    gapBetweenPops: 100, // khoảng thời gian giữa hai popup (seconds)
    maxPopups: 100 // số popup tối đa cho phép hiển thị
  });

  const handleChangeHideTimeAgoCheckbox = useCallback(newChecked => setSettings(pre => ({ ...pre, hideTimeAgo: newChecked })), []);
  const handleChangeTrunateContentTextCheckbox = useCallback(newChecked => setSettings(pre => ({ ...pre, truncateContentText: newChecked })), []);
  const handleChangePosition = useCallback(
    value => setSettings(pre => ({ ...pre, position: value })),
    []
  );
  const handleChangeDisplayDuration = useCallback(
    value => setSettings(pre => ({ ...pre, displayDuration: value })),
    []
  );
  const handleChangeInitialDelay = useCallback(
    value => setSettings(pre => ({ ...pre, initialDelay: value })),
    []
  );
  const handleChangeGapBetweenPops = useCallback(
    value => setSettings(pre => ({ ...pre, gapBetweenPops: value })),
    []
  );
  const handleChangeMaxPopups = useCallback(
    value => setSettings(pre => ({ ...pre, maxPopups: value })),
    []
  );
  const RangeSlidersList = [
    {
      label: 'Display duration',
      value: settings.displayDuration,
      onChange: handleChangeDisplayDuration,
      output: true,
      description: 'How long each pop will display on your page',
      unit: 'second(s)'
    },
    {
      label: 'Time before the first pop',
      value: settings.initialDelay,
      onChange: handleChangeInitialDelay,
      output: true,
      description: 'The delay time before the first notification',
      unit: 'second(s)'
    },
    {
      label: 'Gap time between two pops',
      value: settings.gapBetweenPops,
      onChange: handleChangeGapBetweenPops,
      output: true,
      description: 'The time interval between two popup notifications',
      unit: 'second(s)'
    },
    {
      label: 'Maximum of popups',
      value: settings.maxPopups,
      onChange: handleChangeMaxPopups,
      output: true,
      description:
        'The maximum number of popups are allowed to show after page loading . Maximum number is 80 ',
      unit: 'pop(s)'
    }
  ];
  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <span style={{ fontWeight: '500' }}>APPEARANCE</span>
      </div>
      <div style={{ margin: '10px 0px' }}>
        <DesktopPositionInput
          label={'Desktop Position : ' + settings.position}
          value={settings.position}
          onChange={handleChangePosition}
          helpText={'The display position of the pop on the your website.'}
        />
      </div>
      <div style={{ margin: '10px 0px' }}>
        <Checkbox
          label="Hide time ago"
          checked={settings.hideTimeAgo}
          onChange={handleChangeHideTimeAgoCheckbox}
        />
      </div>
      <div style={{ margin: '10px 0px' }}>
        <Checkbox
          label="Truncate content text"
          checked={settings.truncateContentText}
          onChange={handleChangeTrunateContentTextCheckbox}
        />
        <p style={{ paddingLeft: '25px', color: 'gray' }}>
          If your product name is long for one line, it will be truncated to 'Product na...'
        </p>
      </div>
      <div style={{ marginTop: '20px' }}>
        <div style={{ fontWeight: '500' }}>TIMMING</div>
        <div style={{ margin: '5px 0px', display: 'flex', flexWrap: 'wrap' }}>
          {RangeSlidersList.map(element => (
            <div style={{ flexBasis: '380px', margin: '10px 10px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: '2' }}>
                  <RangeSlider
                    label={element.label}
                    value={element.value}
                    onChange={element.onChange}
                    output={element.output}
                  />
                </div>
                <div
                  style={{
                    marginTop: '10px',
                    height: '40px',
                    flex: '1',
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid rgba(235, 235, 235, 1)',
                    borderRadius: '4px'
                  }}
                >
                  <span style={{ fontWeight: '600', marginLeft: '5px', marginRight: '10px' }}>
                    {element.value}
                  </span>
                  <span style={{ color: 'gray' }}>{element.unit}</span>
                </div>
              </div>
              <p style={{ color: 'gray' }}>{element.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DisplaySetting;
