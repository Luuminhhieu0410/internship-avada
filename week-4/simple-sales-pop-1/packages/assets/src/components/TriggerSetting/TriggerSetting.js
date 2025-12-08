import {Autocomplete, LegacyStack, Select, Tag} from '@shopify/polaris';
import {useCallback, useEffect, useState} from 'react';

const ALL_OPTIONS = [
  {value: '/', label: 'Homepage'},
  {value: '/collections/all', label: 'All Products'},
  {value: '/collections', label: 'Collections page'},
  {value: '/products', label: 'All product pages'},
  {value: '/cart', label: 'Cart page'},
  {value: '/checkout', label: 'Checkout page'},
  {value: '/blogs', label: 'Blog index'},
  {value: '/pages/about-us', label: 'About Us'},
  {value: '/pages/contact', label: 'Contact'},
  {value: '/account', label: 'Account pages'},
  {value: '/search', label: 'Search page'}
];

const specificPageOptions = [
  {label: 'Show on ALL pages', value: 'all'},
  {label: 'Show ONLY selected pages', value: 'include'},
  {label: 'Show on ALL EXCEPT selected pages', value: 'exclude'}
];

const parseUrls = str =>
  str
    ? str
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
    : [];

export default function TriggerSetting({initSettings, settings, setSettings}) {
  // console.log('+++',settings);
  const getInitialMode = () => {
    if (initSettings.allShow === 'all') return 'all';
    if (initSettings.includeUrls == '') return 'exclude';
    if (initSettings.excludeUrls == '') return 'include';
    return 'all';
  };

  const [mode, setMode] = useState(getInitialMode());
  const [includeSelected, setIncludeSelected] = useState(parseUrls(initSettings.includeUrls));
  const [excludeSelected, setExcludeSelected] = useState(parseUrls(initSettings.excludeUrls));

  const [includeInput, setIncludeInput] = useState('');
  const [excludeInput, setExcludeInput] = useState('');

  const [includeOptions, setIncludeOptions] = useState(ALL_OPTIONS);
  const [excludeOptions, setExcludeOptions] = useState(ALL_OPTIONS);

  useEffect(() => {
    // reset khi ấn discard
    if (JSON.stringify(initSettings) === JSON.stringify(settings)) {
      setIncludeSelected(parseUrls(initSettings.includeUrls));
      setExcludeSelected(parseUrls(initSettings.excludeUrls));
      setMode(getInitialMode());
    }
  }, [settings]);

  useEffect(() => {
    if (mode === 'all') {
      setSettings(prev => ({
        ...prev,
        allShow: 'all',
        includeUrls: '',
        excludeUrls: ''
      }));
    } else if (mode === 'include') {
      setSettings(prev => ({
        ...prev,
        allShow: 'specific',
        includeUrls: includeSelected.join(','),
        excludeUrls: ''
      }));
    } else if (mode === 'exclude') {
      setSettings(prev => ({
        ...prev,
        allShow: 'specific',
        includeUrls: '',
        excludeUrls: excludeSelected.join(',')
      }));
    }
  }, [mode, includeSelected, excludeSelected]);

  const handleSelectChange = useCallback(value => {
    setMode(value);

    if (value === 'include') {
      setExcludeSelected([]);
    } else if (value === 'exclude') {
      setIncludeSelected([]);
    } else {
      setIncludeSelected([]);
      setExcludeSelected([]);
    }
  }, []);

  const updateText = useCallback((type, value) => {
    const isInclude = type === 'include';
    const setInput = isInclude ? setIncludeInput : setExcludeInput;
    const setOptions = isInclude ? setIncludeOptions : setExcludeOptions;

    setInput(value);

    if (!value) {
      setOptions(ALL_OPTIONS);
      return;
    }

    const filtered = ALL_OPTIONS.filter(page =>
      page.label.toLowerCase().includes(value.toLowerCase())
    );

    if (value.trim() && (value.startsWith('/') || value.includes('.'))) {
      const customValue = value.trim();

      filtered.push({value: customValue, label: `${customValue} (custom)`});
    }

    setOptions(filtered);
  }, []);

  const onSelectOption = useCallback((type, selected) => {
    const isInclude = type === 'include';
    if (isInclude) {
      setIncludeSelected(selected);
      setIncludeInput('');
    } else {
      setExcludeSelected(selected);
      setExcludeInput('');
    }
  }, []);

  const removeTag = useCallback((type, tagToRemove) => {
    if (type === 'include') {
      setIncludeSelected(prev => prev.filter(v => v !== tagToRemove));
    } else {
      setExcludeSelected(prev => prev.filter(v => v !== tagToRemove));
    }
  }, []);

  const renderTags = type => {
    const selected = type === 'include' ? includeSelected : excludeSelected;

    return (
      <LegacyStack spacing="extraTight">
        {selected.map(value => {
          const option = ALL_OPTIONS.find(o => o.value === value);
          const label = option ? option.value : `${value} (custom)`;
          return (
            <Tag key={value} onRemove={() => removeTag(type, value)}>
              {label}
            </Tag>
          );
        })}
      </LegacyStack>
    );
  };

  const renderAutocomplete = (type, label) => {
    const selected = type === 'include' ? includeSelected : excludeSelected;
    const inputValue = type === 'include' ? includeInput : excludeInput;
    const options = type === 'include' ? includeOptions : excludeOptions;

    return (
      <Autocomplete
        allowMultiple
        options={options}
        selected={selected}
        onSelect={selected => onSelectOption(type, selected)}
        textField={
          <Autocomplete.TextField
            label={label}
            value={inputValue}
            onChange={v => updateText(type, v)}
            verticalContent={renderTags(type)}
            placeholder="Search or type custom URL..."
            autoComplete="off"
          />
        }
      />
    );
  };

  return (
    <div>
      <div style={{marginBottom: '16px', fontWeight: '600'}}>PAGES RESTRICTION</div>

      <Select options={specificPageOptions} onChange={handleSelectChange} value={mode} />

      {mode === 'include' && (
        <div style={{marginTop: '16px'}}>
          {renderAutocomplete('include', 'Show only on these pages')}
        </div>
      )}

      {mode === 'exclude' && (
        <div style={{marginTop: '16px'}}>
          {renderAutocomplete('exclude', 'Hide on these pages')}
        </div>
      )}
    </div>
  );
}
