import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Sparkles,
  ArrowRight,
  Calendar,
  DollarSign,
  Layers,
  ChevronRight,
  Flame,
  Award,
  Filter,
  CheckCircle2,
  Info
} from 'lucide-react';
import {
  ALL_28_INDIAN_STATES,
  ALL_UNION_TERRITORIES,
  ALL_INDIA_DESTINATIONS,
  INDIAN_FESTIVALS,
  IndiaStateMeta
} from '../../data/indiaAllDestinations';
import { IndianDestination, IndiaTravelCategory } from '../../types/travel';

interface InteractiveIndiaMapProps {
  selectedStateCode: string | null;
  onSelectState: (stateCode: string) => void;
  onSelectDestinationForPlanning: (destinationName: string) => void;
  onViewFestivals?: (stateName: string) => void;
  theme: 'dark' | 'light';
  currency: string;
}

// Map coordinates and layout for all 28 states + 8 UTs (viewBox: 0 0 700 800)
interface StateMapNode {
  code: string;
  name: string;
  cx: number;
  cy: number;
  path: string;
  labelX: number;
  labelY: number;
  region: 'North' | 'South' | 'West' | 'East' | 'Northeast' | 'Central' | 'Islands';
}

const STATE_NODES: StateMapNode[] = [
  // NORTH
  { code: 'LA', name: 'Ladakh', cx: 280, cy: 95, path: 'M230,70 L310,50 L345,100 L300,140 L245,115 Z', labelX: 280, labelY: 95, region: 'North' },
  { code: 'JK', name: 'Jammu & Kashmir', cx: 215, cy: 120, path: 'M180,105 L230,70 L245,115 L220,150 L180,135 Z', labelX: 205, labelY: 125, region: 'North' },
  { code: 'HP', name: 'Himachal Pradesh', cx: 260, cy: 165, path: 'M220,150 L260,135 L295,155 L285,190 L240,185 Z', labelX: 260, labelY: 165, region: 'North' },
  { code: 'PB', name: 'Punjab', cx: 215, cy: 185, path: 'M185,160 L235,165 L235,215 L180,205 Z', labelX: 210, labelY: 190, region: 'North' },
  { code: 'CH', name: 'Chandigarh', cx: 242, cy: 182, path: 'M238,178 L248,178 L248,188 L238,188 Z', labelX: 242, labelY: 182, region: 'North' },
  { code: 'UK', name: 'Uttarakhand', cx: 295, cy: 195, path: 'M265,185 L320,175 L335,220 L285,220 Z', labelX: 295, labelY: 200, region: 'North' },
  { code: 'HR', name: 'Haryana', cx: 235, cy: 225, path: 'M215,205 L260,205 L260,250 L210,240 Z', labelX: 235, labelY: 228, region: 'North' },
  { code: 'DL', name: 'Delhi', cx: 252, cy: 232, path: 'M247,227 L258,227 L258,238 L247,238 Z', labelX: 252, labelY: 233, region: 'North' },
  { code: 'UP', name: 'Uttar Pradesh', cx: 335, cy: 265, path: 'M265,225 L350,220 L410,270 L350,310 L275,275 Z', labelX: 335, labelY: 265, region: 'North' },
  { code: 'RJ', name: 'Rajasthan', cx: 180, cy: 275, path: 'M130,220 L230,215 L255,295 L190,360 L120,300 Z', labelX: 180, labelY: 280, region: 'North' },

  // WEST & CENTRAL
  { code: 'GJ', name: 'Gujarat', cx: 125, cy: 375, path: 'M80,330 L160,330 L175,410 L100,430 L65,370 Z', labelX: 125, labelY: 380, region: 'West' },
  { code: 'MP', name: 'Madhya Pradesh', cx: 285, cy: 360, path: 'M200,320 L350,300 L380,390 L260,420 L190,370 Z', labelX: 280, labelY: 360, region: 'Central' },
  { code: 'CG', name: 'Chhattisgarh', cx: 375, cy: 405, path: 'M355,340 L400,340 L410,465 L360,470 L345,400 Z', labelX: 375, labelY: 410, region: 'Central' },
  { code: 'MH', name: 'Maharashtra', cx: 220, cy: 465, path: 'M145,415 L260,410 L335,455 L275,540 L160,510 Z', labelX: 225, labelY: 470, region: 'West' },
  { code: 'GA', name: 'Goa', cx: 172, cy: 545, path: 'M165,538 L180,538 L180,555 L165,555 Z', labelX: 172, labelY: 548, region: 'West' },
  { code: 'DD', name: 'Daman & Diu', cx: 135, cy: 435, path: 'M130,430 L142,430 L142,442 L130,442 Z', labelX: 135, labelY: 436, region: 'West' },

  // EAST
  { code: 'BR', name: 'Bihar', cx: 440, cy: 285, path: 'M395,260 L480,260 L480,320 L400,320 Z', labelX: 440, labelY: 290, region: 'East' },
  { code: 'JH', name: 'Jharkhand', cx: 440, cy: 345, path: 'M400,320 L480,320 L470,380 L395,370 Z', labelX: 440, labelY: 350, region: 'East' },
  { code: 'WB', name: 'West Bengal', cx: 485, cy: 355, path: 'M470,250 L495,245 L505,375 L465,400 L465,340 Z', labelX: 485, labelY: 355, region: 'East' },
  { code: 'OD', name: 'Odisha', cx: 430, cy: 435, path: 'M390,385 L475,385 L485,465 L415,485 L395,435 Z', labelX: 430, labelY: 440, region: 'East' },

  // NORTHEAST
  { code: 'SK', name: 'Sikkim', cx: 490, cy: 220, path: 'M480,205 L505,205 L505,235 L480,235 Z', labelX: 492, labelY: 220, region: 'Northeast' },
  { code: 'AR', name: 'Arunachal Pradesh', cx: 610, cy: 195, path: 'M540,185 L640,165 L665,220 L585,225 Z', labelX: 610, labelY: 200, region: 'Northeast' },
  { code: 'AS', name: 'Assam', cx: 565, cy: 245, path: 'M510,235 L625,225 L615,270 L520,270 Z', labelX: 565, labelY: 250, region: 'Northeast' },
  { code: 'ML', name: 'Meghalaya', cx: 535, cy: 275, path: 'M510,265 L570,265 L570,290 L510,290 Z', labelX: 538, labelY: 278, region: 'Northeast' },
  { code: 'NL', name: 'Nagaland', cx: 625, cy: 255, path: 'M610,235 L640,240 L635,280 L605,275 Z', labelX: 625, labelY: 260, region: 'Northeast' },
  { code: 'MN', name: 'Manipur', cx: 615, cy: 298, path: 'M600,280 L635,280 L630,325 L595,320 Z', labelX: 615, labelY: 302, region: 'Northeast' },
  { code: 'MZ', name: 'Mizoram', cx: 590, cy: 345, path: 'M580,320 L610,320 L605,375 L575,370 Z', labelX: 592, labelY: 348, region: 'Northeast' },
  { code: 'TR', name: 'Tripura', cx: 555, cy: 330, path: 'M540,315 L570,315 L565,355 L535,350 Z', labelX: 555, labelY: 335, region: 'Northeast' },

  // SOUTH
  { code: 'TS', name: 'Telangana', cx: 285, cy: 495, path: 'M255,465 L330,455 L345,530 L275,540 Z', labelX: 285, labelY: 500, region: 'South' },
  { code: 'AP', name: 'Andhra Pradesh', cx: 320, cy: 565, path: 'M285,535 L375,480 L380,590 L290,620 Z', labelX: 325, labelY: 570, region: 'South' },
  { code: 'KA', name: 'Karnataka', cx: 215, cy: 580, path: 'M170,515 L260,515 L265,635 L190,645 L170,570 Z', labelX: 215, labelY: 585, region: 'South' },
  { code: 'KL', name: 'Kerala', cx: 210, cy: 685, path: 'M190,640 L225,640 L235,745 L200,740 Z', labelX: 210, labelY: 695, region: 'South' },
  { code: 'TN', name: 'Tamil Nadu', cx: 265, cy: 675, path: 'M230,625 L310,615 L300,735 L225,740 Z', labelX: 265, labelY: 685, region: 'South' },
  { code: 'PY', name: 'Puducherry', cx: 305, cy: 650, path: 'M300,644 L312,644 L312,656 L300,656 Z', labelX: 305, labelY: 650, region: 'South' },

  // ISLANDS
  { code: 'LD', name: 'Lakshadweep', cx: 135, cy: 690, path: 'M125,675 L145,675 L145,715 L125,715 Z', labelX: 135, labelY: 695, region: 'Islands' },
  { code: 'AN', name: 'Andaman & Nicobar', cx: 620, cy: 630, path: 'M610,580 L635,580 L635,710 L610,710 Z', labelX: 620, labelY: 645, region: 'Islands' },
];

export const InteractiveIndiaMap: React.FC<InteractiveIndiaMapProps> = ({
  selectedStateCode,
  onSelectState,
  onSelectDestinationForPlanning,
  onViewFestivals,
  theme,
  currency,
}) => {
  const isDark = theme === 'dark';
  const [hoveredNode, setHoveredNode] = useState<StateMapNode | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<IndiaTravelCategory | 'All'>('All');
  const [activeRegionFilter, setActiveRegionFilter] = useState<string>('All');

  const allMetas = [...ALL_28_INDIAN_STATES, ...ALL_UNION_TERRITORIES];
  const currentStateMeta = allMetas.find((s) => s.code === selectedStateCode) || allMetas.find((s) => s.code === 'RJ');

  // Filtered destinations belonging to selected state
  const stateDestinations = currentStateMeta
    ? ALL_INDIA_DESTINATIONS.filter((d) =>
        d.state.toLowerCase().includes(currentStateMeta.name.toLowerCase()) ||
        (currentStateMeta.name.includes('Delhi') && d.state.includes('Delhi')) ||
        (currentStateMeta.name.includes('Goa') && d.state.includes('Goa')) ||
        (currentStateMeta.name.includes('Jammu') && d.state.includes('Jammu')) ||
        (currentStateMeta.name.includes('Ladakh') && d.state.includes('Ladakh'))
      )
    : [];

  const CATEGORY_FILTERS: Array<{ id: IndiaTravelCategory | 'All'; label: string; icon: string }> = [
    { id: 'All', label: 'All Experiences', icon: '🇮🇳' },
    { id: 'Heritage', label: 'Heritage', icon: '🏰' },
    { id: 'Mountains', label: 'Mountains', icon: '🏔' },
    { id: 'Beaches', label: 'Beaches', icon: '🏖' },
    { id: 'Wildlife', label: 'Wildlife', icon: '🐅' },
    { id: 'Spiritual', label: 'Spiritual', icon: '🛕' },
    { id: 'Food', label: 'Food', icon: '🍛' },
    { id: 'Luxury', label: 'Luxury', icon: '💎' },
    { id: 'Adventure', label: 'Adventure', icon: '🧗' },
  ];

  return (
    <div className="space-y-6">
      {/* Category Pills Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {CATEGORY_FILTERS.map((cat) => {
            const isSelected = activeCategoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryFilter(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 font-bold border-amber-400 shadow-md'
                    : isDark
                    ? 'bg-[#12181E] border-white/10 text-stone-300 hover:text-white hover:border-white/20'
                    : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-xs font-mono-num text-amber-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Click any state on map to inspect</span>
        </div>
      </div>

      {/* Main Interactive Map & Details Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* SVG Interactive Map Column (7 cols) */}
        <div
          className={`lg:col-span-7 rounded-3xl p-4 sm:p-6 border relative overflow-hidden transition-all ${
            isDark
              ? 'bg-[#0E1317] border-white/10 shadow-2xl'
              : 'bg-stone-50 border-stone-200 shadow-lg'
          }`}
        >
          {/* Map Title Overlay */}
          <div className="absolute top-5 left-6 z-10 pointer-events-none">
            <span className="text-[10px] font-mono-num uppercase tracking-wider text-amber-400 block font-bold">
              BHARAT INTERACTIVE GEOGRAPHIC ATLAS
            </span>
            <h4 className="font-editorial text-xl font-bold text-white">
              28 States · 8 Union Territories
            </h4>
          </div>

          {/* Hover Floating Card */}
          {hoveredNode && (
            <div className="absolute top-5 right-6 z-20 pointer-events-none bg-stone-900/95 backdrop-blur-md border border-amber-500/40 p-3.5 rounded-2xl shadow-2xl max-w-xs animate-in fade-in zoom-in-95 duration-150">
              {(() => {
                const meta = allMetas.find((m) => m.code === hoveredNode.code);
                return (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-amber-300 font-mono-num uppercase">
                        {hoveredNode.name}
                      </span>
                      <span className="text-[10px] font-mono-num px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                        {meta?.region}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-300 font-sans-ui">
                      {meta?.highlightTag}
                    </div>
                    <div className="text-[10px] text-stone-400 font-mono-num pt-1 flex items-center justify-between border-t border-white/10">
                      <span>{meta?.destinationsCount || 2}+ Destinations</span>
                      <span className="text-emerald-400 font-bold">{meta?.typicalBudget}</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* SVG Map Render */}
          <div className="w-full flex items-center justify-center pt-8">
            <svg
              viewBox="50 30 630 730"
              className="w-full h-auto max-h-[580px] drop-shadow-md select-none"
              style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }}
            >
              {/* Subtle background ocean coordinates */}
              <defs>
                <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="330" cy="400" r="300" fill="url(#mapGlow)" />

              {/* State Polygons / Paths */}
              {STATE_NODES.map((node) => {
                const isSelected = selectedStateCode === node.code;
                const isHovered = hoveredNode?.code === node.code;
                const meta = allMetas.find((m) => m.code === node.code);

                return (
                  <g
                    key={node.code}
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => onSelectState(node.code)}
                  >
                    {/* State Path */}
                    <path
                      d={node.path}
                      className={`transition-all duration-200 ${
                        isSelected
                          ? 'fill-amber-500 stroke-amber-200 stroke-[2.5] filter drop-shadow(0 0 8px rgba(245,158,11,0.7))'
                          : isHovered
                          ? 'fill-amber-500/70 stroke-amber-300 stroke-[2]'
                          : isDark
                          ? 'fill-[#1C252D] hover:fill-[#2A3742] stroke-[#384653] stroke-[1]'
                          : 'fill-[#E5E7EB] hover:fill-[#D1D5DB] stroke-[#9CA3AF] stroke-[1]'
                      }`}
                    />

                    {/* Centroid Interactive Pulsing Pin */}
                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r={isSelected ? 5 : isHovered ? 4.5 : 3}
                      className={`transition-all ${
                        isSelected
                          ? 'fill-white stroke-stone-950 stroke-2'
                          : isHovered
                          ? 'fill-amber-300'
                          : 'fill-stone-400 opacity-60'
                      }`}
                    />

                    {/* State Code Label */}
                    <text
                      x={node.labelX}
                      y={node.labelY + (isSelected ? -8 : 4)}
                      textAnchor="middle"
                      className={`text-[9px] font-mono-num font-bold pointer-events-none transition-all ${
                        isSelected
                          ? 'fill-stone-950 font-black text-[10px]'
                          : isHovered
                          ? 'fill-white'
                          : 'fill-stone-400 opacity-80'
                      }`}
                    >
                      {node.code}
                    </text>
                  </g>
                );
              })}

              {/* Waterway Labels */}
              <text x="100" y="550" className="text-[10px] fill-stone-600 font-mono-num uppercase tracking-widest opacity-40">
                Arabian Sea
              </text>
              <text x="500" y="550" className="text-[10px] fill-stone-600 font-mono-num uppercase tracking-widest opacity-40">
                Bay of Bengal
              </text>
              <text x="280" y="750" className="text-[10px] fill-stone-600 font-mono-num uppercase tracking-widest opacity-40">
                Indian Ocean
              </text>
            </svg>
          </div>

          {/* Quick Legend at bottom */}
          <div className="flex items-center justify-between text-[11px] text-stone-400 pt-3 border-t border-white/5 font-mono-num">
            <span>Selected: <strong className="text-amber-400 font-bold">{currentStateMeta?.name}</strong></span>
            <span>Hover to preview · Click to drilldown</span>
          </div>
        </div>

        {/* State Detail Panel Column (5 cols) */}
        {currentStateMeta && (
          <div
            className={`lg:col-span-5 rounded-3xl p-6 border space-y-6 transition-all ${
              isDark
                ? 'bg-gradient-to-b from-[#11171C] to-[#0D1216] border-amber-500/30 shadow-2xl'
                : 'bg-white border-stone-200 shadow-lg'
            }`}
          >
            {/* Header info */}
            <div className="space-y-2 border-b border-white/10 pb-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-num text-amber-400 font-bold uppercase">
                  {currentStateMeta.region} INDIA · CODE: {currentStateMeta.code}
                </span>
                <span className="text-xs font-mono-num px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-bold">
                  {currentStateMeta.typicalBudget} Daily Budget
                </span>
              </div>

              <h3 className="font-editorial text-3xl font-bold text-white">
                {currentStateMeta.name}
              </h3>

              <p className="text-xs text-stone-300 font-sans-ui leading-relaxed">
                {currentStateMeta.highlightTag}. Travel Style:{' '}
                <span className="text-amber-300 font-semibold">{currentStateMeta.travelStyle}</span>.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono-num">
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
                  <span className="text-stone-400 block text-[10px]">Capital City</span>
                  <span className="text-white font-semibold">{currentStateMeta.capital}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
                  <span className="text-stone-400 block text-[10px]">Prime Season</span>
                  <span className="text-amber-300 font-semibold">{currentStateMeta.bestSeason}</span>
                </div>
              </div>
            </div>

            {/* Top Destinations for this state */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-editorial text-lg font-bold text-white">
                  Featured Destinations ({stateDestinations.length})
                </span>
                <span className="text-stone-400 font-mono-num text-[11px]">
                  Click to launch planner
                </span>
              </div>

              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
                {stateDestinations.map((dest) => (
                  <div
                    key={dest.id}
                    className="p-3.5 rounded-2xl bg-black/30 border border-white/10 hover:border-amber-400/50 transition-all flex items-start gap-3.5 group cursor-pointer"
                    onClick={() => onSelectDestinationForPlanning(dest.name)}
                  >
                    <img
                      src={dest.heroImage}
                      alt={dest.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <h5 className="font-editorial text-base font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                          {dest.name}
                        </h5>
                        <span className="text-[10px] font-mono-num text-emerald-400 font-bold shrink-0">
                          ₹{dest.avgDailyBudgetINR.toLocaleString('en-IN')}/d
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-300 line-clamp-2 leading-relaxed">
                        {dest.description}
                      </p>
                      <div className="flex items-center gap-2 pt-1 text-[10px] font-mono-num text-stone-400">
                        <span className="text-amber-400">{dest.recommendedDuration}</span>
                        <span>·</span>
                        <span className="truncate">{dest.attractions.slice(0, 2).join(', ')}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {stateDestinations.length === 0 && (
                  <div className="p-4 rounded-xl bg-black/20 text-center text-xs text-stone-400">
                    Showing primary cities: {currentStateMeta.sampleDestinations.join(', ')}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                onClick={() => onSelectDestinationForPlanning(currentStateMeta.name)}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer font-bold"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Plan Full {currentStateMeta.name} Journey</span>
              </button>

              {onViewFestivals && (
                <button
                  onClick={() => onViewFestivals(currentStateMeta.name)}
                  className="w-full sm:w-auto py-3 px-3.5 rounded-xl text-xs font-semibold bg-black/40 hover:bg-black/60 text-amber-300 border border-amber-500/30 hover:border-amber-400 transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                  title={`View festivals in ${currentStateMeta.name}`}
                >
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>
                    {currentStateMeta.name} Festivals (
                    {
                      INDIAN_FESTIVALS.filter(
                        (f) =>
                          f.state.toLowerCase().includes(currentStateMeta.name.toLowerCase()) ||
                          currentStateMeta.name.toLowerCase().includes(f.state.toLowerCase())
                      ).length
                    }
                    )
                  </span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
