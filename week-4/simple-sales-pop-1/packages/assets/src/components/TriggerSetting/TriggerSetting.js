import { Select, LegacyStack, Tag } from '@shopify/polaris';
import { useState, useCallback, useMemo, useRef } from 'react';

const TriggerSetting = ({ settings, setSettings }) => {
    const specificPageOptions = [
        { label: 'All Page', value: 'all' },
        { label: 'Specific Page', value: 'specific' },
    ];

    const handleSelectChange = useCallback((value) => {
        setSettings(prev => ({ ...prev, allShow: value }));
    }, []);

    // Danh sách gợi ý
    const allSuggestions = useMemo(() => [
        { value: 'rustic', label: 'Rustic' },
        { value: 'antique', label: 'Antique' },
        { value: 'vinyl', label: 'Vinyl' },
        { value: 'vintage', label: 'Vintage' },
        { value: 'refurbished', label: 'Refurbished' },
        { value: 'cotton', label: 'Cotton' },
        { value: 'summer', label: 'Summer' },
        { value: 'modern', label: 'Modern' },
    ], []);

    const [selectedTags, setSelectedTags] = useState(['rustic']);
    const [inputValue, setInputValue] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState(allSuggestions);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const inputRef = useRef(null);

    // Thêm tag
    const addTag = useCallback((value) => {
        const trimmed = value.trim();
        if (!trimmed) return;

        const matched = allSuggestions.find(
            s => s.label.toLowerCase() === trimmed.toLowerCase() ||
                s.value.toLowerCase() === trimmed.toLowerCase()
        );

        const tagValue = matched ? matched.value : trimmed.toLowerCase().replace(/\s+/g, '_');

        if (!selectedTags.includes(tagValue)) {
            setSelectedTags(prev => [...prev, tagValue]);
        }
        setInputValue('');
        setShowSuggestions(false);
    }, [allSuggestions, selectedTags]);

    // Xử lý khi gõ
    const handleInputChange = useCallback((e) => {
        const value = e.target.value;
        setInputValue(value);
        setShowSuggestions(true);

        if (!value) {
            setFilteredSuggestions(allSuggestions);
            return;
        }

        const filtered = allSuggestions.filter(s =>
            s.label.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredSuggestions(filtered);
    }, [allSuggestions]);

    // Nhấn Enter hoặc phẩy
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(inputValue);
        } else if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
            // Xóa tag cuối khi bấm Backspace và input rỗng
            setSelectedTags(prev => prev.slice(0, -1));
        }
    }, [inputValue, selectedTags, addTag]);

    // Click vào gợi ý
    const handleSuggestionClick = useCallback((suggestion) => {
        addTag(suggestion.label);
        inputRef.current?.focus();
    }, [addTag]);

    // Xóa tag
    const removeTag = useCallback((tagToRemove) => {
        setSelectedTags(prev => prev.filter(t => t !== tagToRemove));
    }, []);

    // Click ngoài để ẩn gợi ý
    const handleClickOutside = useCallback(() => {
        setShowSuggestions(false);
    }, []);

    return (
        <div>
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                PAGES RESTRICTION
            </div>

            <Select
                label="Show on"
                options={specificPageOptions}
                onChange={handleSelectChange}
                value={settings.allShow}
            />

            {/* Tags Input tự code */}
            <div style={{ marginTop: '20px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                    Tags
                </div>

                <div style={{ position: 'relative' }}>
                    {/* Khu vực chứa tag + input */}
                    <div
                        style={{
                            border: '1px solid #c4cdd5',
                            borderRadius: '6px',
                            padding: '8px',
                            minHeight: '44px',
                            background: 'white',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px',
                            alignItems: 'center',
                            cursor: 'text',
                        }}
                        onClick={() => inputRef.current?.focus()}
                    >
                        {/* Các tag đã chọn */}
                        {selectedTags.map(tag => {
                            const found = allSuggestions.find(s => s.value === tag);
                            const label = found ? found.label : tag.replace(/_/g, ' ');
                            return (
                                <Tag key={tag} onRemove={() => removeTag(tag)}>
                                    {label}
                                </Tag>
                            );
                        })}

                        {/* Input thật */}
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setShowSuggestions(true)}
                            onBlur={handleClickOutside}
                            placeholder={selectedTags.length === 0 ? "Vintage, cotton, summer" : ""}
                            style={{
                                border: 'none',
                                outline: 'none',
                                fontSize: '14px',
                                flex: 1,
                                minWidth: '120px',
                                padding: '4px 0',
                            }}
                            autoComplete="off"
                        />
                    </div>

                    {/* Danh sách gợi ý */}
                    {showSuggestions && filteredSuggestions.length > 0 && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                background: 'white',
                                border: '1px solid #c4cdd5',
                                borderTop: 'none',
                                borderRadius: '0 0 6px 6px',
                                maxHeight: '200px',
                                overflowY: 'auto',
                                zIndex: 10,
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            }}
                        >
                            {filteredSuggestions.map(suggestion => (
                                <div
                                    key={suggestion.value}
                                    onMouseDown={(e) => e.preventDefault()} // tránh blur trước khi click
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    style={{
                                        padding: '10px 12px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        background: 'white',
                                    }}
                                    onMouseEnter={(e) => e.target.style.background = '#f6f6f6'}
                                    onMouseLeave={(e) => e.target.style.background = 'white'}
                                >
                                    {suggestion.label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TriggerSetting;