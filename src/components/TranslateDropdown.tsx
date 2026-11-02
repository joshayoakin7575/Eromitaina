import React, { useState, useEffect, useRef } from 'react';
import { Globe, Check, Search, ChevronDown, Sparkles } from 'lucide-react';

export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
  region: 'Nigeria' | 'Benin & Togo' | 'Ghana' | 'Diaspora' | 'Global';
  flag: string;
  gtCode?: string; // Google Translate ISO code if directly supported
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'en', name: 'English', nativeName: 'English (Original)', region: 'Global', flag: '🌐', gtCode: 'en' },
  
  // Nigeria
  { code: 'pcm', name: 'Nigerian Pidgin', nativeName: 'Naija Pidgin', region: 'Nigeria', flag: '🇳🇬', gtCode: 'pcm' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Èdè Yorùbá', region: 'Nigeria', flag: '🇳🇬', gtCode: 'yo' },
  { code: 'ha', name: 'Hausa', nativeName: 'Harshen Hausa', region: 'Nigeria', flag: '🇳🇬', gtCode: 'ha' },
  { code: 'ig', name: 'Igbo', nativeName: 'Asụsụ Igbo', region: 'Nigeria', flag: '🇳🇬', gtCode: 'ig' },
  { code: 'kr', name: 'Kanuri', nativeName: 'Kànurí', region: 'Nigeria', flag: '🇳🇬' },
  { code: 'tiv', name: 'Tiv', nativeName: 'Zwa Tiv', region: 'Nigeria', flag: '🇳🇬' },
  { code: 'ff', name: 'Fulani', nativeName: 'Fulfulde', region: 'Nigeria', flag: '🇳🇬', gtCode: 'ff' },
  { code: 'ijo', name: 'Ijaw', nativeName: 'Ịjọ (Izon)', region: 'Nigeria', flag: '🇳🇬' },
  { code: 'urh', name: 'Urhobo', nativeName: 'Urhobo', region: 'Nigeria', flag: '🇳🇬' },
  { code: 'ibb', name: 'Ibibio', nativeName: 'Ibibio', region: 'Nigeria', flag: '🇳🇬' },
  { code: 'ikw', name: 'Ikwerre', nativeName: 'Iwhuruọhna (Ikwerre)', region: 'Nigeria', flag: '🇳🇬' },
  { code: 'bin', name: 'Edo (Bini)', nativeName: 'Ẹ̀dó', region: 'Nigeria', flag: '🇳🇬' },
  { code: 'nup', name: 'Nupe', nativeName: 'Nupe', region: 'Nigeria', flag: '🇳🇬' },
  { code: 'igl', name: 'Igala', nativeName: 'Igala', region: 'Nigeria', flag: '🇳🇬' },
  { code: 'ebir', name: 'Ebira', nativeName: 'Ebira', region: 'Nigeria', flag: '🇳🇬' },

  // Benin & Togo
  { code: 'fon', name: 'Fon', nativeName: 'Fɔngbe', region: 'Benin & Togo', flag: '🇧🇯', gtCode: 'fon' },
  { code: 'ee', name: 'Ewe', nativeName: 'Eʋegbe', region: 'Benin & Togo', flag: '🇹🇬', gtCode: 'ee' },
  { code: 'gej', name: 'Gen (Mina)', nativeName: 'Gẽ / Mina', region: 'Benin & Togo', flag: '🇹🇬' },
  { code: 'bba', name: 'Bariba', nativeName: 'Baatɔnum', region: 'Benin & Togo', flag: '🇧🇯' },
  { code: 'ddn', name: 'Dendi', nativeName: 'Dendi', region: 'Benin & Togo', flag: '🇧🇯' },

  // Ghana
  { code: 'tw', name: 'Twi', nativeName: 'Twi / Akan', region: 'Ghana', flag: '🇬🇭', gtCode: 'ak' },
  { code: 'gaa', name: 'Ga', nativeName: 'Gã', region: 'Ghana', flag: '🇬🇭', gtCode: 'gaa' },
  { code: 'fat', name: 'Fante', nativeName: 'Mfantse (Fante)', region: 'Ghana', flag: '🇬🇭' },
  { code: 'dag', name: 'Dagbani', nativeName: 'Dagbanli', region: 'Ghana', flag: '🇬🇭' },

  // Diaspora Twist
  { code: 'jam', name: 'Jamaican Patois', nativeName: 'Patwah (Jamaican)', region: 'Diaspora', flag: '🇯🇲' }
];

export const TranslateDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(SUPPORTED_LANGUAGES[0]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const triggerGoogleTranslate = (lang: SupportedLanguage) => {
    setSelectedLang(lang);
    setIsOpen(false);

    // 1. If English, clear translation
    if (lang.code === 'en') {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (select) {
        select.value = 'en';
        select.dispatchEvent(new Event('change'));
      }
      setToastMessage('Language reset to English');
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }

    // 2. Set Google Translate cookie
    const targetCode = lang.gtCode || (lang.code === 'pcm' ? 'pcm' : 'en');
    const cookieVal = `/en/${targetCode}`;
    document.cookie = `googtrans=${cookieVal}; path=/;`;
    document.cookie = `googtrans=${cookieVal}; path=/; domain=${window.location.hostname}`;

    // 3. Trigger select element in Google Translate frame
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (select) {
      select.value = targetCode;
      select.dispatchEvent(new Event('change'));
    }

    // 4. Cultural Greeting Toast
    if (lang.code === 'pcm') {
      setToastMessage('Naija Pidgin active! All your light bills & meter tokens dey intact.');
    } else if (lang.code === 'jam') {
      setToastMessage('Wah Gwaan! CaseBox set to Jamaican Patois. Big up, your power tokens safe!');
    } else if (lang.code === 'yo') {
      setToastMessage('Èdè Yorùbá wà lori ẹrọ rẹ. Ẹ ku abo si CaseBox Utility!');
    } else if (lang.code === 'ha') {
      setToastMessage('Harshen Hausa ya fara aiki. Barka da zuwa CaseBox Utility!');
    } else if (lang.code === 'ig') {
      setToastMessage('Asụsụ Igbo na-arụ ọrụ ugbua. Nnọọ na CaseBox Utility!');
    } else if (lang.code === 'tw') {
      setToastMessage('Twi kasa ahyɛ aseɛ. Akwaaba ba CaseBox Utility!');
    } else {
      setToastMessage(`Switched to ${lang.name} (${lang.nativeName}).`);
    }

    setTimeout(() => setToastMessage(null), 5000);
  };

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Discreet Header Button - Strictly states "Translate" */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 text-xs font-bold text-slate-200 bg-[#0c1833] hover:bg-[#12234a] hover:text-white border border-orange-500/30 rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
        title="Translate Website Language"
      >
        <Globe className="w-3.5 h-3.5 text-orange-400" />
        <span className="font-semibold">Translate</span>
        {selectedLang.code !== 'en' && (
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
        )}
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {/* Dropdown Menu Modal */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-[#091122] border border-orange-500/30 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="p-3 border-b border-slate-800 bg-[#0c1833]/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                Select Language
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {SUPPORTED_LANGUAGES.length} Dialects
              </span>
            </div>

            {/* Live search input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Yoruba, Pidgin, Patois..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#070e1c] border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60 p-1">
            {filteredLanguages.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                No matching languages found
              </div>
            ) : (
              filteredLanguages.map((lang) => {
                const isSelected = selectedLang.code === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => triggerGoogleTranslate(lang)}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs transition-colors rounded-lg cursor-pointer ${
                      isSelected
                        ? 'bg-orange-500/20 text-orange-300 font-bold'
                        : 'text-slate-200 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base leading-none">{lang.flag}</span>
                      <div>
                        <div className="font-semibold leading-tight">{lang.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal leading-tight">
                          {lang.nativeName} • <span className="text-slate-500">{lang.region}</span>
                        </div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-orange-400" />}
                  </button>
                );
              })
            )}
          </div>

          {/* Regional Indicator footer */}
          <div className="p-2.5 bg-[#070e1c] border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Nigeria, Benin, Togo, Ghana &amp; Diaspora</span>
            <span className="text-orange-400 font-medium">Auto-Translates</span>
          </div>
        </div>
      )}

      {/* Cultural Confirmation Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm p-4 bg-[#091122] border border-orange-500/50 rounded-2xl shadow-2xl text-white text-xs flex items-start gap-3 animate-in slide-in-from-bottom duration-300">
          <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <span className="font-bold block text-orange-400">Language Updated</span>
            <span className="text-slate-300 mt-0.5 block leading-relaxed">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};
