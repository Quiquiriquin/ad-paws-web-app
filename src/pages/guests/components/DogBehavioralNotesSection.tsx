import { PawPrint } from "lucide-react";
import { cn } from "@/lib/utils";

interface BehavioralNotes {
  temperament: string;
  socialization: string;
  specialInstructions: string;
  tags: string[];
}

interface DogBehavioralNotesSectionProps {
  behavioralNotes: BehavioralNotes;
}

const TAG_STYLES: Record<string, string> = {
  "Good with Kids": "bg-green-100 text-green-700",
  "Good with Dogs": "bg-blue-100 text-blue-700",
  Energetic: "bg-orange-100 text-orange-700",
  Playful: "bg-pink-100 text-pink-700",
};

const DogBehavioralNotesSection = ({
  behavioralNotes,
}: DogBehavioralNotesSectionProps) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
          <PawPrint className="w-4 h-4 text-amber-600" />
        </div>
        <h3 className="text-lg font-semibold">Notas de Comportamiento</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wider">
            Temperamento
          </label>
          <p className="mt-1 text-gray-900">{behavioralNotes.temperament}</p>
        </div>
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wider">
            Socialización
          </label>
          <p className="mt-1 text-gray-900">{behavioralNotes.socialization}</p>
        </div>
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wider">
            Instrucciones especiales
          </label>
          <p className="mt-1 text-gray-900">
            {behavioralNotes.specialInstructions}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          {behavioralNotes.tags.map((tag) => (
            <span
              key={tag}
              className={cn(
                "px-3 py-1 rounded-full text-sm font-medium",
                TAG_STYLES[tag] || "bg-gray-100 text-gray-700"
              )}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DogBehavioralNotesSection;

