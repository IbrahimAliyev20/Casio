"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { AttributeResponse, CategoryResponse } from "@/types"

interface FilterSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen)

  return (
    <div className="border-b border-[#F2F4F8] py-4">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between text-sm font-medium text-primary"
      >
        <span>{title}</span>
        <span className="text-gray-400">{isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}</span>
      </button>
      {isOpen && <div className="mt-4 space-y-3">{children}</div>}
    </div>
  )
}

interface AttributeFilterSectionProps {
  attr: AttributeResponse
  searchValue: string
  onSearchChange: (value: string) => void
  tc: (key: string) => string
  selectedAttributeValueIds: string[]
  onAttributeValueChange: (valueId: string, checked: boolean) => void
}

function AttributeFilterSection({ 
  attr, 
  searchValue, 
  onSearchChange, 
  tc,
  selectedAttributeValueIds,
  onAttributeValueChange
}: AttributeFilterSectionProps) {
  const handleAttributeChange = (valueId: string, checked: boolean) => {
    onAttributeValueChange(valueId, checked)
  }

  const getValueId = (value: { id?: string | number; name: string }, index: number) => {
    if (value.id !== undefined && value.id !== null) {
      return String(value.id)
    }
    // Fallback to name, or index if name is also missing
    return value.name || `attr-value-${index}`
  }

  return (
    <FilterSection title={attr.name} defaultOpen={attr.attribute_values.length <= 5}>
      {attr.attribute_values.length > 5 && (
        <Input
          placeholder={tc("search")}
          className="h-9"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      )}
      <div className={`space-y-2 ${attr.attribute_values.length > 5 ? 'max-h-40 overflow-auto pr-1 mt-2' : ''}`}>
        {attr.attribute_values
          .filter((item) =>
            searchValue === "" || item.name.toLowerCase().includes(searchValue.toLowerCase())
          )
          .map((item, index) => {
            const valueId = getValueId(item, index)
            return (
              <label key={valueId} className="flex items-center gap-2 text-sm text-primary">
                <Checkbox
                  className="border-primary"
                  checked={selectedAttributeValueIds.includes(valueId)}
                  onCheckedChange={(checked) => handleAttributeChange(valueId, checked as boolean)}
                />
                {item.name}
              </label>
            )
          })}
      </div>
    </FilterSection>
  )
}

export interface FilterSidebarProps {
  className?: string
  attributes?: AttributeResponse[]
  // Filter state props
  minPrice: number
  maxPrice: number
  onMinPriceChange: (value: number) => void
  onMaxPriceChange: (value: number) => void
  selectedAttributeValueIds: string[]
  onAttributeValueChange: (valueId: string, checked: boolean) => void
  selectedCategoryIds?: string[]
  selectedCatalogIds?: string[]
  onCategoryIdsChange?: (ids: string[]) => void
  onCatalogIdsChange?: (ids: string[]) => void
  categories?: CategoryResponse[]
  catalogs?: Array<{ id?: number; name: string; slug?: string }>
}

export function FilterSidebar({ 
  className, 
  attributes = [],
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  selectedAttributeValueIds,
  onAttributeValueChange,
  selectedCategoryIds = [],
  selectedCatalogIds = [],
  onCategoryIdsChange,
  onCatalogIdsChange,
  categories = [],
  catalogs = []
}: FilterSidebarProps) {
  const t = useTranslations("product_grid")
  const tc = useTranslations("catalog.filters")

  const [attributeSearches, setAttributeSearches] = useState<Record<string, string>>({})

  return (
    <aside
      className={`w-full lg:w-[280px] rounded-[12px] bg-white border border-[#F2F4F8] p-4 ${className ?? ""}`}
      style={{ boxShadow: "0px 8px 12px 0px #00000008" }}
    >
      <FilterSection title={t("price")} defaultOpen>
        <div className="flex items-center gap-3">
          <Input
            placeholder={tc("min")}
            className="h-9"
            type="number"
            value={minPrice || ""}
            onChange={(e) => {
              const nextMin = Number(e.target.value) || 0
              const clamped = Math.max(0, Math.min(nextMin, maxPrice || 5600))
              onMinPriceChange(clamped)
            }}
          />
          <span className="text-sm text-[#77777B]">—</span>
          <Input
            placeholder={tc("max")}
            className="h-9"
            type="number"
            value={maxPrice || ""}
            onChange={(e) => {
              const nextMax = Number(e.target.value) || 0
              const clamped = Math.max(minPrice || 0, nextMax)
              onMaxPriceChange(clamped)
            }}
          />
        </div>
        <PriceRangeSlider
          min={0}
          max={5600}
          step={10}
          value={[minPrice || 0, maxPrice || 5600]}
          onValueChange={(val) => {
            onMinPriceChange(val[0])
            onMaxPriceChange(val[1])
          }}
        />
      </FilterSection>

      {categories.length > 0 && onCategoryIdsChange && (
        <FilterSection title={tc("categories") || "Kateqoriyalar"} defaultOpen>
          <div className="space-y-2">
            {categories
              .filter((category) => category.id !== undefined && category.id !== null)
              .map((category) => {
                const categoryId = String(category.id!);
                return (
                  <label key={categoryId} className="flex items-center gap-2 text-sm text-primary">
                    <Checkbox
                      className="border-primary"
                      checked={selectedCategoryIds.includes(categoryId)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          onCategoryIdsChange([...selectedCategoryIds, categoryId])
                        } else {
                          onCategoryIdsChange(selectedCategoryIds.filter(id => id !== categoryId))
                        }
                      }}
                    />
                    {category.name}
                  </label>
                )
              })}
          </div>
        </FilterSection>
      )}

      {catalogs.length > 0 && onCatalogIdsChange && (
        <FilterSection title={tc("catalogs") || "Kataloqlar"} defaultOpen>
          <div className="space-y-2">
            {catalogs.map((catalog, index) => {
              // Use id if available, otherwise use index or slug
              const catalogId = catalog.id ? String(catalog.id) : (catalog.slug || String(index))
              return (
                <label key={catalogId} className="flex items-center gap-2 text-sm text-primary">
                  <Checkbox
                    className="border-primary"
                    checked={selectedCatalogIds.includes(catalogId)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onCatalogIdsChange([...selectedCatalogIds, catalogId])
                      } else {
                        onCatalogIdsChange(selectedCatalogIds.filter(id => id !== catalogId))
                      }
                    }}
                  />
                  {catalog.name}
                </label>
              )
            })}
          </div>
        </FilterSection>
      )}

      {attributes.map((attr) => {
        const attrKey = attr.name.toLowerCase().replace(/\s+/g, '_')
        const searchValue = attributeSearches[attrKey] || ""

        const handleSearchChange = (value: string) => {
          setAttributeSearches(prev => ({ ...prev, [attrKey]: value }))
        }

        return (
          <AttributeFilterSection 
            key={attr.name} 
            attr={attr} 
            searchValue={searchValue}
            onSearchChange={handleSearchChange}
            tc={tc}
            selectedAttributeValueIds={selectedAttributeValueIds}
            onAttributeValueChange={onAttributeValueChange}
          />
        )
      })}
    </aside>
  )
}

export default FilterSidebar

interface PriceRangeSliderProps {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: [number, number];
  value?: [number, number];
  onValueChange?: (value: [number, number]) => void;
  className?: string;
  currency?: string;
}

function PriceRangeSlider({
  min = 0,
  max = 5600,
  step = 10,
  defaultValue,
  value,
  onValueChange,
  className,
  currency = "₼",
}: PriceRangeSliderProps) {
  const [internalValue, setInternalValue] = useState<[number, number]>(defaultValue || [min, max]);
  const currentValue = value || internalValue;

  const handleValueChange = (newValue: number[]) => {
    const rangeValue: [number, number] = [newValue[0], newValue[1]];
    if (!value) {
      setInternalValue(rangeValue);
    }
    onValueChange?.(rangeValue);
  };

  const formatPrice = (price: number): string => {
    return `${price.toLocaleString()} ${currency}`;
  };

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Price Display */}
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-gray-700">
          {formatPrice(currentValue[0])}
        </div>
        <div className="text-sm font-medium text-gray-700">
          {formatPrice(currentValue[1])}
        </div>
      </div>

      {/* Slider */}
      <div className="px-2">
        <Slider
          value={currentValue}
          onValueChange={handleValueChange}
          min={min}
          max={max}
          step={step}
          className="w-full"
          minStepsBetweenThumbs={1}
        />
      </div>
    </div>
  );
}