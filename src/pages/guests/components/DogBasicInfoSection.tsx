import { PawPrint } from "lucide-react";
import DogBasicInfoForm, {
  type DogBasicInfoFormValues,
} from "@/components/Form/Forms/DogBasicInfoForm";

interface DogBasicInfoSectionProps {
  dogId: number;
  ownerId: number;
  defaultValues: DogBasicInfoFormValues;
}

const DogBasicInfoSection = ({
  dogId,
  ownerId,
  defaultValues,
}: DogBasicInfoSectionProps) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
            <PawPrint className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold">Información Básica</h3>
        </div>
        <button className="text-sm text-blue-600 hover:underline">
          Click fields to edit
        </button>
      </div>

      <DogBasicInfoForm
        dogId={dogId}
        ownerId={ownerId}
        defaultValues={defaultValues}
      />
    </div>
  );
};

export default DogBasicInfoSection;

