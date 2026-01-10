import { ChartBar } from "lucide-react";

interface QuickStats {
  totalVisits: number;
  lastVisit: string;
  totalDays: number;
  favoriteService: string;
  memberStatus: string;
}

interface DogQuickStatsSectionProps {
  stats: QuickStats;
}

const DogQuickStatsSection = ({ stats }: DogQuickStatsSectionProps) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
          <ChartBar className="w-4 h-4 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold">Estadísticas Rápidas</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-sm text-gray-600">Total de Visitas</span>
          <span className="font-semibold">{stats.totalVisits}</span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-sm text-gray-600">Última Visita</span>
          <span className="font-semibold">{stats.lastVisit}</span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-sm text-gray-600">Total de Días</span>
          <span className="font-semibold">{stats.totalDays}</span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-sm text-gray-600">Servicio Favorito</span>
          <span className="font-semibold">{stats.favoriteService}</span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-gray-600">Estado de Miembro</span>
          <span className="px-2 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded">
            {stats.memberStatus}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DogQuickStatsSection;

