import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, MoreVertical, CircleCheck, PencilLine } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Address } from "@/types";
import Image from "next/image";

interface AddressItemProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: number) => void;
  onSelect: (id: number) => void;
}

function AddressItem({
  address,
  onEdit,
  onDelete,
  onSelect,
}: AddressItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-[#FBFDFF] border border-[#f3f2f8] rounded-lg p-3 md:p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="relative flex items-center gap-2 mb-2">
            <h3 className="text-base md:text-2xl font-medium text-gray-900 truncate">
              {address.title}
            </h3>
          </div>

          <p className="flex gap-2 items-center text-xs md:text-sm text-gray-600 mb-1 truncate">
            <MapPin className="w-3 h-3 md:w-4 md:h-4 text-gray-400 flex-shrink-0" />
            {address.address}
          </p>
        </div>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 md:h-8 md:w-8 flex-shrink-0"
            >
              <MoreVertical className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-48 p-1">
          <button
              onClick={() => {
                onDelete(address.id);
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md text-gray-500 hover:text-black hover:bg-[#F2F4F8] transition-colors cursor-pointer"
            >
              <Image
              src="/icons/trash.svg"
              alt="trash"
              width={16}
              height={16}
              className="w-3 h-3 md:w-4 md:h-4 opacity-60 hover:opacity-100 transition-opacity" /> Ünvanı sil
            </button>
            <button
              onClick={() => {
                onEdit(address);
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md text-gray-500 hover:text-black hover:bg-[#F2F4F8] transition-colors cursor-pointer"
            >
              <PencilLine  className="w-3 h-3 md:w-4 md:h-4" /> Düzəliş et
            </button>
       
            {address.selected !== 1 && (
              <button
                onClick={() => {
                  onSelect(address.id);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-[#F2F4F8] transition-colors"
              >
                <CircleCheck className="w-3 h-3 md:w-4 md:h-4" /> Seçilmiş ünvan
                et
              </button>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

export default AddressItem;
