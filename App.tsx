import React, { useState, useMemo } from 'react';
import { ActiveTab, Navbar } from './components/navbar/Navbar';
import { HomeLanding } from './components/home/HomeLanding';
import { Step1HouseDesign } from './components/steps/Step1HouseDesign';
import { Step2SoilFoundation } from './components/steps/Step2SoilFoundation';
import { Step3LocationEarthquake } from './components/steps/Step3LocationEarthquake';
import { Step4AnalysisResults } from './components/steps/Step4AnalysisResults';
import { GlossaryModal } from './components/common/GlossaryModal';

import { HouseConfig, SoilProfile, EarthquakeConfig, LocationData, HistoricalScenario } from './types';
import { DEFAULT_HOUSE_CONFIG, DEFAULT_SOIL_PROFILE, HISTORICAL_SCENARIOS } from './utils/presets';
import { evaluateLiquefaction } from './utils/geotechnical';

export const App: React.FC = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('beranda');
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);
  const [hasAnalyzed, setHasAnalyzed] = useState<boolean>(false);

  // House State
  const [house, setHouse] = useState<HouseConfig>(DEFAULT_HOUSE_CONFIG);

  // Soil Profile State
  const [soil, setSoil] = useState<SoilProfile>(DEFAULT_SOIL_PROFILE);

  // Location State
  const [location, setLocation] = useState<LocationData>({
    lat: -0.925,
    lng: 119.895,
    cityName: 'Palu (Petobo / Balaroa), Sulawesi Tengah',
    seismicZone: 'Zona Sangat Tinggi (Sesar Aktif Palu-Koro)'
  });

  // Earthquake Configuration State
  const [earthquake, setEarthquake] = useState<EarthquakeConfig>({
    magnitude: 7.5,
    pga: 0.45,
    scenarioId: 'palu-2018'
  });

  // Dynamic Geotechnical Calculation
  // Computed reliably using NCEER (Youd et al., 2001) SPT method
  const analysis = useMemo(() => {
    return evaluateLiquefaction(soil, earthquake);
  }, [soil, earthquake]);

  // Handle Loading a Historical Preset Scenario
  const handleSelectScenario = (scenario: HistoricalScenario) => {
    setEarthquake({
      magnitude: scenario.magnitude,
      pga: scenario.pga,
      scenarioId: scenario.id
    });
    setSoil({
      waterTableDepth: scenario.defaultGroundwater,
      layers: scenario.defaultLayers
    });
    setLocation({
      lat: scenario.lat,
      lng: scenario.lng,
      cityName: scenario.location
    });
    setHasAnalyzed(true);
    setActiveTab('hasil-analisis');
  };

  // Reset Everything to Default
  const handleReset = () => {
    setHouse(DEFAULT_HOUSE_CONFIG);
    setSoil(DEFAULT_SOIL_PROFILE);
    setEarthquake({
      magnitude: 7.5,
      pga: 0.45,
      scenarioId: 'palu-2018'
    });
    setLocation({
      lat: -0.925,
      lng: 119.895,
      cityName: 'Palu (Petobo / Balaroa), Sulawesi Tengah',
      seismicZone: 'Zona Sangat Tinggi (Sesar Aktif Palu-Koro)'
    });
    setHasAnalyzed(false);
    setActiveTab('beranda');
  };

  // Load Demo Quick Case
  const handleLoadDemo = () => {
    const demo = HISTORICAL_SCENARIOS[0]; // Palu 2018
    handleSelectScenario(demo);
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans selection:bg-brand-cyan selection:text-navy-950">
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onReset={handleReset}
        onLoadDemo={handleLoadDemo}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        hasAnalyzed={hasAnalyzed}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'beranda' && (
          <HomeLanding
            onStartAnalysis={() => setActiveTab('desain-rumah')}
            onSelectScenario={handleSelectScenario}
            onOpenGlossary={() => setIsGlossaryOpen(true)}
          />
        )}

        {activeTab === 'desain-rumah' && (
          <Step1HouseDesign
            house={house}
            soil={soil}
            onChangeHouse={setHouse}
            onNext={() => setActiveTab('tanah-fondasi')}
          />
        )}

        {activeTab === 'tanah-fondasi' && (
          <Step2SoilFoundation
            house={house}
            soil={soil}
            onChangeHouse={setHouse}
            onChangeSoil={setSoil}
            onPrev={() => setActiveTab('desain-rumah')}
            onNext={() => setActiveTab('lokasi-gempa')}
          />
        )}

        {activeTab === 'lokasi-gempa' && (
          <Step3LocationEarthquake
            location={location}
            earthquake={earthquake}
            onChangeLocation={setLocation}
            onChangeEarthquake={setEarthquake}
            onApplyScenario={handleSelectScenario}
            onPrev={() => setActiveTab('tanah-fondasi')}
            onNext={() => {
              setHasAnalyzed(true);
              setActiveTab('hasil-analisis');
            }}
          />
        )}

        {activeTab === 'hasil-analisis' && (
          <Step4AnalysisResults
            house={house}
            soil={soil}
            earthquake={earthquake}
            location={location}
            analysis={analysis}
            onReset={handleReset}
            onReplaySim={() => {}}
            onOpenGlossary={() => setIsGlossaryOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-navy-900 bg-navy-950 py-6 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">TERRASAFE</span>
            <span>•</span>
            <span>Aplikasi Pembelajaran Geoteknik Likuifaksi Teknik Sipil</span>
          </div>
          <div className="text-[11px] font-mono text-slate-600">
            Metode NCEER (Youd et al., 2001) • Iwasaki et al. (1982) • OpenStreetMap
          </div>
        </div>
      </footer>

      {/* Geotechnical Glossary Modal */}
      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />
    </div>
  );
};
