import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Zap, 
  Search, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  Maximize2, 
  ExternalLink, 
  ShieldCheck, 
  Radio, 
  Compass,
  Building2,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { 
  NIGERIA_STATE_GRID_DATA, 
  GEOPOLITICAL_ZONES, 
  GeopoliticalZone, 
  StateGridProfile 
} from '../data/nigeriaGridData';

export const NigeriaGridMaps: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<GeopoliticalZone | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedStates, setExpandedStates] = useState<Record<string, boolean>>({
    lagos: true,
    abuja_fct: true
  });
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  // Read Maps API key from environment
  const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // Listen for Google Maps quota exceeded event
  useEffect(() => {
    const handleQuotaExceeded = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  const toggleExpand = (stateId: string) => {
    setExpandedStates((prev) => ({
      ...prev,
      [stateId]: !prev[stateId]
    }));
  };

  const handleExpandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    NIGERIA_STATE_GRID_DATA.forEach((s) => {
      allExpanded[s.id] = true;
    });
    setExpandedStates(allExpanded);
  };

  const handleCollapseAll = () => {
    setExpandedStates({});
  };

  // Filter states by zone and search query
  const filteredStates = NIGERIA_STATE_GRID_DATA.filter((state) => {
    const matchesZone = selectedZone === 'All' || state.zone === selectedZone;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesZone;

    const matchesName = state.name.toLowerCase().includes(query);
    const matchesCapital = state.capital.toLowerCase().includes(query);
    const matchesDisco = state.disco.toLowerCase().includes(query);
    const matchesSubstations = state.substations.some((s) =>
      s.name.toLowerCase().includes(query) || s.location.toLowerCase().includes(query)
    );
    const matchesPoints = state.gridInjectionPoints.some((p) =>
      p.toLowerCase().includes(query)
    );

    return matchesZone && (matchesName || matchesCapital || matchesDisco || matchesSubstations || matchesPoints);
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Quota reached notification banner */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm rounded-xl flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Page Header Banner */}
      <div className="bg-[#091122] border border-orange-500/20 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-orange-400" />
                Nigeria National Grid Infrastructure
              </span>
              <span className="text-xs text-slate-400">
                36 States + FCT • 6 Geopolitical Zones
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Power Transmission &amp; Grid Maps
            </h1>
            <p className="text-slate-300 max-w-2xl text-xs sm:text-sm mt-2 leading-relaxed">
              Explore embedded high-resolution Google Maps detailing 330kV and 132kV bulk transmission substations, regional grid injection nodes, and franchised electricity distribution territories across Nigeria.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleExpandAll}
              className="px-3.5 py-2 text-xs font-bold text-slate-200 bg-[#0c1833] hover:bg-[#12234a] border border-orange-500/30 rounded-xl transition-all cursor-pointer"
            >
              Expand All
            </button>
            <button
              onClick={handleCollapseAll}
              className="px-3.5 py-2 text-xs font-bold text-slate-400 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all cursor-pointer"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Live Search */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by state, capital, substation, or DISCO..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#0b1528] border border-orange-500/30 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Quick Stats Pill Strip */}
          <div className="md:col-span-7 flex items-center justify-end gap-2 text-xs text-slate-400 overflow-x-auto no-scrollbar">
            <span className="font-semibold text-white">Showing {filteredStates.length} of 37 states</span>
            <span aria-hidden="true">·</span>
            <span>Over 140 Transmission Substations</span>
            <span aria-hidden="true">·</span>
            <span className="text-orange-400 font-bold">TCN National Grid</span>
          </div>
        </div>

        {/* 6 Geopolitical Zones Tabs */}
        <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedZone('All')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedZone === 'All'
                ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20'
                : 'bg-[#0c1833] text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            All Zones (37)
          </button>
          {GEOPOLITICAL_ZONES.map((zone) => {
            const count = NIGERIA_STATE_GRID_DATA.filter((s) => s.zone === zone).length;
            const isSelected = selectedZone === zone;
            return (
              <button
                key={zone}
                onClick={() => setSelectedZone(zone)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20'
                    : 'bg-[#0c1833] text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                {zone} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of State Cards with Expandable Google Maps Embeds */}
      {filteredStates.length === 0 ? (
        <div className="bg-white rounded-2xl border border-orange-200/60 p-12 text-center text-slate-600 shadow-xl">
          <MapPin className="w-10 h-10 text-orange-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No matching states or substations</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Try adjusting your search terms or select "All Zones" to view all 36 states and FCT.
          </p>
          <button
            onClick={() => {
              setSelectedZone('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg text-xs font-bold shadow hover:bg-orange-700 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredStates.map((state) => {
            const isExpanded = Boolean(expandedStates[state.id]);
            const primarySubstation = state.substations[0]?.name || `${state.name} Transmission Substation`;
            
            // Construct official Google Maps Embed URL
            const mapQuery = `${state.name} State Nigeria ${primarySubstation}`;
            const mapEmbedUrl = mapsApiKey
              ? `https://www.google.com/maps/embed/v1/search?key=${mapsApiKey}&q=${encodeURIComponent(mapQuery)}&center=${state.center.lat},${state.center.lng}&zoom=${state.zoom}`
              : `https://www.google.com/maps?q=${state.center.lat},${state.center.lng}&z=${state.zoom}&output=embed`;

            return (
              <div
                key={state.id}
                className="bg-white rounded-2xl border border-orange-200/70 shadow-lg overflow-hidden text-slate-900 transition-all hover:border-orange-400/80 flex flex-col justify-between"
              >
                {/* State Card Header */}
                <div className="p-5 sm:p-6 border-b border-orange-100 bg-gradient-to-r from-orange-50/60 via-white to-amber-50/40">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-700 bg-orange-100 px-2 py-0.5 rounded border border-orange-300">
                          {state.zone}
                        </span>
                        <span className="text-xs font-bold text-slate-600">
                          Capital: <span className="text-slate-900">{state.capital}</span>
                        </span>
                      </div>
                      <h2 className="text-xl font-black text-slate-950 tracking-tight flex items-center gap-2">
                        <span>{state.name} State</span>
                        {state.id === 'abuja_fct' && (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                            Federal Capital
                          </span>
                        )}
                      </h2>
                      <p className="text-xs text-orange-950 font-semibold mt-0.5 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-orange-600" />
                        <span>DISCO: {state.disco}</span>
                        <span className="text-slate-400 font-normal">({state.discoFullName})</span>
                      </p>
                    </div>

                    <button
                      onClick={() => toggleExpand(state.id)}
                      className={`p-2 rounded-xl transition-colors cursor-pointer border ${
                        isExpanded
                          ? 'bg-orange-500 text-slate-950 border-orange-400 shadow-sm'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-orange-100 hover:text-orange-800'
                      }`}
                      title={isExpanded ? 'Collapse Map' : 'Expand Map'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Summary commentary */}
                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    {state.gridCoverageSummary}
                  </p>
                </div>

                {/* Substation & Grid Details */}
                <div className="p-5 sm:p-6 space-y-4">
                  {/* Transmission Substations */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2">
                      <Zap className="w-3.5 h-3.5 text-orange-600" />
                      <span>330kV &amp; 132kV Bulk Transmission Substations</span>
                    </h3>
                    <div className="space-y-1.5">
                      {state.substations.map((sub, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                            <span className="font-semibold text-slate-800 truncate">{sub.name}</span>
                            {sub.isNationalHub && (
                              <span className="text-[9px] uppercase font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-300">
                                National Hub
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="font-mono text-[11px] font-bold text-slate-600">
                              {sub.voltage}
                            </span>
                            {sub.capacityMva && (
                              <span className="text-[10px] text-slate-400 font-mono">
                                {sub.capacityMva} MVA
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Primary Grid Injection Points */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2">
                      <Radio className="w-3.5 h-3.5 text-orange-600" />
                      <span>Grid Injection Points &amp; Feeder Ties</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {state.gridInjectionPoints.map((point, idx) => (
                        <div
                          key={idx}
                          className="text-[11px] font-medium text-slate-700 bg-orange-50/40 border border-orange-200/50 rounded-md px-2.5 py-1 truncate"
                          title={point}
                        >
                          • {point}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Power Generation Plants if present */}
                  {state.powerPlants && state.powerPlants.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200">
                      <Activity className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-bold">Generation Plants: </span>
                        <span>{state.powerPlants.join(' • ')}</span>
                      </div>
                    </div>
                  )}

                  {/* Expandable Embedded Google Map */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-slate-200 space-y-2 animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-semibold text-slate-700 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-orange-600" />
                          Google Maps View: {state.name} State Grid
                        </span>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 text-[11px]"
                        >
                          <span>Open in Google Maps</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      {/* Map Container - Explicit minimum height to prevent collapse */}
                      <div className="relative w-full h-80 rounded-xl overflow-hidden border border-slate-300 shadow-inner bg-slate-100">
                        <iframe
                          title={`Google Map - ${state.name} Power Transmission`}
                          src={mapEmbedUrl}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Action Footer */}
                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500 font-mono">
                    Lat: {state.center.lat.toFixed(4)}°, Lng: {state.center.lng.toFixed(4)}°
                  </span>
                  <button
                    onClick={() => toggleExpand(state.id)}
                    className="font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isExpanded ? 'Collapse Map' : 'View Transmission Map'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
