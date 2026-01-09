import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { DOG_BY_ID } from "@/lib/api/dogs.api";
import type { Dog, User } from "@/types/Dog";
import {
  ArrowLeft,
  Printer,
  Share2,
  Pencil,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  Syringe,
  Plus,
  CheckCircle2,
  AlertTriangle,
  ChartBar,
  Heart,
  PawPrint,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  calculateAge,
  formatAgeFromBirthDate,
  DOG_BREEDS,
  cn,
} from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface DogDetailOwner extends Omit<User, "password"> {
  birthDate?: string;
}

interface DogDetail extends Omit<Dog, "owner"> {
  owner?: DogDetailOwner | null;
}

const SIZE_LABELS: Record<string, string> = {
  SMALL: "Pequeño",
  MEDIUM: "Mediano",
  LARGE: "Grande",
  TOY: "Toy",
  GIGANTIC: "Gigante",
};

const SIZE_RANGES: Record<string, string> = {
  SMALL: "0-10 kg",
  MEDIUM: "10-25 kg",
  LARGE: "25-45 kg",
  TOY: "0-4 kg",
  GIGANTIC: "45+ kg",
};

const GENDER_LABELS: Record<string, string> = {
  Male: "Macho",
  Female: "Hembra",
  Other: "Otro",
};

// Mock data for sections not yet from API
const mockMedicalInfo = {
  allergies: "None reported",
  medications: "None currently",
  specialDietaryNeeds: "High-protein diet recommended",
  veterinarian: "Dr. Sarah Mitchell - Paws & Claws Clinic",
  lastCheckup: "15/10/2024",
  nextCheckup: "15/04/2025",
};

const mockBehavioralNotes = {
  temperament: "Friendly, energetic, loves to play fetch",
  socialization:
    "Gets along well with other dogs. Loves children. Can be shy around cats initially but warms up quickly.",
  specialInstructions:
    "Needs at least 1 hour of exercise daily. Prefers outdoor play. Responds well to positive reinforcement training.",
  tags: ["Good with Kids", "Good with Dogs", "Energetic", "Playful"],
};

const mockVaccinations = [
  { name: "Rabies", expiry: "Dec 2025", status: "valid" as const },
  { name: "DHPP", expiry: "Nov 2025", status: "valid" as const },
  { name: "Bordetella", expiry: "Feb 2025", status: "expiring" as const },
  { name: "Lyme Disease", expiry: "Aug 2025", status: "valid" as const },
];

const mockQuickStats = {
  totalVisits: 47,
  lastVisit: "Dec 28, 2024",
  totalDays: 142,
  favoriteService: "Daycare",
  memberStatus: "Gold",
};

const DogProfile = () => {
  const { dogId } = useParams<{ dogId: string }>();
  const navigate = useNavigate();

  const { data, loading, error } = useQuery<{ dogById: DogDetail }>(DOG_BY_ID, {
    variables: { dogByIdId: Number(dogId) },
    skip: !dogId,
  });

  const dog = data?.dogById;
  const owner = dog?.owner;
  const age = dog?.birthDate
    ? calculateAge(dog.birthDate)
    : { years: 0, months: 0 };

  if (loading) {
    return <DogProfileSkeleton />;
  }

  if (error || !dog) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error al cargar perfil</h2>
          <p className="text-gray-500 mb-4">
            No se pudo encontrar la información del perro.
          </p>
          <Button onClick={() => navigate(-1)}>Volver</Button>
        </div>
      </div>
    );
  }

  const formatBirthDate = (date: string) => {
    return format(new Date(date), "MMM dd, yyyy", { locale: es });
  };

  return (
    <div className="h-full overflow-auto bg-[#F9FAFB]">
      {/* Header */}
      <div className="bg-[#3D3B39] text-white">
        <div className="px-6 py-4">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-semibold">Perfil de {dog.name}</h1>
                <p className="text-sm text-gray-400">
                  Guest ID: #GS-{dog.id?.padStart(4, "0")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                <Printer className="w-4 h-4 mr-2" />
                Imprimir
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Compartir
              </Button>
              <Button
                size="sm"
                className="bg-[#A3C585] hover:bg-[#8FB86E] text-black"
              >
                <Pencil className="w-4 h-4 mr-2" />
                Modo Edición
              </Button>
            </div>
          </div>

          {/* Dog info header */}
          <div className="flex items-start gap-6">
            <div className="relative">
              <img
                src={
                  dog.imageUrl ||
                  "https://ui-avatars.com/api/?background=8B7355&color=fff&name=" +
                    encodeURIComponent(dog.name.charAt(0))
                }
                alt={dog.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white/20"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-bold">{dog.name}</h2>
                <span className="px-3 py-1 bg-[#4CAF50] text-white text-xs font-medium rounded-full">
                  Checked In
                </span>
              </div>
              <p className="text-gray-300 mb-4">
                {DOG_BREEDS[dog.breed as keyof typeof DOG_BREEDS] || dog.breed}{" "}
                • {formatAgeFromBirthDate(dog.birthDate)} •{" "}
                {GENDER_LABELS[dog.gender || "Male"]}
              </p>

              {/* Stats row */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">
                    Peso
                  </p>
                  <p className="text-lg font-semibold">{dog.weight || 0} kg</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">
                    Tamaño
                  </p>
                  <p className="text-lg font-semibold">
                    {SIZE_LABELS[dog.size || "MEDIUM"]}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">
                    Color
                  </p>
                  <p className="text-lg font-semibold">{dog.color || "N/A"}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">
                    Fecha de nacimiento
                  </p>
                  <p className="text-lg font-semibold">
                    {dog.birthDate ? formatBirthDate(dog.birthDate) : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Owner mini card */}
            {owner && (
              <div className="bg-[#4A4845] rounded-xl p-4 min-w-[200px]">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                  Dueño
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={
                      owner.profilePicture ||
                      "https://ui-avatars.com/api/?background=8B7355&color=fff&name=" +
                        encodeURIComponent(
                          (owner.name?.charAt(0) || "") +
                            (owner.lastname?.charAt(0) || "")
                        )
                    }
                    alt={`${owner.name} ${owner.lastname}`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">
                      {owner.name} {owner.lastname}
                    </p>
                    <p className="text-sm text-gray-400">{owner.phone}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - 2 cols wide */}
          <div className="col-span-2 space-y-6">
            {/* Basic Information */}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    Nombre del perro
                  </label>
                  <Input
                    value={dog.name}
                    readOnly
                    className="mt-1 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    Raza
                  </label>
                  <Input
                    value={
                      DOG_BREEDS[dog.breed as keyof typeof DOG_BREEDS] ||
                      dog.breed
                    }
                    readOnly
                    className="mt-1 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    Fecha de nacimiento
                  </label>
                  <Input
                    type="date"
                    value={dog.birthDate?.split("T")[0] || ""}
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider">
                      Edad (Años)
                    </label>
                    <Input
                      value={age.years}
                      readOnly
                      className="mt-1 bg-gray-100 text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider">
                      Edad (Meses)
                    </label>
                    <Input
                      value={age.months}
                      readOnly
                      className="mt-1 bg-gray-100 text-gray-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    Sexo
                  </label>
                  <Input
                    value={GENDER_LABELS[dog.gender || "Male"]}
                    readOnly
                    className="mt-1 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    Color
                  </label>
                  <Input
                    value={dog.color || ""}
                    readOnly
                    className="mt-1 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    Peso (kg)
                  </label>
                  <Input
                    value={dog.weight || ""}
                    readOnly
                    className="mt-1 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    Categoría de tamaño
                  </label>
                  <Input
                    value={`${SIZE_LABELS[dog.size || "MEDIUM"]} (${
                      SIZE_RANGES[dog.size || "MEDIUM"]
                    })`}
                    readOnly
                    className="mt-1 bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                    <Heart className="w-4 h-4 text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold">Información Médica</h3>
                </div>
                <button className="text-sm text-[#A3C585] hover:underline flex items-center gap-1">
                  <Plus className="w-4 h-4" />
                  Add Record
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    Alergias
                  </label>
                  <p className="mt-1 text-gray-900">
                    {mockMedicalInfo.allergies}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    Medicamentos
                  </label>
                  <p className="mt-1 text-gray-900">
                    {mockMedicalInfo.medications}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    Necesidades dietéticas especiales
                  </label>
                  <p className="mt-1 text-gray-900">
                    {mockMedicalInfo.specialDietaryNeeds}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    Veterinario
                  </label>
                  <p className="mt-1 text-gray-900">
                    {mockMedicalInfo.veterinarian}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider">
                      Último chequeo
                    </label>
                    <p className="mt-1 text-gray-900">
                      {mockMedicalInfo.lastCheckup}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider">
                      Próximo chequeo
                    </label>
                    <p className="mt-1 text-gray-900">
                      {mockMedicalInfo.nextCheckup}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Behavioral Notes */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <PawPrint className="w-4 h-4 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold">
                  Notas de Comportamiento
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    Temperamento
                  </label>
                  <p className="mt-1 text-gray-900">
                    {mockBehavioralNotes.temperament}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    Socialización
                  </label>
                  <p className="mt-1 text-gray-900">
                    {mockBehavioralNotes.socialization}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">
                    Instrucciones especiales
                  </label>
                  <p className="mt-1 text-gray-900">
                    {mockBehavioralNotes.specialInstructions}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {mockBehavioralNotes.tags.map((tag) => (
                    <span
                      key={tag}
                      className={cn(
                        "px-3 py-1 rounded-full text-sm font-medium",
                        tag === "Good with Kids" &&
                          "bg-green-100 text-green-700",
                        tag === "Good with Dogs" && "bg-blue-100 text-blue-700",
                        tag === "Energetic" && "bg-orange-100 text-orange-700",
                        tag === "Playful" && "bg-pink-100 text-pink-700"
                      )}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Owner Details */}
            {owner && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                    <span className="text-amber-600">👤</span>
                  </div>
                  <h3 className="text-lg font-semibold">Detalles del Dueño</h3>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={
                      owner.profilePicture ||
                      "https://ui-avatars.com/api/?background=8B7355&color=fff&name=" +
                        encodeURIComponent(
                          (owner.name?.charAt(0) || "") +
                            (owner.lastname?.charAt(0) || "")
                        )
                    }
                    alt={`${owner.name} ${owner.lastname}`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">
                      {owner.name} {owner.lastname}
                    </p>
                    <p className="text-sm text-gray-500">Member since 2022</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{owner.phone || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{owner.email}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span className="text-gray-600">
                      123 Oak Street, Apt 4B
                      <br />
                      Springfield, CA 90210
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <AlertCircle className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase">
                        Contacto de emergencia
                      </p>
                      <span>John Wilson - (555) 987-6543</span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-4 border-gray-200"
                >
                  Ver Perfil Completo
                </Button>
              </div>
            )}

            {/* Vaccinations */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Syringe className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Vacunas</h3>
                </div>
                <button className="text-[#A3C585] hover:text-[#8FB86E]">
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {mockVaccinations.map((vaccine) => (
                  <div
                    key={vaccine.name}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-sm">{vaccine.name}</p>
                      <p className="text-xs text-gray-500">
                        Expires: {vaccine.expiry}
                      </p>
                    </div>
                    {vaccine.status === "valid" && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                    {vaccine.status === "expiring" && (
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <ChartBar className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold">Estadísticas Rápidas</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">
                    Total de Visitas
                  </span>
                  <span className="font-semibold">
                    {mockQuickStats.totalVisits}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Última Visita</span>
                  <span className="font-semibold">
                    {mockQuickStats.lastVisit}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Total de Días</span>
                  <span className="font-semibold">
                    {mockQuickStats.totalDays}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">
                    Servicio Favorito
                  </span>
                  <span className="font-semibold">
                    {mockQuickStats.favoriteService}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">
                    Estado de Miembro
                  </span>
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded">
                    {mockQuickStats.memberStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading skeleton
const DogProfileSkeleton = () => (
  <div className="h-full overflow-auto bg-[#F9FAFB]">
    <div className="bg-[#3D3B39] p-6">
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="w-6 h-6 rounded bg-white/20" />
        <Skeleton className="w-48 h-6 rounded bg-white/20" />
      </div>
      <div className="flex items-start gap-6">
        <Skeleton className="w-24 h-24 rounded-full bg-white/20" />
        <div className="flex-1 space-y-3">
          <Skeleton className="w-48 h-8 rounded bg-white/20" />
          <Skeleton className="w-64 h-4 rounded bg-white/20" />
          <div className="flex gap-6">
            <Skeleton className="w-16 h-12 rounded bg-white/20" />
            <Skeleton className="w-16 h-12 rounded bg-white/20" />
            <Skeleton className="w-16 h-12 rounded bg-white/20" />
            <Skeleton className="w-24 h-12 rounded bg-white/20" />
          </div>
        </div>
      </div>
    </div>
    <div className="p-6">
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Skeleton className="w-full h-64 rounded-xl" />
          <Skeleton className="w-full h-48 rounded-xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="w-full h-64 rounded-xl" />
          <Skeleton className="w-full h-48 rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

export default DogProfile;
