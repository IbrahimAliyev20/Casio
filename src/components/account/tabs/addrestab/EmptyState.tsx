import { Button } from "@/components/ui/button";
import { MapPinX, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

interface EmptyStateProps {
  onAddNew: () => void;
}

export default function EmptyState({
  onAddNew,
}: EmptyStateProps) {
  const t = useTranslations("account");
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      <MapPinX className="w-10 h-10 text-[#565355] mb-6" />

      <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
        Hazırda yadda saxlanılmış ünvan yoxdur
      </h2>

      <p className="text-sm text-gray-500 max-w-md mb-10">
        Ünvan əlavə edərək alış-veriş zamanı vaxt itirmədən sifarişlərinizi daha
        tez tamamla.
      </p>

      <Button
        onClick={onAddNew}
        className="w-full max-w-md h-14 rounded-none text-base font-medium flex items-center justify-center gap-2"
      >
        <Plus size={18} />
        Ünvan əlavə et
      </Button>
    </div>
  );
}
