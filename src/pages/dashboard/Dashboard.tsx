import AdPawsCard from "@/components/AdPawsCard";
import InsightCard from "@/components/Dashboard/InsightCard";
import HotelQuickForm from "@/components/Form/Forms/HotelQuickForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getClockTime, getFormattedDate, getTimeOfDay } from "@/lib/utils";
import {
  ArrowUpIcon,
  DoorOpen,
  HotelIcon,
  HouseIcon,
  PawPrintIcon,
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="h-full px-6 py-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-2xl font-bold">¡{getTimeOfDay()}, Enrique!</p>
          <p className="text-[#6B7280] mt-1 ml-1">
            Esto es lo que ha pasado hoy en Casa Pek.
          </p>
        </div>
        <div>
          <p className="text-2xl font-bold">{getClockTime()}</p>
          <p className="">{getFormattedDate()}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 grid-rows-1 gap-6">
        <InsightCard
          title="Huéspedes de hoy"
          data="20"
          mainIcon={PawPrintIcon}
          iconBackgroundColor="#E4F0E4"
          iconColor="#80AF80"
          iconFill="#80AF80"
          disclaimer="+10% vs semana pasada"
          disclaimerIcon={ArrowUpIcon}
        />
        <InsightCard
          title="Llegando hoy"
          data="8"
          mainIcon={HotelIcon}
          iconBackgroundColor="#C5DAEF"
          iconColor="#2563EB"
          iconFill="transparent"
          disclaimer="4 han hecho check-in"
          disclaimerIcon={ArrowUpIcon}
        />
        <InsightCard
          title="Saliendo hoy"
          data="5"
          mainIcon={DoorOpen}
          iconBackgroundColor="#FFEDD5"
          iconColor="#E4A542"
          iconFill="transparent"
          disclaimer="2 pickups retrasados"
          disclaimerIcon={ArrowUpIcon}
        />
        <InsightCard
          title="Capacidad"
          data="80%"
          mainIcon={HouseIcon}
          iconBackgroundColor="#FCE7F3"
          iconColor="#EB5595"
          iconFill="transparent"
          disclaimer="5 habitaciones disponibles"
          disclaimerIcon={ArrowUpIcon}
        />
      </div>
      <div className="grid grid-cols-6 grid-rows-1 gap-6 mt-6">
        <AdPawsCard className="col-span-2 overflow-hidden">
          <div className="w-full min-w-0">
            <p className="text-lg font-bold">Check-In rápido</p>
            <div className="mt-6">
              <Tabs defaultValue="hotel" className="w-full">
                <TabsList className="bg-[#F5F9F2] mb-4">
                  <TabsTrigger
                    value="hotel"
                    className="data-[state=active]:bg-secondary! data-[state=active]:text-white! hover:cursor-pointer"
                  >
                    Hotel
                  </TabsTrigger>
                  <TabsTrigger
                    className="data-[state=active]:bg-secondary! data-[state=active]:text-white! hover:cursor-pointer"
                    value="daycare"
                  >
                    Guardería
                  </TabsTrigger>
                  <TabsTrigger
                    className="data-[state=active]:bg-secondary! data-[state=active]:text-white! hover:cursor-pointer"
                    value="train"
                  >
                    Entrenamiento
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="hotel">
                  <HotelQuickForm />
                </TabsContent>
                <TabsContent value="daycare">
                  <div>
                    <p className="text-lg font-bold">Guardería</p>
                  </div>
                </TabsContent>
                <TabsContent value="train">
                  <div>
                    <p className="text-lg font-bold">Entrenamiento</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </AdPawsCard>
      </div>
    </div>
  );
}
