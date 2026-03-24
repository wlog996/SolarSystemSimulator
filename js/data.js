/* Solar System — Data Module
   Constants, orbital data, and planet info database. */
const SS = window.SS = {};

/* ══════ constants ══════ */
SS.DEG = Math.PI / 180;
SS.TWO_PI = Math.PI * 2;
SS.WORLD_SCALE = 55;
SS.MIN_OFFSET = 2;
SS.LOG_41 = Math.log(41);
SS.AU_KM = 149597870.7;
SS.GM_SUN = 1.32712440018e11; // km³/s² (heliocentric gravitational parameter)

/* ══════ time ══════ */
SS.startDate = new Date();
SS.J2000 = new Date(Date.UTC(2000, 0, 1, 12, 0, 0));
SS.daysSinceJ2000 = (SS.startDate - SS.J2000) / 86400000;

/* ══════ planet data (with orbital inclination i, ascending node Om) ══════ */
SS.PDATA = [
  {name:'Mercury', a:0.387, e:0.206, T:87.969,   rotH:1407.5,  R:0.383, col:0x9e9e9e, L0:252.251, w:77.456,  i:7.005,  Om:48.331,  tilt:0.034},
  {name:'Venus',   a:0.723, e:0.007, T:224.701,  rotH:5832.5,  R:0.949, col:0xe0c38b, L0:181.980, w:131.564, i:3.395,  Om:76.680,  tilt:177.4},
  {name:'Earth',   a:1.000, e:0.017, T:365.256,  rotH:23.934,  R:1.0,   col:0x4aa3ff, L0:100.464, w:102.937, i:0.000,  Om:174.873, tilt:23.44,
    moons:[{name:'Moon', e:0.055, T:27.322, R:0.273, col:0xddd6cc, dist:60.3}]},
  {name:'Mars',    a:1.524, e:0.093, T:686.980,  rotH:24.623,  R:0.532, col:0xd46b3a, L0:355.453, w:336.060, i:1.850,  Om:49.558,  tilt:25.19,
    moons:[
      {name:'Phobos', e:0.015, T:0.319,  R:0.0017, col:0x8a7e6e, dist:2.76},
      {name:'Deimos', e:0.0002,T:1.263,  R:0.001,  col:0x9a9080, dist:6.91},
    ]},
  {name:'Jupiter', a:5.203, e:0.049, T:4332.589, rotH:9.925,   R:11.21, col:0xd9b48b, L0:34.351,  w:14.331,  i:1.303,  Om:100.464, tilt:3.13,
    moons:[
      {name:'Io',       e:0.004, T:1.769,  R:0.286, col:0xe8d84a, dist:5.9},
      {name:'Europa',   e:0.009, T:3.551,  R:0.245, col:0xc4bfaa, dist:9.4},
      {name:'Ganymede', e:0.001, T:7.155,  R:0.413, col:0xa89f8f, dist:15.0},
      {name:'Callisto', e:0.007, T:16.689, R:0.378, col:0x6e6050, dist:26.3},
    ]},
  {name:'Saturn',  a:9.537, e:0.054, T:10759.22, rotH:10.656,  R:9.45,  col:0xf0e5c7, L0:49.944,  w:93.057,  i:2.489,  Om:113.665, tilt:26.73,
    moons:[
      {name:'Mimas',    e:0.020, T:0.942,  R:0.031, col:0xc0c0c0, dist:3.08},
      {name:'Enceladus',e:0.005, T:1.370,  R:0.040, col:0xf0f0ff, dist:3.95},
      {name:'Tethys',   e:0.000, T:1.888,  R:0.083, col:0xd0d0d0, dist:4.89},
      {name:'Dione',    e:0.002, T:2.737,  R:0.088, col:0xc8c8c8, dist:6.26},
      {name:'Rhea',     e:0.001, T:4.518,  R:0.120, col:0xb8b8b8, dist:8.74},
      {name:'Titan',    e:0.029, T:15.945, R:0.404, col:0xd4a84b, dist:20.3},
      {name:'Iapetus',  e:0.029, T:79.322, R:0.115, col:0x806040, dist:59.1},
    ]},
  {name:'Uranus',  a:19.191,e:0.047, T:30685.4,  rotH:17.24,   R:4.01,  col:0x9fe0e8, L0:313.232, w:173.005, i:0.773,  Om:74.006,  tilt:97.77,
    moons:[
      {name:'Miranda', e:0.001, T:1.413,  R:0.037, col:0xb0b0b0, dist:5.08},
      {name:'Ariel',   e:0.001, T:2.520,  R:0.091, col:0xc0c4c8, dist:7.47},
      {name:'Umbriel', e:0.004, T:4.144,  R:0.092, col:0x707070, dist:10.4},
      {name:'Titania', e:0.001, T:8.706,  R:0.124, col:0xc0b8b0, dist:17.1},
      {name:'Oberon',  e:0.001, T:13.463, R:0.119, col:0xa09890, dist:22.8},
    ]},
  {name:'Neptune', a:30.07, e:0.009, T:60190.03, rotH:16.11,   R:3.88,  col:0x3b62d6, L0:304.880, w:48.124,  i:1.770,  Om:131.784, tilt:28.32,
    moons:[
      {name:'Triton',  e:0.000, T:-5.877, R:0.212, col:0xc8b8a8, dist:14.3},
    ]},
  {name:'Pluto',   a:39.48, e:0.250, T:90560,    rotH:153.3,   R:0.187, col:0xbfaea4, L0:238.929, w:224.067, i:17.16,  Om:110.299, tilt:122.53,
    moons:[
      {name:'Charon',  e:0.000, T:6.387,  R:0.095, col:0x909090, dist:16.5},
    ]},
  // dwarf planets
  {name:'Ceres',   a:2.767, e:0.076, T:1681.63,  rotH:9.07,    R:0.074, col:0x8a8a7a, L0:153.83,  w:73.60,   i:10.59,  Om:80.33,  tilt:4, dwarf:true},
  {name:'Eris',    a:67.67, e:0.441, T:203830,   rotH:25.9,    R:0.182, col:0xd0ccc4, L0:204.16,  w:151.43,  i:44.04,  Om:35.87,  tilt:78, dwarf:true},
  {name:'Haumea',  a:43.13, e:0.195, T:103410,   rotH:3.92,    R:0.13,  col:0xc8c0b0, L0:283.28,  w:239.18,  i:28.22,  Om:121.79, tilt:126, dwarf:true},
  {name:'Makemake',a:45.79, e:0.159, T:113190,   rotH:22.48,   R:0.11,  col:0xb89878, L0:79.42,   w:297.2,   i:29.00,  Om:79.38,  tilt:29, dwarf:true},
];

/* ══════ planet info database ══════ */
SS.PLANET_INFO = {
  Mercury:{mass:'3.30×10²³ kg',diameter:'4,879 km',gravity:'3.7 m/s²',type:'Terrestrial',day:'58.6 Earth days',moons:0,discovered:'Known since antiquity'},
  Venus:{mass:'4.87×10²⁴ kg',diameter:'12,104 km',gravity:'8.9 m/s²',type:'Terrestrial',day:'243 Earth days',moons:0,discovered:'Known since antiquity',atmo:'CO₂ 96%, N₂ 3.5%'},
  Earth:{mass:'5.97×10²⁴ kg',diameter:'12,756 km',gravity:'9.8 m/s²',type:'Terrestrial',day:'24 h',moons:1,discovered:'—',atmo:'N₂ 78%, O₂ 21%'},
  Mars:{mass:'6.42×10²³ kg',diameter:'6,792 km',gravity:'3.7 m/s²',type:'Terrestrial',day:'24.6 h',moons:2,discovered:'Known since antiquity',atmo:'CO₂ 95%'},
  Jupiter:{mass:'1.90×10²⁷ kg',diameter:'142,984 km',gravity:'24.8 m/s²',type:'Gas giant',day:'9.9 h',moons:95,discovered:'Known since antiquity'},
  Saturn:{mass:'5.68×10²⁶ kg',diameter:'120,536 km',gravity:'10.4 m/s²',type:'Gas giant',day:'10.7 h',moons:146,discovered:'Known since antiquity'},
  Uranus:{mass:'8.68×10²⁵ kg',diameter:'51,118 km',gravity:'8.7 m/s²',type:'Ice giant',day:'17.2 h',moons:28,discovered:'1781 (Herschel)'},
  Neptune:{mass:'1.02×10²⁶ kg',diameter:'49,528 km',gravity:'11.2 m/s²',type:'Ice giant',day:'16.1 h',moons:16,discovered:'1846 (Le Verrier)'},
  Pluto:{mass:'1.30×10²² kg',diameter:'2,377 km',gravity:'0.62 m/s²',type:'Dwarf planet',day:'6.4 Earth days',moons:5,discovered:'1930 (Tombaugh)'},
  Ceres:{mass:'9.39×10²⁰ kg',diameter:'946 km',gravity:'0.28 m/s²',type:'Dwarf planet',day:'9.07 h',moons:0,discovered:'1801 (Piazzi)'},
  Eris:{mass:'1.66×10²² kg',diameter:'2,326 km',gravity:'0.82 m/s²',type:'Dwarf planet',day:'25.9 h',moons:1,discovered:'2005 (Brown)'},
  Haumea:{mass:'4.01×10²¹ kg',diameter:'1,632 km',gravity:'0.63 m/s²',type:'Dwarf planet',day:'3.9 h',moons:2,discovered:'2004 (Brown)'},
  Makemake:{mass:'3.1×10²¹ kg',diameter:'1,430 km',gravity:'0.5 m/s²',type:'Dwarf planet',day:'22.5 h',moons:1,discovered:'2005 (Brown)'},
};

/* ══════ shared mutable state ══════ */
SS.state = {
  simDays: 0,
  running: true,
  lastT: performance.now(),
  daysPerSecond: 1,
  followTarget: '',
  planetScale: 0.55
};
