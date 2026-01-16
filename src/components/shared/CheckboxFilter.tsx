// components/catalog/CheckboxFilter.tsx
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface CheckboxItem {
  key: string;
  label: string;
}

interface CheckboxFilterProps {
  items: CheckboxItem[];
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  showSearch?: boolean;
  selectedKeys?: string[];
  onSelectionChange?: (selectedKeys: string[]) => void;
}

export default function CheckboxFilter({
  items,
  searchValue = "",
  onSearchChange,
  showSearch = false,
  selectedKeys,
  onSelectionChange,
}: CheckboxFilterProps) {
  const [internalSelected, setInternalSelected] = useState<string[]>([]);
  const selected = selectedKeys !== undefined ? selectedKeys : internalSelected;

  // Sync internal state with external prop
  useEffect(() => {
    if (selectedKeys !== undefined) {
      setInternalSelected(selectedKeys);
    }
  }, [selectedKeys]);

  const filtered = showSearch
    ? items.filter((item) => item.label.toLowerCase().includes(searchValue.toLowerCase()))
    : items;

  const handleToggle = (key: string) => {
    const newSelected = selected.includes(key) 
      ? selected.filter((k) => k !== key)
      : [...selected, key];
    
    if (selectedKeys === undefined) {
      setInternalSelected(newSelected);
    }
    
    onSelectionChange?.(newSelected);
  };

  return (
    <>
      {showSearch && (
        <input
          type="text"
          placeholder="Axtar..."
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-black"
        />
      )}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div key={item.key} className="flex items-center gap-3">
            <Checkbox
              id={item.key}
              checked={selected.includes(item.key)}
              onCheckedChange={() => handleToggle(item.key)}
            />
            <label htmlFor={item.key} className="text-sm text-[#14171A] cursor-pointer select-none">
              {item.label}
            </label>
          </div>
        ))}
      </div>
    </>
  );
}