import { useState, useMemo } from "react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useForm, useWatch } from "react-hook-form";
import { useQuery } from "@apollo/client/react";
import {
  BedDoubleIcon,
  SunIcon,
  GraduationCapIcon,
  ScissorsIcon,
  WavesIcon,
  AlertCircle,
  ArrowLeft,
  Check,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Skeleton } from "../ui/skeleton";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDateRangePicker,
  FormServiceTypeCard,
  FormAdditionalServiceItem,
  type ServiceTypeVariant,
  type ServiceItemVariant,
  type DateRangeValue,
} from "../Form";
import { useAuth } from "@/contexts/AuthContext";
import { SERVICES_BY_COMPANY, type Service } from "@/lib/api/services.api";
import { COMPANY_DOGS } from "@/lib/api/dogs.api";

type ServiceType = "HOTEL" | "DAYCARE" | "TRAINING" | "GROOMING";

interface Dog {
  id: string;
  name: string;
  breed: string;
  imageUrl?: string;
  owner?: {
    name?: string;
    lastname?: string;
  };
}

interface CheckInFormValues {
  serviceType: ServiceType | "";
  selectedServiceId: string;
  stayDates: DateRangeValue;
  additionalServices: string[];
  dogId: string;
}

interface ServiceTypeConfig {
  type: ServiceType;
  icon: typeof BedDoubleIcon;
  title: string;
  description: string;
  variant: ServiceTypeVariant;
}

interface AdditionalService {
  id: string;
  icon: typeof WavesIcon;
  title: string;
  description: string;
  price: number;
  variant: ServiceItemVariant;
}

// Service type configurations
const SERVICE_TYPE_CONFIG: Record<
  ServiceType,
  Omit<ServiceTypeConfig, "type">
> = {
  HOTEL: {
    icon: BedDoubleIcon,
    title: "Hospedaje",
    description: "Alojamiento y cuidado nocturno",
    variant: "green",
  },
  DAYCARE: {
    icon: SunIcon,
    title: "Guardería",
    description: "Supervisión y juego diario",
    variant: "blue",
  },
  TRAINING: {
    icon: GraduationCapIcon,
    title: "Entrenamiento",
    description: "Sesiones profesionales",
    variant: "amber",
  },
  GROOMING: {
    icon: ScissorsIcon,
    title: "Estética",
    description: "Spa y servicios de estilismo",
    variant: "rose",
  },
};

const additionalServices: AdditionalService[] = [
  {
    id: "swimming",
    icon: WavesIcon,
    title: "Sesión de Natación",
    description: "30 min de actividad en alberca",
    price: 25,
    variant: "blue",
  },
];

// eslint-disable-next-line react-refresh/only-export-components
export default NiceModal.create(() => {
  const modal = useModal();
  const { company } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);

  // Fetch services for the company
  const {
    data: servicesData,
    loading: servicesLoading,
    error: servicesError,
  } = useQuery<{ servicesByCompany: Service[] }>(SERVICES_BY_COMPANY, {
    variables: {
      input: {
        companyId: company?.id ? Number(company.id) : 0,
        active: true,
      },
    },
    skip: !company?.id,
  });

  // Fetch dogs for the company
  const {
    data: dogsData,
    loading: dogsLoading,
    error: dogsError,
  } = useQuery<{ companyDogs: Dog[] }>(COMPANY_DOGS, {
    variables: {
      companyId: company?.id ? Number(company.id) : 0,
    },
    skip: !company?.id,
  });

  const form = useForm<CheckInFormValues>({
    defaultValues: {
      serviceType: "",
      selectedServiceId: "",
      stayDates: { from: undefined, to: undefined },
      additionalServices: [],
      dogId: "",
    },
    mode: "onChange",
  });

  const serviceType = useWatch({
    control: form.control,
    name: "serviceType",
  });

  const selectedServiceId = useWatch({
    control: form.control,
    name: "selectedServiceId",
  });

  const stayDates = useWatch({
    control: form.control,
    name: "stayDates",
  });

  const selectedAdditionalServices = useWatch({
    control: form.control,
    name: "additionalServices",
  });

  const selectedDogId = useWatch({
    control: form.control,
    name: "dogId",
  });

  // Get unique service types that are available
  const availableServiceTypes = servicesData?.servicesByCompany
    ? [...new Set(servicesData.servicesByCompany.map((s) => s.type))]
    : [];

  // Get services for the selected type
  const servicesForSelectedType =
    servicesData?.servicesByCompany?.filter((s) => s.type === serviceType) ||
    [];

  // Get the selected service details
  const selectedService = servicesData?.servicesByCompany?.find(
    (s) =>
      s.id === selectedServiceId ||
      (servicesForSelectedType.length === 1 &&
        s.id === servicesForSelectedType[0].id)
  );

  // Get dogs list
  const dogs = dogsData?.companyDogs || [];

  // Calculate total
  const total = useMemo(() => {
    let sum = 0;

    // Add service price
    if (selectedService) {
      sum += selectedService.price;
    }

    // Add additional services prices
    selectedAdditionalServices.forEach((serviceId) => {
      const service = additionalServices.find((s) => s.id === serviceId);
      if (service) {
        sum += service.price;
      }
    });

    return sum;
  }, [selectedService, selectedAdditionalServices]);

  const handleCancel = () => {
    modal.hide();
    form.reset();
    setStep(1);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleNextStep = () => {
    // Auto-select service if only one available
    if (servicesForSelectedType.length === 1 && !selectedServiceId) {
      form.setValue("selectedServiceId", servicesForSelectedType[0].id);
    }
    setStep(2);
  };

  const isStep1Valid = () => {
    if (!serviceType) return false;
    if (servicesForSelectedType.length > 1 && !selectedServiceId) return false;
    if (serviceType === "HOTEL" && (!stayDates?.from || !stayDates?.to))
      return false;
    return true;
  };

  const onSubmit = (formData: CheckInFormValues) => {
    console.log("Form submitted:", formData);
    console.log("Total:", total);
    // Handle form submission here
    modal.hide();
    form.reset();
    setStep(1);
  };

  const toggleAdditionalService = (
    serviceId: string,
    currentServices: string[]
  ) => {
    if (currentServices.includes(serviceId)) {
      return currentServices.filter((id) => id !== serviceId);
    }
    return [...currentServices, serviceId];
  };

  const handleServiceTypeSelect = (type: ServiceType) => {
    form.setValue("serviceType", type);
    form.setValue("selectedServiceId", ""); // Reset selected service when type changes
  };

  const loading = servicesLoading || dogsLoading;
  const error = servicesError || dogsError;

  // Format date for display
  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return date.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(price);
  };

  return (
    <Dialog open={modal.visible} onOpenChange={handleCancel}>
      <DialogContent
        className="bg-white dark:bg-gray-800 max-w-xl max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            {step === 2 && (
              <button
                type="button"
                onClick={handleBack}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <DialogTitle className="text-xl font-semibold">
              {step === 1 ? "Nuevo Check-in" : "Confirmar Reservación"}
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Loading State */}
        {loading && (
          <div className="space-y-6 pt-2">
            <div>
              <Skeleton className="h-4 w-48 mb-3" />
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Error al cargar los datos. Por favor intenta de nuevo.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Reintentar
            </Button>
          </div>
        )}

        {/* No Services Available */}
        {!loading && !error && availableServiceTypes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="w-12 h-12 text-amber-500 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No hay servicios disponibles en este momento.
            </p>
          </div>
        )}

        {/* Form */}
        {!loading && !error && availableServiceTypes.length > 0 && (
          <Form form={form} onSubmit={onSubmit} className="space-y-6 pt-2">
            {/* Step 1: Service Selection */}
            {step === 1 && (
              <>
                {/* Service Type Selection */}
                <FormField
                  name="serviceType"
                  rules={{
                    required: "Por favor selecciona un tipo de servicio",
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-muted-foreground">
                        Selecciona el tipo de servicio
                      </FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 gap-3">
                          {availableServiceTypes.map((type) => {
                            const config = SERVICE_TYPE_CONFIG[type];
                            return (
                              <FormServiceTypeCard
                                key={type}
                                icon={config.icon}
                                title={config.title}
                                description={config.description}
                                variant={config.variant}
                                value={type}
                                selectedValue={field.value}
                                onSelect={() => handleServiceTypeSelect(type)}
                              />
                            );
                          })}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Service Selection for Selected Type */}
                {serviceType && servicesForSelectedType.length > 1 && (
                  <FormField
                    name="selectedServiceId"
                    rules={{ required: "Por favor selecciona un servicio" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-muted-foreground">
                          Selecciona el servicio específico
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            {servicesForSelectedType.map((service) => (
                              <button
                                key={service.id}
                                type="button"
                                onClick={() => field.onChange(service.id)}
                                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                                  field.value === service.id
                                    ? "border-[#A3C585] bg-[#A3C585]/10"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-medium">
                                      {service.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {service.duration} min •{" "}
                                      {service.startTime} - {service.endTime}
                                    </p>
                                  </div>
                                  <p className="font-semibold text-[#A3C585]">
                                    {formatPrice(service.price)}
                                  </p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Auto-select if only one service for the type */}
                {serviceType && servicesForSelectedType.length === 1 && (
                  <div className="p-4 rounded-xl border-2 border-[#A3C585] bg-[#A3C585]/10">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">
                          {servicesForSelectedType[0].name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {servicesForSelectedType[0].duration} min •{" "}
                          {servicesForSelectedType[0].startTime} -{" "}
                          {servicesForSelectedType[0].endTime}
                        </p>
                      </div>
                      <p className="font-semibold text-[#A3C585]">
                        {formatPrice(servicesForSelectedType[0].price)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Date Selection for Hotel */}
                {serviceType === "HOTEL" && (
                  <FormField<CheckInFormValues, "stayDates">
                    name="stayDates"
                    rules={{
                      validate: (value) => {
                        if (!value?.from || !value?.to) {
                          return "Selecciona las fechas de entrada y salida";
                        }
                        return true;
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-muted-foreground">
                          Selecciona las fechas de estancia
                        </FormLabel>
                        <FormControl>
                          <FormDateRangePicker
                            placeholder="Selecciona las fechas"
                            value={field.value}
                            onChange={field.onChange}
                            minDate={new Date()}
                            numberOfMonths={2}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Additional Services */}
                {additionalServices.length > 0 && (
                  <FormField
                    name="additionalServices"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-muted-foreground">
                          Servicios Adicionales
                        </FormLabel>
                        <FormControl>
                          <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            {additionalServices.map((service) => (
                              <FormAdditionalServiceItem
                                key={service.id}
                                id={service.id}
                                icon={service.icon}
                                title={service.title}
                                description={service.description}
                                price={formatPrice(service.price)}
                                variant={service.variant}
                                checked={field.value.includes(service.id)}
                                onCheckedChange={() =>
                                  field.onChange(
                                    toggleAdditionalService(
                                      service.id,
                                      field.value
                                    )
                                  )
                                }
                              />
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Step 1 Actions */}
                <div className="flex gap-3 pt-2 flex-col">
                  <Button
                    type="button"
                    className="flex-1 rounded-full bg-[#3D2E1E] hover:bg-[#2D1E0E] text-white"
                    disabled={!isStep1Valid()}
                    onClick={handleNextStep}
                  >
                    Continuar
                  </Button>
                  <Button
                    type="button"
                    variant="link"
                    className="flex-1 rounded-full"
                    onClick={handleCancel}
                  >
                    Cancelar
                  </Button>
                </div>
              </>
            )}

            {/* Step 2: Dog Selection & Summary */}
            {step === 2 && (
              <>
                {/* Summary Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Resumen del Servicio
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-3">
                    {/* Service Type */}
                    <div className="flex items-center gap-3">
                      {serviceType && (
                        <>
                          {(() => {
                            const config = SERVICE_TYPE_CONFIG[serviceType];
                            const Icon = config.icon;
                            return (
                              <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                  config.variant === "green"
                                    ? "bg-green-100 text-green-600"
                                    : config.variant === "blue"
                                    ? "bg-blue-100 text-blue-600"
                                    : config.variant === "amber"
                                    ? "bg-amber-100 text-amber-600"
                                    : "bg-rose-100 text-rose-600"
                                }`}
                              >
                                <Icon className="w-5 h-5" />
                              </div>
                            );
                          })()}
                          <div className="flex-1">
                            <p className="font-medium">
                              {SERVICE_TYPE_CONFIG[serviceType].title}
                            </p>
                            {selectedService && (
                              <p className="text-sm text-gray-500">
                                {selectedService.name}
                              </p>
                            )}
                          </div>
                          {selectedService && (
                            <p className="font-semibold">
                              {formatPrice(selectedService.price)}
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    {/* Dates for Hotel */}
                    {serviceType === "HOTEL" &&
                      stayDates?.from &&
                      stayDates?.to && (
                        <div className="flex items-center justify-between text-sm border-t border-gray-200 dark:border-gray-600 pt-3">
                          <span className="text-gray-500">Fechas</span>
                          <span className="font-medium">
                            {formatDate(stayDates.from)} -{" "}
                            {formatDate(stayDates.to)}
                          </span>
                        </div>
                      )}

                    {/* Additional Services */}
                    {selectedAdditionalServices.length > 0 && (
                      <div className="border-t border-gray-200 dark:border-gray-600 pt-3 space-y-2">
                        <p className="text-sm text-gray-500">
                          Servicios adicionales
                        </p>
                        {selectedAdditionalServices.map((serviceId) => {
                          const service = additionalServices.find(
                            (s) => s.id === serviceId
                          );
                          if (!service) return null;
                          return (
                            <div
                              key={serviceId}
                              className="flex items-center justify-between text-sm"
                            >
                              <span>{service.title}</span>
                              <span className="font-medium">
                                {formatPrice(service.price)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Total */}
                    <div className="border-t-2 border-gray-300 dark:border-gray-500 pt-3 mt-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-lg">Total</span>
                        <span className="font-bold text-xl text-[#A3C585]">
                          {formatPrice(total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dog Selection */}
                <FormField
                  name="dogId"
                  rules={{ required: "Por favor selecciona un perro" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-muted-foreground">
                        Selecciona el perro
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-2 max-h-[200px] overflow-y-auto">
                          {dogs.map((dog) => (
                            <button
                              key={dog.id}
                              type="button"
                              onClick={() => field.onChange(dog.id)}
                              className={`w-full p-3 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                                field.value === dog.id
                                  ? "border-[#A3C585] bg-[#A3C585]/10"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              {/* Dog Image */}
                              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                {dog.imageUrl ? (
                                  <img
                                    src={dog.imageUrl}
                                    alt={dog.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-[#A3C585]/20 text-[#A3C585] font-semibold text-lg">
                                    {dog.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </div>
                              {/* Dog Info */}
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">
                                  {dog.name}
                                </p>
                                <p className="text-sm text-gray-500 truncate">
                                  {dog.owner?.name} {dog.owner?.lastname}
                                </p>
                              </div>
                              {/* Selected indicator */}
                              {field.value === dog.id && (
                                <div className="w-6 h-6 rounded-full bg-[#A3C585] flex items-center justify-center flex-shrink-0">
                                  <Check className="w-4 h-4 text-white" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* No Dogs Available */}
                {dogs.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-4 text-center bg-amber-50 rounded-xl">
                    <AlertCircle className="w-8 h-8 text-amber-500 mb-2" />
                    <p className="text-sm text-gray-600">
                      No hay perros registrados. Por favor registra un perro
                      primero.
                    </p>
                  </div>
                )}

                {/* Step 2 Actions */}
                <div className="flex gap-3 pt-2 flex-col">
                  <Button
                    type="submit"
                    className="flex-1 rounded-full bg-[#3D2E1E] hover:bg-[#2D1E0E] text-white"
                    disabled={
                      form.formState.isSubmitting ||
                      !selectedDogId ||
                      dogs.length === 0
                    }
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <Spinner /> Procesando...
                      </>
                    ) : (
                      "Confirmar Check-in"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="link"
                    className="flex-1 rounded-full"
                    onClick={handleCancel}
                  >
                    Cancelar
                  </Button>
                </div>
              </>
            )}
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
});
