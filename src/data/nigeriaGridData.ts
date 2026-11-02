export type GeopoliticalZone = 
  | 'South-West'
  | 'South-South'
  | 'South-East'
  | 'North-Central'
  | 'North-West'
  | 'North-East';

export interface TransmissionSubstation {
  name: string;
  voltage: '330kV' | '132kV' | '330/132kV';
  capacityMva?: number;
  location: string;
  isNationalHub?: boolean;
}

export interface StateGridProfile {
  id: string;
  name: string;
  capital: string;
  zone: GeopoliticalZone;
  disco: string;
  discoFullName: string;
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  substations: TransmissionSubstation[];
  gridInjectionPoints: string[];
  powerPlants?: string[];
  gridCoverageSummary: string;
}

export const GEOPOLITICAL_ZONES: GeopoliticalZone[] = [
  'South-West',
  'South-South',
  'South-East',
  'North-Central',
  'North-West',
  'North-East'
];

export const NIGERIA_STATE_GRID_DATA: StateGridProfile[] = [
  // -------------------------------------------------------------
  // SOUTH-WEST (6 States)
  // -------------------------------------------------------------
  {
    id: 'lagos',
    name: 'Lagos',
    capital: 'Ikeja',
    zone: 'South-West',
    disco: 'IKEDC & EKEDC',
    discoFullName: 'Ikeja Electric & Eko Electricity Distribution Company',
    center: { lat: 6.5244, lng: 3.3792 },
    zoom: 11,
    substations: [
      { name: 'Ikeja West Transmission Substation', voltage: '330/132kV', capacityMva: 1200, location: 'Ayobo-Ipaja', isNationalHub: true },
      { name: 'Egbin Thermal Power Switchyard', voltage: '330kV', capacityMva: 1320, location: 'Ikorodu', isNationalHub: true },
      { name: 'Akoka 132/33kV Substation', voltage: '132kV', location: 'Akoka, Yaba' },
      { name: 'Alagbon 132/33kV Transmission Station', voltage: '132kV', location: 'Ikoyi Island' },
      { name: 'Lekki 132/33kV Gas Insulated Substation', voltage: '132kV', location: 'Lekki Phase 1' }
    ],
    gridInjectionPoints: [
      'Ikeja West - Isolo 33kV Feeders',
      'Egbin - Ikorodu Industrial Injection Point',
      'Alagbon - Victoria Island Sub-transmission Links',
      'Akoka - Lagos Mainland Urban Grid Network'
    ],
    powerPlants: ['Egbin Power Station (1,320 MW)', 'Paras Energy (IPP)', 'AES Barge'],
    gridCoverageSummary: 'Highest power consumption center in Nigeria. Interconnected by dual 330kV rings from Egbin thermal station and Ikeja West hub.'
  },
  {
    id: 'ogun',
    name: 'Ogun',
    capital: 'Abeokuta',
    zone: 'South-West',
    disco: 'IBEDC & IKEDC',
    discoFullName: 'Ibadan Disco & Ikeja Electric (Border Areas)',
    center: { lat: 7.1475, lng: 3.3619 },
    zoom: 11,
    substations: [
      { name: 'Kobape (Abeokuta) 132/33kV Substation', voltage: '132kV', location: 'Kobape, Abeokuta' },
      { name: 'Ota Industrial 132/33kV Substation', voltage: '132kV', location: 'Ota Industrial Estate' },
      { name: 'Sagamu 132/33kV Substation', voltage: '132kV', location: 'Sagamu Interchange' },
      { name: 'Ogijo 132/33kV Substation', voltage: '132kV', location: 'Ogijo, Ikorodu Border' }
    ],
    gridInjectionPoints: [
      'Ota Industrial Feeders (Pharma & Manufacturing Corridors)',
      'Sagamu Interchange 33kV Feeders',
      'Abeokuta Urban Feeders (Asero, Oke-Mosan)'
    ],
    powerPlants: ['Olorunsogo NIPP Phase I & II (750 MW Combined Cycle)'],
    gridCoverageSummary: 'Major manufacturing corridor receiving high-voltage feeds from Olorunsogo Power Station and Ikeja West.'
  },
  {
    id: 'oyo',
    name: 'Oyo',
    capital: 'Ibadan',
    zone: 'South-West',
    disco: 'IBEDC',
    discoFullName: 'Ibadan Electricity Distribution Company',
    center: { lat: 7.3775, lng: 3.9470 },
    zoom: 11,
    substations: [
      { name: 'Ayede 330/132kV Transmission Station', voltage: '330/132kV', capacityMva: 600, location: 'Ayede, Ibadan', isNationalHub: true },
      { name: 'Jericho 132/33kV Substation', voltage: '132kV', location: 'Jericho, Ibadan' },
      { name: 'Oyo Town 132/33kV Substation', voltage: '132kV', location: 'Oyo Town' },
      { name: 'Ogbomoso 132/33kV Substation', voltage: '132kV', location: 'Ogbomoso North' }
    ],
    gridInjectionPoints: [
      'Ayede - Dugbe Commercial 33kV Circuit',
      'Jericho - University of Ibadan Distribution Line',
      'Iwo Road Distribution Hub'
    ],
    gridCoverageSummary: 'Primary nodal switching hub for South-West Nigeria, routing power between Osogbo NCC and Lagos industrial clusters.'
  },
  {
    id: 'osun',
    name: 'Osun',
    capital: 'Osogbo',
    zone: 'South-West',
    disco: 'IBEDC',
    discoFullName: 'Ibadan Electricity Distribution Company',
    center: { lat: 7.7827, lng: 4.5418 },
    zoom: 11,
    substations: [
      { name: 'Osogbo National Control Centre (NCC)', voltage: '330/132kV', capacityMva: 900, location: 'Osogbo City', isNationalHub: true },
      { name: 'Ilesa 132/33kV Transmission Station', voltage: '132kV', location: 'Ilesa' },
      { name: 'Ede 132/33kV Substation', voltage: '132kV', location: 'Ede' }
    ],
    gridInjectionPoints: [
      'National Control Centre 330kV National Grid Intertie',
      'Osogbo - Ife 33kV Inter-state Line',
      'Ilesa Commercial Feeder Circuit'
    ],
    gridCoverageSummary: 'Hosts Nigeria’s National Control Centre (NCC), governing grid frequency, dispatch switching, and nationwide load-shedding commands.'
  },
  {
    id: 'ondo',
    name: 'Ondo',
    capital: 'Akure',
    zone: 'South-West',
    disco: 'BEDC',
    discoFullName: 'Benin Electricity Distribution Company',
    center: { lat: 7.2571, lng: 5.2058 },
    zoom: 11,
    substations: [
      { name: 'Akure 132/33kV Transmission Station', voltage: '132kV', location: 'Akure Town' },
      { name: 'Omotosho 330kV Generation Switchyard', voltage: '330kV', location: 'Omotosho', isNationalHub: true },
      { name: 'Ondo Town 132/33kV Substation', voltage: '132kV', location: 'Ondo Town' }
    ],
    gridInjectionPoints: [
      'Omotosho - Benin 330kV Double-Circuit Link',
      'Akure - Owo 33kV Distribution Feeder',
      'Ore Commercial Hub Interface'
    ],
    powerPlants: ['Omotosho Gas Power Station (512 MW)', 'Omotosho NIPP (450 MW)'],
    gridCoverageSummary: 'Strategic coastal energy supplier with large-scale thermal generation at Omotosho feeding the 330kV national spine.'
  },
  {
    id: 'ekiti',
    name: 'Ekiti',
    capital: 'Ado-Ekiti',
    zone: 'South-West',
    disco: 'BEDC',
    discoFullName: 'Benin Electricity Distribution Company',
    center: { lat: 7.6210, lng: 5.2215 },
    zoom: 11,
    substations: [
      { name: 'Omisanjana 132/33kV Transmission Substation', voltage: '132kV', location: 'Ado-Ekiti' },
      { name: 'Ikole-Ekiti 132/33kV Transmission Station', voltage: '132kV', location: 'Ikole-Ekiti' }
    ],
    gridInjectionPoints: [
      'Omisanjana - Ado Central 33kV Circuit',
      'Ijero / Aramoko Rural Feeder Injection',
      'Ikole Agro-Industrial Feeders'
    ],
    gridCoverageSummary: 'Connected to the Osogbo-Akure transmission corridor via the upgraded 132kV Omisanjana dual-transformer bay.'
  },

  // -------------------------------------------------------------
  // SOUTH-SOUTH (6 States)
  // -------------------------------------------------------------
  {
    id: 'rivers',
    name: 'Rivers',
    capital: 'Port Harcourt',
    zone: 'South-South',
    disco: 'PHEDC',
    discoFullName: 'Port Harcourt Electricity Distribution Company',
    center: { lat: 4.8156, lng: 7.0498 },
    zoom: 11,
    substations: [
      { name: 'Afam 330/132kV Power Hub & Switchyard', voltage: '330/132kV', capacityMva: 1500, location: 'Afam, Oyigbo', isNationalHub: true },
      { name: 'Port Harcourt Mains (Town) 132/33kV Station', voltage: '132kV', location: 'Trans-Amadi Industrial' },
      { name: 'Oginigba 132/33kV Substation', voltage: '132kV', location: 'Port Harcourt' },
      { name: 'Ahoada 132/33kV Substation', voltage: '132kV', location: 'Ahoada' }
    ],
    gridInjectionPoints: [
      'Trans-Amadi Industrial 33kV Ring',
      'Afam - Alaoji 330kV Interconnector',
      'Onne Free Zone Energy Injection Corridor'
    ],
    powerPlants: ['Afam I - V Gas Turbine (700 MW)', 'Afam Fast Power (240 MW)', 'Rivers State IPP Trans-Amadi'],
    gridCoverageSummary: 'Critical national generation cornerstone with colossal gas turbine installations transmitting power across the Niger Delta and South-East.'
  },
  {
    id: 'delta',
    name: 'Delta',
    capital: 'Asaba',
    zone: 'South-South',
    disco: 'BEDC',
    discoFullName: 'Benin Electricity Distribution Company',
    center: { lat: 5.5325, lng: 5.8987 },
    zoom: 11,
    substations: [
      { name: 'Ughelli (Delta IV) 330/132kV Switchyard', voltage: '330/132kV', capacityMva: 1000, location: 'Ughelli', isNationalHub: true },
      { name: 'Effurun (Warri) 132/33kV Transmission Station', voltage: '132kV', location: 'Warri/Effurun' },
      { name: 'Asaba 132/33kV Substation', voltage: '132kV', location: 'Asaba Capital' },
      { name: 'Sapele 330kV Substation', voltage: '330kV', location: 'Sapele' }
    ],
    gridInjectionPoints: [
      'Effurun - Warri Refinery 33kV Injection Feeder',
      'Asaba Capital Feeder (Government House / Commercial)',
      'Ughelli - Sapele 330kV Primary Arterial'
    ],
    powerPlants: ['Delta Power Station Ughelli (900 MW)', 'Sapele Power Station (1,020 MW)'],
    gridCoverageSummary: 'Major gas-fired electrical hub housing massive generation complexes at Ughelli and Sapele directly tied to the 330kV grid.'
  },
  {
    id: 'edo',
    name: 'Edo',
    capital: 'Benin City',
    zone: 'South-South',
    disco: 'BEDC',
    discoFullName: 'Benin Electricity Distribution Company',
    center: { lat: 6.3350, lng: 5.6037 },
    zoom: 11,
    substations: [
      { name: 'Benin Main (Amukpe) 330/132kV Substation', voltage: '330/132kV', capacityMva: 900, location: 'Benin City', isNationalHub: true },
      { name: 'Azura-Edo (Ihovbor) 330kV Switchyard', voltage: '330kV', capacityMva: 461, location: 'Ihovbor', isNationalHub: true },
      { name: 'Irrua 132/33kV Transmission Station', voltage: '132kV', location: 'Irrua' }
    ],
    gridInjectionPoints: [
      'Benin - Oshogbo 330kV Backbone',
      'Benin - Onitsha 330kV River Niger Crossing',
      'Ihovbor - Benin Ring Feeder'
    ],
    powerPlants: ['Azura-Edo IPP (461 MW Baseload)', 'Ihovbor NIPP (450 MW)'],
    gridCoverageSummary: 'The geographic and electrical heart of Southern Nigeria, anchoring the critical 330kV crossing over the River Niger.'
  },
  {
    id: 'akwa_ibom',
    name: 'Akwa Ibom',
    capital: 'Uyo',
    zone: 'South-South',
    disco: 'PHEDC',
    discoFullName: 'Port Harcourt Electricity Distribution Company',
    center: { lat: 5.0377, lng: 7.9128 },
    zoom: 11,
    substations: [
      { name: 'Uyo 132/33kV Transmission Substation', voltage: '132kV', location: 'Uyo Capital' },
      { name: 'Ikot Abasi 132/33kV Substation', voltage: '132kV', location: 'Ikot Abasi' },
      { name: 'Eket 132/33kV Substation', voltage: '132kV', location: 'Eket Coastal Hub' }
    ],
    gridInjectionPoints: [
      'Ibom Power Plant - Ikot Abasi 132kV evacuation line',
      'Uyo Capital 33kV Ring Feeders',
      'Eket Industrial Oil Terminal Feeders'
    ],
    powerPlants: ['Ibom Power Company (191 MW Gas Turbine)'],
    gridCoverageSummary: 'Supplied by Ibom Power Station via the 132kV coastal transmission network connected to the National Grid at Alaoji.'
  },
  {
    id: 'bayelsa',
    name: 'Bayelsa',
    capital: 'Yenagoa',
    zone: 'South-South',
    disco: 'PHEDC',
    discoFullName: 'Port Harcourt Electricity Distribution Company',
    center: { lat: 4.9267, lng: 6.2676 },
    zoom: 11,
    substations: [
      { name: 'Gbarantoru 132/33kV Transmission Station', voltage: '132kV', location: 'Gbarantoru' },
      { name: 'Yenagoa 132/33kV Substation', voltage: '132kV', location: 'Yenagoa' },
      { name: 'Otuoke 132/33kV Substation', voltage: '132kV', location: 'Otuoke' }
    ],
    gridInjectionPoints: [
      'Gbarantoru Gas Plant Feeder Integration',
      'Yenagoa City Central 33kV Injection Station',
      'Swali Industrial Market Feeders'
    ],
    gridCoverageSummary: 'Tapped from the Ahoada-Yenagoa 132kV line, feeding state administrative centers and coastal riverine communities.'
  },
  {
    id: 'cross_river',
    name: 'Cross River',
    capital: 'Calabar',
    zone: 'South-South',
    disco: 'PHEDC',
    discoFullName: 'Port Harcourt Electricity Distribution Company',
    center: { lat: 4.9757, lng: 8.3417 },
    zoom: 11,
    substations: [
      { name: 'Adiabo (Calabar Power) 330/132kV Substation', voltage: '330/132kV', location: 'Adiabo, Calabar', isNationalHub: true },
      { name: 'Calabar EPZ 132/33kV Substation', voltage: '132kV', location: 'Export Processing Zone' },
      { name: 'Ikom 132/33kV Substation', voltage: '132kV', location: 'Ikom Central' }
    ],
    gridInjectionPoints: [
      'Calabar Free Trade Zone 33kV Circuit',
      'Adiabo - Ikot Ekpene 330kV Double Circuit Quad Line',
      'Ikom Cocoa-Agro Feeder Circuit'
    ],
    powerPlants: ['Calabar NIPP Odukpani Power Plant (561 MW)'],
    gridCoverageSummary: 'Anchored by the massive 561 MW Odukpani NIPP generation facility and 330kV line to Ikot Ekpene switching hub.'
  },

  // -------------------------------------------------------------
  // SOUTH-EAST (5 States)
  // -------------------------------------------------------------
  {
    id: 'enugu',
    name: 'Enugu',
    capital: 'Enugu',
    zone: 'South-East',
    disco: 'EEDC',
    discoFullName: 'Enugu Electricity Distribution Company',
    center: { lat: 6.4584, lng: 7.5464 },
    zoom: 11,
    substations: [
      { name: 'New Haven 330/132kV Transmission Station', voltage: '330/132kV', capacityMva: 600, location: 'New Haven, Enugu', isNationalHub: true },
      { name: 'Nsukka 132/33kV Substation', voltage: '132kV', location: 'Nsukka' },
      { name: 'Oji River 132/33kV Historic Power Station', voltage: '132kV', location: 'Oji River' }
    ],
    gridInjectionPoints: [
      'New Haven - Abakaliki 132kV Line Link',
      'Nsukka University Campus Feeder',
      'Emene Industrial Cluster 33kV Line'
    ],
    gridCoverageSummary: 'Headquarters of Enugu Disco and primary transmission hub routing electricity to Ebonyi, Benue, and northern cross-border circuits.'
  },
  {
    id: 'anambra',
    name: 'Anambra',
    capital: 'Awka',
    zone: 'South-East',
    disco: 'EEDC',
    discoFullName: 'Enugu Electricity Distribution Company',
    center: { lat: 6.2209, lng: 7.0722 },
    zoom: 11,
    substations: [
      { name: 'Onitsha 330/132kV Transmission Substation', voltage: '330/132kV', capacityMva: 900, location: 'Onitsha Industrial', isNationalHub: true },
      { name: 'Awka 132/33kV Transmission Station', voltage: '132kV', location: 'Awka Capital' },
      { name: 'Nnewi 132/33kV Industrial Substation', voltage: '132kV', location: 'Nnewi Automotive Hub' }
    ],
    gridInjectionPoints: [
      'Onitsha Main Market & Commercial Feeders',
      'Nnewi Automotive Industrial Line',
      'Awka Government House & Secretariat Feeders'
    ],
    gridCoverageSummary: 'Major commercial load centre fed through the high-capacity Onitsha 330kV station crossing from the Benin/Delta power spine.'
  },
  {
    id: 'abia',
    name: 'Abia',
    capital: 'Umuahia',
    zone: 'South-East',
    disco: 'EEDC & Aba Power',
    discoFullName: 'Enugu Disco & Aba Power Ltd (Geometric Electric Ring)',
    center: { lat: 5.5249, lng: 7.4946 },
    zoom: 11,
    substations: [
      { name: 'Alaoji 330/132kV Super Substation', voltage: '330/132kV', capacityMva: 1200, location: 'Alaoji, Aba', isNationalHub: true },
      { name: 'Osisioma (Geometric) 132/33kV Substation', voltage: '132kV', location: 'Osisioma, Aba' },
      { name: 'Umuahia 132/33kV Transmission Station', voltage: '132kV', location: 'Umuahia' }
    ],
    gridInjectionPoints: [
      'Aba Commercial Manufacturing Ring (Ariaria Feeders)',
      'Alaoji - Port Harcourt 330kV Tie-Line',
      'Umuahia Urban Feeder Injection'
    ],
    powerPlants: ['Geometric Aba Power IPP (188 MW)', 'Alaoji NIPP (450 MW)'],
    gridCoverageSummary: 'Hosts Nigeria’s first integrated islanded utility ring (Aba Geometric Power) alongside the massive TCN Alaoji 330kV supergrid.'
  },
  {
    id: 'imo',
    name: 'Imo',
    capital: 'Owerri',
    zone: 'South-East',
    disco: 'EEDC',
    discoFullName: 'Enugu Electricity Distribution Company',
    center: { lat: 5.4832, lng: 7.0358 },
    zoom: 11,
    substations: [
      { name: 'Egbu (Owerri) 132/33kV Transmission Substation', voltage: '132kV', location: 'Egbu Road, Owerri' },
      { name: 'Egbema 330kV Power Switchyard', voltage: '330kV', location: 'Egbema', isNationalHub: true },
      { name: 'Orlu 132/33kV Substation', voltage: '132kV', location: 'Orlu Town' }
    ],
    gridInjectionPoints: [
      'Egbu - Owerri Municipal 33kV Injection Stations',
      'Orlu Commercial Feeder Line',
      'Egbema Gas Evacuation Corridor'
    ],
    powerPlants: ['Egbema NIPP Power Station (338 MW under development)'],
    gridCoverageSummary: 'Fed by 132kV double-circuit lines from Alaoji hub, supplying urban Owerri and the Orlu commercial area.'
  },
  {
    id: 'ebonyi',
    name: 'Ebonyi',
    capital: 'Abakaliki',
    zone: 'South-East',
    disco: 'EEDC',
    discoFullName: 'Enugu Electricity Distribution Company',
    center: { lat: 6.3249, lng: 8.1137 },
    zoom: 11,
    substations: [
      { name: 'Abakaliki 132/33kV Transmission Substation', voltage: '132kV', location: 'Abakaliki' },
      { name: 'Afikpo 132/33kV Substation', voltage: '132kV', location: 'Afikpo South' }
    ],
    gridInjectionPoints: [
      'Abakaliki Rice Mill Industrial Feeder',
      'Afikpo Agro-Processing Circuit',
      'Enugu - Abakaliki 132kV Intertie'
    ],
    gridCoverageSummary: 'Supplied directly from New Haven Enugu via the 132kV transmission link powering agricultural processing clusters.'
  },

  // -------------------------------------------------------------
  // NORTH-CENTRAL (6 States + Abuja FCT)
  // -------------------------------------------------------------
  {
    id: 'abuja_fct',
    name: 'Federal Capital Territory',
    capital: 'Abuja',
    zone: 'North-Central',
    disco: 'AEDC',
    discoFullName: 'Abuja Electricity Distribution Company',
    center: { lat: 9.0765, lng: 7.3986 },
    zoom: 11,
    substations: [
      { name: 'Katampe 330/132kV Transmission Substation', voltage: '330/132kV', capacityMva: 600, location: 'Katampe District', isNationalHub: true },
      { name: 'Gwagwalada 330/132kV Transmission Station', voltage: '330/132kV', capacityMva: 600, location: 'Gwagwalada', isNationalHub: true },
      { name: 'Apo 132/33kV Transmission Station', voltage: '132kV', location: 'Apo District' },
      { name: 'Central Area 132/33kV GIS Substation', voltage: '132kV', location: 'Central Business District' },
      { name: 'Kubwa 132/33kV Substation', voltage: '132kV', location: 'Kubwa Suburb' }
    ],
    gridInjectionPoints: [
      'Central Business District 33kV Underground Ring',
      'Apo - Asokoro Government Residential Line',
      'Katampe - Maitama VIP Feeder',
      'Gwagwalada - University Teaching Hospital Dedicated Line'
    ],
    gridCoverageSummary: 'Dual-feed 330kV transmission ring from Shiroro and Ajaokuta with underground GIS distribution protecting critical government infrastructure.'
  },
  {
    id: 'niger',
    name: 'Niger',
    capital: 'Minna',
    zone: 'North-Central',
    disco: 'AEDC',
    discoFullName: 'Abuja Electricity Distribution Company',
    center: { lat: 9.6143, lng: 6.5569 },
    zoom: 11,
    substations: [
      { name: 'Shiroro Hydro 330kV Generation Switchyard', voltage: '330kV', capacityMva: 600, location: 'Shiroro Dam', isNationalHub: true },
      { name: 'Kainji Hydro 330kV Switchyard', voltage: '330kV', capacityMva: 760, location: 'New Bussa', isNationalHub: true },
      { name: 'Jebba Hydro 330kV Switchyard', voltage: '330kV', capacityMva: 578, location: 'Jebba', isNationalHub: true },
      { name: 'Zungeru Hydro 330kV Switchyard', voltage: '330kV', capacityMva: 700, location: 'Zungeru', isNationalHub: true },
      { name: 'Minna 132/33kV Transmission Station', voltage: '132kV', location: 'Minna Capital' }
    ],
    gridInjectionPoints: [
      'Shiroro - Abuja 330kV Double-Circuit Corridor',
      'Jebba - Osogbo 330kV Major Interconnection',
      'Minna Central 33kV Injection Feeder'
    ],
    powerPlants: ['Kainji Hydro (760 MW)', 'Jebba Hydro (578 MW)', 'Shiroro Hydro (600 MW)', 'Zungeru Hydro (700 MW)'],
    gridCoverageSummary: 'The undisputed "Powerhouse of Nigeria", housing four massive hydro dams generating over 2,600 MW of renewable base power.'
  },
  {
    id: 'kogi',
    name: 'Kogi',
    capital: 'Lokoja',
    zone: 'North-Central',
    disco: 'AEDC',
    discoFullName: 'Abuja Electricity Distribution Company',
    center: { lat: 7.7969, lng: 6.7408 },
    zoom: 11,
    substations: [
      { name: 'Ajaokuta 330/132kV Transmission Superstation', voltage: '330/132kV', capacityMva: 900, location: 'Ajaokuta Steel Complex', isNationalHub: true },
      { name: 'Lokoja 132/33kV Transmission Station', voltage: '132kV', location: 'Lokoja Capital' },
      { name: 'Obajana 132/33kV Industrial Substation', voltage: '132kV', location: 'Obajana Cement Complex' }
    ],
    gridInjectionPoints: [
      'Ajaokuta - Gwagwalada (Abuja) 330kV Transmission Link',
      'Ajaokuta - Benin 330kV Intertie',
      'Obajana Heavy Industrial Feeder'
    ],
    powerPlants: ['Geregu I Thermal (414 MW)', 'Geregu II NIPP (434 MW)'],
    gridCoverageSummary: 'Crucial generation and transit junction at the confluence of Rivers Niger and Benue, linking Geregu Gas Station to Abuja.'
  },
  {
    id: 'benue',
    name: 'Benue',
    capital: 'Makurdi',
    zone: 'North-Central',
    disco: 'JEDC',
    discoFullName: 'Jos Electricity Distribution Company',
    center: { lat: 7.7322, lng: 8.5214 },
    zoom: 11,
    substations: [
      { name: 'Makurdi 330/132kV Transmission Station', voltage: '330/132kV', capacityMva: 300, location: 'Makurdi', isNationalHub: true },
      { name: 'Otukpo 132/33kV Substation', voltage: '132kV', location: 'Otukpo' },
      { name: 'Gboko 132/33kV Substation', voltage: '132kV', location: 'Gboko Cement Corridor' }
    ],
    gridInjectionPoints: [
      'Makurdi - Jos 330kV Line Interconnection',
      'Yandev (Gboko) Cement Industrial 33kV Line',
      'Otukpo - Enugu Inter-state Feeder'
    ],
    gridCoverageSummary: 'Ties the South-East supergrid to North-Central Nigeria via the Makurdi 330kV high-voltage transit link.'
  },
  {
    id: 'plateau',
    name: 'Plateau',
    capital: 'Jos',
    zone: 'North-Central',
    disco: 'JEDC',
    discoFullName: 'Jos Electricity Distribution Company',
    center: { lat: 9.8965, lng: 8.8583 },
    zoom: 11,
    substations: [
      { name: 'Makeri (Jos) 330/132kV Transmission Station', voltage: '330/132kV', capacityMva: 450, location: 'Makeri, Jos', isNationalHub: true },
      { name: 'Bukuru 132/33kV Substation', voltage: '132kV', location: 'Bukuru' },
      { name: 'Pankshin 132/33kV Substation', voltage: '132kV', location: 'Pankshin' }
    ],
    gridInjectionPoints: [
      'Jos - Gombe 330kV North-East Arterial Line',
      'Bukuru Industrial Mining Feeders',
      'Jos Central Commercial 33kV Ring'
    ],
    powerPlants: ['NESCO Hydro Stations (Privatized Mini-Hydros)'],
    gridCoverageSummary: 'Headquarters of Jos Disco and key jumping point for the single-circuit 330kV link extending power into North-East Nigeria.'
  },
  {
    id: 'kwara',
    name: 'Kwara',
    capital: 'Ilorin',
    zone: 'North-Central',
    disco: 'IBEDC',
    discoFullName: 'Ibadan Electricity Distribution Company',
    center: { lat: 8.4966, lng: 4.5421 },
    zoom: 11,
    substations: [
      { name: 'Ganmo (Ilorin) 330/132kV Transmission Station', voltage: '330/132kV', capacityMva: 600, location: 'Ganmo, Ilorin', isNationalHub: true },
      { name: 'Jebba Paper Mill 132/33kV Substation', voltage: '132kV', location: 'Jebba' },
      { name: 'Omu-Aran 132/33kV Substation', voltage: '132kV', location: 'Omu-Aran' }
    ],
    gridInjectionPoints: [
      'Ganmo - Osogbo 330kV Primary Intertie',
      'Ilorin University Teaching Hospital 33kV Line',
      'Omu-Aran Agro-allied Feeder'
    ],
    gridCoverageSummary: 'Directly fed from the Jebba Hydro complex and Osogbo national control corridor via the Ganmo 330kV transformation center.'
  },
  {
    id: 'nasarawa',
    name: 'Nasarawa',
    capital: 'Lafia',
    zone: 'North-Central',
    disco: 'AEDC',
    discoFullName: 'Abuja Electricity Distribution Company',
    center: { lat: 8.4998, lng: 8.5153 },
    zoom: 11,
    substations: [
      { name: 'Lafia 330/132/33kV Transmission Substation', voltage: '330/132kV', capacityMva: 330, location: 'Lafia Capital', isNationalHub: true },
      { name: 'Akwanga 132/33kV Substation', voltage: '132kV', location: 'Akwanga' },
      { name: 'Keffi 132/33kV Substation', voltage: '132kV', location: 'Keffi' }
    ],
    gridInjectionPoints: [
      'Lafia - Makurdi 330kV Intertie Line',
      'Karu - Mararaba Abuja Suburb Feeder Link',
      'Keffi University Feeder Circuit'
    ],
    gridCoverageSummary: 'Enhanced by the newly commissioned 330/132/33kV Lafia Substation, terminating reliance on weak radial feeds from Akwanga.'
  },

  // -------------------------------------------------------------
  // NORTH-WEST (7 States)
  // -------------------------------------------------------------
  {
    id: 'kano',
    name: 'Kano',
    capital: 'Kano',
    zone: 'North-West',
    disco: 'KEDCO',
    discoFullName: 'Kano Electricity Distribution Company',
    center: { lat: 12.0022, lng: 8.5920 },
    zoom: 11,
    substations: [
      { name: 'Kumbotso (Kano Main) 330/132kV Station', voltage: '330/132kV', capacityMva: 900, location: 'Kumbotso, Kano', isNationalHub: true },
      { name: 'Dakata 132/33kV Industrial Substation', voltage: '132kV', location: 'Bompai Industrial Area' },
      { name: 'Dan Agundi 132/33kV Transmission Station', voltage: '132kV', location: 'Kano Municipal' },
      { name: 'Challawa 132/33kV Substation', voltage: '132kV', location: 'Challawa Industrial Estate' }
    ],
    gridInjectionPoints: [
      'Bompai Industrial 33kV Feeders (Textiles & Food processing)',
      'Challawa Industrial Feeder Line',
      'Kano - Katsina 132kV Inter-state Line',
      'Dan Agundi City Center Feeder'
    ],
    powerPlants: ['Tiga Hydro Mini-station (10 MW)', 'Challawa Gorge Hydro (under development)'],
    gridCoverageSummary: 'The commercial hub of Northern Nigeria, supplied through double-circuit 330kV lines running from Kaduna to Kumbotso superstation.'
  },
  {
    id: 'kaduna',
    name: 'Kaduna',
    capital: 'Kaduna',
    zone: 'North-West',
    disco: 'KAEDCO',
    discoFullName: 'Kaduna Electricity Distribution Company',
    center: { lat: 10.5105, lng: 7.4165 },
    zoom: 11,
    substations: [
      { name: 'Mando (Kaduna Town) 330/132kV Substation', voltage: '330/132kV', capacityMva: 900, location: 'Mando, Kaduna', isNationalHub: true },
      { name: 'Kakuri 132/33kV Industrial Substation', voltage: '132kV', location: 'Kakuri Textiles Hub' },
      { name: 'Zaria 132/33kV Transmission Station', voltage: '132kV', location: 'Zaria' }
    ],
    gridInjectionPoints: [
      'Kaduna - Kano 330kV Heavy Backbone',
      'Kakuri Industrial 33kV Dedicated Line',
      'Zaria Academic (ABU) & Urban Feeder'
    ],
    powerPlants: ['Kudenda Dual Fuel Plant (215 MW)', 'Gurara Hydro IPP (30 MW)'],
    gridCoverageSummary: 'Critical switching crossroad linking Shiroro Hydro in Niger State to Kano and the north-western frontiers.'
  },
  {
    id: 'katsina',
    name: 'Katsina',
    capital: 'Katsina',
    zone: 'North-West',
    disco: 'KEDCO',
    discoFullName: 'Kano Electricity Distribution Company',
    center: { lat: 12.9908, lng: 7.6018 },
    zoom: 11,
    substations: [
      { name: 'Kankia 330/132kV Transmission Station', voltage: '330/132kV', location: 'Kankia', isNationalHub: true },
      { name: 'Katsina 132/33kV Substation', voltage: '132kV', location: 'Katsina City' },
      { name: 'Funtua 132/33kV Substation', voltage: '132kV', location: 'Funtua Cotton Belt' },
      { name: 'Daura 132/33kV Substation', voltage: '132kV', location: 'Daura' }
    ],
    gridInjectionPoints: [
      'Kankia 330kV Regional Switching Hub',
      'Funtua Ginnery 33kV Industrial Feeders',
      'Katsina Urban Water Works Dedicated Line'
    ],
    powerPlants: ['Rimi Wind Farm (10 MW)'],
    gridCoverageSummary: 'Fed from the Kankia 330kV hub, channeling power north toward border transit lines with Niger Republic.'
  },
  {
    id: 'sokoto',
    name: 'Sokoto',
    capital: 'Sokoto',
    zone: 'North-West',
    disco: 'KAEDCO',
    discoFullName: 'Kaduna Electricity Distribution Company',
    center: { lat: 13.0609, lng: 5.2390 },
    zoom: 11,
    substations: [
      { name: 'Sokoto 132/33kV Transmission Substation', voltage: '132kV', location: 'Sokoto City' },
      { name: 'Goronyo 132/33kV Substation', voltage: '132kV', location: 'Goronyo Dam Axis' },
      { name: 'Bodinga 132/33kV Substation', voltage: '132kV', location: 'Bodinga' }
    ],
    gridInjectionPoints: [
      'Sokoto Cement Industrial 33kV Feeders (BUA Cement)',
      'Sokoto Water Works Feeder',
      'Birnin Kebbi - Sokoto 132kV Transit'
    ],
    gridCoverageSummary: 'Tapped from the Birnin Kebbi international 330kV terminal via the 132kV twin-line powering cement industrial facilities.'
  },
  {
    id: 'kebbi',
    name: 'Kebbi',
    capital: 'Birnin Kebbi',
    zone: 'North-West',
    disco: 'KAEDCO',
    discoFullName: 'Kaduna Electricity Distribution Company',
    center: { lat: 12.4539, lng: 4.1975 },
    zoom: 11,
    substations: [
      { name: 'Birnin Kebbi 330/132kV Super Substation', voltage: '330/132kV', capacityMva: 600, location: 'Birnin Kebbi', isNationalHub: true },
      { name: 'Yauri 132/33kV Transmission Station', voltage: '132kV', location: 'Yauri' }
    ],
    gridInjectionPoints: [
      'Kainji - Birnin Kebbi 330kV International Intertie Line',
      'Birnin Kebbi - Niamey (Niger Republic) 132kV Intertie',
      'Argungu Agricultural 33kV Feeder'
    ],
    gridCoverageSummary: 'Strategic cross-border terminal evacuating power from Kainji Dam and exporting electricity to Niger Republic under WAPP agreements.'
  },
  {
    id: 'zamfara',
    name: 'Zamfara',
    capital: 'Gusau',
    zone: 'North-West',
    disco: 'KAEDCO',
    discoFullName: 'Kaduna Electricity Distribution Company',
    center: { lat: 12.1628, lng: 6.6613 },
    zoom: 11,
    substations: [
      { name: 'Gusau 132/33kV Transmission Substation', voltage: '132kV', location: 'Gusau Capital' },
      { name: 'Talata Mafara 132/33kV Substation', voltage: '132kV', location: 'Talata Mafara' }
    ],
    gridInjectionPoints: [
      'Funtua - Gusau 132kV Line Interface',
      'Bakolori Irrigation 33kV Pumping Line',
      'Gusau Central Commercial Feeder'
    ],
    gridCoverageSummary: 'Powered via the Funtua-Gusau 132kV radial line supporting state administrative and agricultural irrigation complexes.'
  },
  {
    id: 'jigawa',
    name: 'Jigawa',
    capital: 'Dutse',
    zone: 'North-West',
    disco: 'KEDCO',
    discoFullName: 'Kano Electricity Distribution Company',
    center: { lat: 11.7583, lng: 9.3389 },
    zoom: 11,
    substations: [
      { name: 'Dutse 132/33kV Transmission Substation', voltage: '132kV', location: 'Dutse Capital' },
      { name: 'Hadejia 132/33kV Substation', voltage: '132kV', location: 'Hadejia' },
      { name: 'Gumel 132/33kV Substation', voltage: '132kV', location: 'Gumel' }
    ],
    gridInjectionPoints: [
      'Kano - Dutse 132kV Transmission Extension',
      'Hadejia Valley Irrigation Feeder',
      'Dutse International Airport Dedicated 33kV Line'
    ],
    gridCoverageSummary: 'Radiated from Kano (Dakata/Kumbotso) via a 132kV line terminating at Dutse with spur lines to Gumel and Hadejia.'
  },

  // -------------------------------------------------------------
  // NORTH-EAST (6 States)
  // -------------------------------------------------------------
  {
    id: 'borno',
    name: 'Borno',
    capital: 'Maiduguri',
    zone: 'North-East',
    disco: 'YEDC',
    discoFullName: 'Yola Electricity Distribution Company',
    center: { lat: 11.8311, lng: 13.1510 },
    zoom: 11,
    substations: [
      { name: 'Maiduguri 330/132kV Transmission Station', voltage: '330/132kV', capacityMva: 300, location: 'Maiduguri City', isNationalHub: true },
      { name: 'Damboa 132/33kV Substation', voltage: '132kV', location: 'Damboa' },
      { name: 'Baga Road 132/33kV Substation', voltage: '132kV', location: 'Baga Road, Maiduguri' }
    ],
    gridInjectionPoints: [
      'Damaturu - Maiduguri 330kV Line Corridor',
      'Maiduguri Emergency Power Plant (MEPP) 50MW Grid Link',
      'University of Maiduguri Teaching Hospital Dedicated 33kV'
    ],
    powerPlants: ['Maiduguri Emergency Gas Power Plant (50 MW)'],
    gridCoverageSummary: 'Fortified by the newly built 50MW gas plant and 330kV reinforced towers extending from Damaturu superstation.'
  },
  {
    id: 'bauchi',
    name: 'Bauchi',
    capital: 'Bauchi',
    zone: 'North-East',
    disco: 'YEDC',
    discoFullName: 'Yola Electricity Distribution Company',
    center: { lat: 10.3158, lng: 9.8442 },
    zoom: 11,
    substations: [
      { name: 'Bauchi 132/33kV Transmission Substation', voltage: '132kV', location: 'Bauchi Town' },
      { name: 'Azare 132/33kV Substation', voltage: '132kV', location: 'Azare North' },
      { name: 'Misau 132/33kV Substation', voltage: '132kV', location: 'Misau' }
    ],
    gridInjectionPoints: [
      'Jos - Bauchi - Gombe 132kV East-West Line',
      'Bauchi Industrial Estate 33kV Feeders',
      'Azare Agro-Commercial Line'
    ],
    gridCoverageSummary: 'Key transit state linking the Plateau highlands to Gombe and the Lake Chad basin via high-voltage 132kV paths.'
  },
  {
    id: 'adamawa',
    name: 'Adamawa',
    capital: 'Yola',
    zone: 'North-East',
    disco: 'YEDC',
    discoFullName: 'Yola Electricity Distribution Company',
    center: { lat: 9.2094, lng: 12.4818 },
    zoom: 11,
    substations: [
      { name: 'Yola 330/132kV Transmission Station', voltage: '330/132kV', capacityMva: 300, location: 'Yola Capital', isNationalHub: true },
      { name: 'Mubi 132/33kV Substation', voltage: '132kV', location: 'Mubi Commercial' },
      { name: 'Numan 132/33kV Substation', voltage: '132kV', location: 'Numan Sugar Belt' }
    ],
    gridInjectionPoints: [
      'Gombe - Yola 330kV Transmission Backbone',
      'Numan Savannah Sugar 33kV Feeder',
      'Mubi International Border Commercial Feeder'
    ],
    gridCoverageSummary: 'Headquarters of Yola Disco, receiving 330kV bulk energy from Gombe to feed the upper Benue valley.'
  },
  {
    id: 'gombe',
    name: 'Gombe',
    capital: 'Gombe',
    zone: 'North-East',
    disco: 'YEDC',
    discoFullName: 'Yola Electricity Distribution Company',
    center: { lat: 10.2897, lng: 11.1673 },
    zoom: 11,
    substations: [
      { name: 'Gombe 330/132kV Regional Transmission Hub', voltage: '330/132kV', capacityMva: 600, location: 'Gombe City', isNationalHub: true },
      { name: 'Dadinkowa 132kV Hydro Station', voltage: '132kV', location: 'Dadinkowa Dam' },
      { name: 'Ashaka 132/33kV Industrial Substation', voltage: '132kV', location: 'Ashaka Cement' }
    ],
    gridInjectionPoints: [
      'Dadinkowa Hydro 40MW Evacuation Feeders',
      'Ashaka Cement Heavy Industrial Feeder',
      'Gombe - Damaturu - Maiduguri 330kV Link'
    ],
    powerPlants: ['Dadinkowa Hydro Power Plant (40 MW)'],
    gridCoverageSummary: 'The operational and dispatch focal point of the North-East, boasting the Dadinkowa Hydro power facility.'
  },
  {
    id: 'taraba',
    name: 'Taraba',
    capital: 'Jalingo',
    zone: 'North-East',
    disco: 'YEDC',
    discoFullName: 'Yola Electricity Distribution Company',
    center: { lat: 8.8937, lng: 11.3596 },
    zoom: 11,
    substations: [
      { name: 'Jalingo 132/33kV Transmission Substation', voltage: '132kV', location: 'Jalingo Capital' },
      { name: 'Kashimbila 132kV Hydro Evacuation Station', voltage: '132kV', location: 'Kashimbila' },
      { name: 'Wukari 132/33kV Substation', voltage: '132kV', location: 'Wukari South' }
    ],
    gridInjectionPoints: [
      'Kashimbila 40MW Hydro Evacuation Circuit',
      'Jalingo - Yola 132kV Interconnector',
      'Wukari - Takum 33kV Rural Electrification Feeder'
    ],
    powerPlants: ['Kashimbila Multi-Purpose Dam (40 MW Hydro)'],
    gridCoverageSummary: 'Powered by the clean Kashimbila 40MW hydro station and 132kV lines connecting to Yola and Benue.'
  },
  {
    id: 'yobe',
    name: 'Yobe',
    capital: 'Damaturu',
    zone: 'North-East',
    disco: 'YEDC',
    discoFullName: 'Yola Electricity Distribution Company',
    center: { lat: 11.7470, lng: 11.9660 },
    zoom: 11,
    substations: [
      { name: 'Damaturu 330/132kV Transmission Station', voltage: '330/132kV', capacityMva: 300, location: 'Damaturu Capital', isNationalHub: true },
      { name: 'Potiskum 132/33kV Substation', voltage: '132kV', location: 'Potiskum Cattle Market' },
      { name: 'Gashua 132/33kV Substation', voltage: '132kV', location: 'Gashua' }
    ],
    gridInjectionPoints: [
      'Gombe - Damaturu 330kV Core Spine',
      'Potiskum Transport & Grain Hub 33kV Feeder',
      'Damaturu - Maiduguri 330kV Intertie'
    ],
    gridCoverageSummary: 'Vital 330kV transmission corridor linking Gombe to Borno State, supplying Potiskum commercial trading axis.'
  }
];
