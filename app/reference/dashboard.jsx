"use client";
import { useState, useMemo } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const DIASPORA_TEAMS = {
  "South Africa": { region:"Africa",    flag:"🇿🇦", note:"Back after 16 years. Opening match nation." },
  "Morocco":      { region:"Africa",    flag:"🇲🇦", note:"2022 semifinalists. Ranked 11th globally." },
  "Senegal":      { region:"Africa",    flag:"🇸🇳", note:"AFCON champions. Ranked 19th globally." },
  "Algeria":      { region:"Africa",    flag:"🇩🇿", note:"Strong squad, tough Group J with Argentina." },
  "Cape Verde":   { region:"Africa",    flag:"🇨🇻", note:"First ever World Cup. Historic debut." },
  "Egypt":        { region:"Africa",    flag:"🇪🇬", note:"North Africa heavyweights return." },
  "Tunisia":      { region:"Africa",    flag:"🇹🇳", note:"Playing the 1,000th WC match ever." },
  "Ivory Coast":  { region:"Africa",    flag:"🇨🇮", note:"Reigning AFCON champions. Loaded squad." },
  "Ghana":        { region:"Africa",    flag:"🇬🇭", note:"Black Stars always show up at World Cups." },
  "DR Congo":     { region:"Africa",    flag:"🇨🇩", note:"JUST QUALIFIED. First WC since 1974. Beat Jamaica in extra time." },
  "Haiti":        { region:"Caribbean", flag:"🇭🇹", note:"First WC appearance. Caribbean pride moment." },
  "Curaçao":      { region:"Caribbean", flag:"🇨🇼", note:"Smallest nation ever to qualify for WC." },
};

const CITY_DIASPORA_NOTES = {
  "Atlanta":               "Largest Black population of any WC host city. HBCU culture, Black entertainment & business hub.",
  "Miami":                 "Major Haitian, Jamaican & Afro-Latino diaspora. Caribbean cultural capital of the US.",
  "Houston":               "Large West African & Nigerian immigrant community. Africa's unofficial US gateway city.",
  "Philadelphia":          "Deep Afro-Caribbean roots. Significant Ghanaian & Senegalese diaspora.",
  "New York / New Jersey": "Largest African & Caribbean diaspora in North America. Massive Senegalese, Ghanaian, Haitian & Jamaican communities.",
  "Boston":                "Growing Haitian diaspora. Cape Verdean community dating back generations.",
  "Toronto":               "Largest Caribbean diaspora outside the Caribbean. Significant Ghanaian & Congolese communities.",
  "Seattle":               "Growing East African community, particularly Ethiopian & Somali.",
  "Los Angeles":           "Pan-African hub. Large Ivorian & North African communities.",
  "Dallas":                "Growing African diaspora, significant Nigerian & Congolese communities.",
  "Kansas City":           "Smaller footprint but growing Somali & West African community.",
  "Vancouver":             "Diverse but smaller African/Caribbean presence.",
  "Mexico City":           "Opening Match — South Africa. Historic Pan-African moment on world stage.",
  "Monterrey":             "Historic 1,000th WC match: Tunisia vs Japan.",
  "Zapopan":               "DR Congo play here. Growing West African student community in Guadalajara region.",
  "San Francisco":         "Bay Area has growing West African tech diaspora community.",
};

const MATCHES = [
  { id:1,  date:"2026-06-11", dow:"Thu", group:"A",   team1:"Mexico",          team2:"South Africa",     time:"3:00 PM",  city:"Mexico City",          venue:"Estadio Azteca",          stage:"Group" },
  { id:2,  date:"2026-06-12", dow:"Fri", group:"A",   team1:"South Korea",     team2:"Czech Republic",   time:"10:00 PM", city:"Zapopan",              venue:"Estadio Akron",           stage:"Group" },
  { id:3,  date:"2026-06-12", dow:"Fri", group:"B",   team1:"Canada",          team2:"Bosnia & Herz.",   time:"3:00 PM",  city:"Toronto",              venue:"BMO Field",               stage:"Group" },
  { id:4,  date:"2026-06-12", dow:"Fri", group:"D",   team1:"USA",             team2:"Paraguay",         time:"9:00 PM",  city:"Los Angeles",          venue:"SoFi Stadium",            stage:"Group" },
  { id:5,  date:"2026-06-13", dow:"Sat", group:"D",   team1:"Australia",       team2:"Turkey",           time:"12:00 AM", city:"Vancouver",            venue:"BC Place",                stage:"Group" },
  { id:6,  date:"2026-06-13", dow:"Sat", group:"B",   team1:"Qatar",           team2:"Switzerland",      time:"3:00 PM",  city:"San Francisco",        venue:"Levi's Stadium",          stage:"Group" },
  { id:7,  date:"2026-06-13", dow:"Sat", group:"C",   team1:"Brazil",          team2:"Morocco",          time:"6:00 PM",  city:"New York / New Jersey",venue:"MetLife Stadium",         stage:"Group" },
  { id:8,  date:"2026-06-13", dow:"Sat", group:"C",   team1:"Haiti",           team2:"Scotland",         time:"9:00 PM",  city:"Boston",               venue:"Gillette Stadium",        stage:"Group" },
  { id:9,  date:"2026-06-14", dow:"Sun", group:"E",   team1:"Germany",         team2:"Curaçao",          time:"1:00 PM",  city:"Houston",              venue:"NRG Stadium",             stage:"Group" },
  { id:10, date:"2026-06-14", dow:"Sun", group:"F",   team1:"Netherlands",     team2:"Japan",            time:"4:00 PM",  city:"Dallas",               venue:"AT&T Stadium",            stage:"Group" },
  { id:11, date:"2026-06-14", dow:"Sun", group:"E",   team1:"Ivory Coast",     team2:"Ecuador",          time:"7:00 PM",  city:"Philadelphia",         venue:"Lincoln Financial Field", stage:"Group" },
  { id:12, date:"2026-06-14", dow:"Sun", group:"F",   team1:"Sweden",          team2:"Tunisia",          time:"10:00 PM", city:"Monterrey",            venue:"Estadio BBVA",            stage:"Group" },
  { id:13, date:"2026-06-15", dow:"Mon", group:"H",   team1:"Spain",           team2:"Cape Verde",       time:"12:00 PM", city:"Atlanta",              venue:"Mercedes-Benz Stadium",   stage:"Group" },
  { id:14, date:"2026-06-15", dow:"Mon", group:"G",   team1:"Belgium",         team2:"Egypt",            time:"3:00 PM",  city:"Seattle",              venue:"Lumen Field",             stage:"Group" },
  { id:15, date:"2026-06-15", dow:"Mon", group:"H",   team1:"Saudi Arabia",    team2:"Uruguay",          time:"6:00 PM",  city:"Miami",                venue:"Hard Rock Stadium",       stage:"Group" },
  { id:16, date:"2026-06-15", dow:"Mon", group:"G",   team1:"Iran",            team2:"New Zealand",      time:"9:00 PM",  city:"Los Angeles",          venue:"SoFi Stadium",            stage:"Group" },
  { id:17, date:"2026-06-16", dow:"Tue", group:"I",   team1:"France",          team2:"Senegal",          time:"3:00 PM",  city:"New York / New Jersey",venue:"MetLife Stadium",         stage:"Group" },
  { id:18, date:"2026-06-16", dow:"Tue", group:"I",   team1:"Iraq",            team2:"Norway",           time:"6:00 PM",  city:"Boston",               venue:"Gillette Stadium",        stage:"Group" },
  { id:19, date:"2026-06-16", dow:"Tue", group:"J",   team1:"Argentina",       team2:"Algeria",          time:"9:00 PM",  city:"Kansas City",          venue:"Arrowhead Stadium",       stage:"Group" },
  { id:20, date:"2026-06-16", dow:"Tue", group:"J",   team1:"Austria",         team2:"Jordan",           time:"12:00 AM", city:"San Francisco",        venue:"Levi's Stadium",          stage:"Group" },
  { id:21, date:"2026-06-17", dow:"Wed", group:"K",   team1:"Portugal",        team2:"DR Congo",         time:"1:00 PM",  city:"Houston",              venue:"NRG Stadium",             stage:"Group" },
  { id:22, date:"2026-06-17", dow:"Wed", group:"L",   team1:"England",         team2:"Croatia",          time:"4:00 PM",  city:"Dallas",               venue:"AT&T Stadium",            stage:"Group" },
  { id:23, date:"2026-06-17", dow:"Wed", group:"L",   team1:"Ghana",           team2:"Panama",           time:"7:00 PM",  city:"Toronto",              venue:"BMO Field",               stage:"Group" },
  { id:24, date:"2026-06-17", dow:"Wed", group:"K",   team1:"Uzbekistan",      team2:"Colombia",         time:"10:00 PM", city:"Mexico City",          venue:"Estadio Azteca",          stage:"Group" },
  { id:25, date:"2026-06-18", dow:"Thu", group:"A",   team1:"Czech Republic",  team2:"South Africa",     time:"12:00 PM", city:"Atlanta",              venue:"Mercedes-Benz Stadium",   stage:"Group" },
  { id:26, date:"2026-06-18", dow:"Thu", group:"B",   team1:"Switzerland",     team2:"Bosnia & Herz.",   time:"3:00 PM",  city:"Los Angeles",          venue:"SoFi Stadium",            stage:"Group" },
  { id:27, date:"2026-06-18", dow:"Thu", group:"B",   team1:"Canada",          team2:"Qatar",            time:"6:00 PM",  city:"Vancouver",            venue:"BC Place",                stage:"Group" },
  { id:28, date:"2026-06-18", dow:"Thu", group:"A",   team1:"Mexico",          team2:"South Korea",      time:"9:00 PM",  city:"Zapopan",              venue:"Estadio Akron",           stage:"Group" },
  { id:29, date:"2026-06-19", dow:"Fri", group:"D",   team1:"Turkey",          team2:"Paraguay",         time:"12:00 AM", city:"San Francisco",        venue:"Levi's Stadium",          stage:"Group" },
  { id:30, date:"2026-06-19", dow:"Fri", group:"D",   team1:"USA",             team2:"Australia",        time:"3:00 PM",  city:"Seattle",              venue:"Lumen Field",             stage:"Group" },
  { id:31, date:"2026-06-19", dow:"Fri", group:"C",   team1:"Scotland",        team2:"Morocco",          time:"6:00 PM",  city:"Boston",               venue:"Gillette Stadium",        stage:"Group" },
  { id:32, date:"2026-06-19", dow:"Fri", group:"C",   team1:"Brazil",          team2:"Haiti",            time:"9:00 PM",  city:"Philadelphia",         venue:"Lincoln Financial Field", stage:"Group" },
  { id:33, date:"2026-06-20", dow:"Sat", group:"F",   team1:"Tunisia",         team2:"Japan",            time:"12:00 AM", city:"Monterrey",            venue:"Estadio BBVA",            stage:"Group" },
  { id:34, date:"2026-06-20", dow:"Sat", group:"F",   team1:"Netherlands",     team2:"Sweden",           time:"1:00 PM",  city:"Houston",              venue:"NRG Stadium",             stage:"Group" },
  { id:35, date:"2026-06-20", dow:"Sat", group:"E",   team1:"Germany",         team2:"Ivory Coast",      time:"4:00 PM",  city:"Toronto",              venue:"BMO Field",               stage:"Group" },
  { id:36, date:"2026-06-20", dow:"Sat", group:"E",   team1:"Ecuador",         team2:"Curaçao",          time:"8:00 PM",  city:"Kansas City",          venue:"Arrowhead Stadium",       stage:"Group" },
  { id:37, date:"2026-06-21", dow:"Sun", group:"H",   team1:"Spain",           team2:"Saudi Arabia",     time:"12:00 PM", city:"Atlanta",              venue:"Mercedes-Benz Stadium",   stage:"Group" },
  { id:38, date:"2026-06-21", dow:"Sun", group:"G",   team1:"Belgium",         team2:"Iran",             time:"3:00 PM",  city:"Los Angeles",          venue:"SoFi Stadium",            stage:"Group" },
  { id:39, date:"2026-06-21", dow:"Sun", group:"H",   team1:"Uruguay",         team2:"Cape Verde",       time:"6:00 PM",  city:"Miami",                venue:"Hard Rock Stadium",       stage:"Group" },
  { id:40, date:"2026-06-21", dow:"Sun", group:"G",   team1:"New Zealand",     team2:"Egypt",            time:"9:00 PM",  city:"Vancouver",            venue:"BC Place",                stage:"Group" },
  { id:41, date:"2026-06-22", dow:"Mon", group:"J",   team1:"Argentina",       team2:"Austria",          time:"1:00 PM",  city:"Dallas",               venue:"AT&T Stadium",            stage:"Group" },
  { id:42, date:"2026-06-22", dow:"Mon", group:"I",   team1:"France",          team2:"Iraq",             time:"5:00 PM",  city:"Philadelphia",         venue:"Lincoln Financial Field", stage:"Group" },
  { id:43, date:"2026-06-22", dow:"Mon", group:"I",   team1:"Norway",          team2:"Senegal",          time:"8:00 PM",  city:"New York / New Jersey",venue:"MetLife Stadium",         stage:"Group" },
  { id:44, date:"2026-06-22", dow:"Mon", group:"J",   team1:"Jordan",          team2:"Algeria",          time:"11:00 PM", city:"San Francisco",        venue:"Levi's Stadium",          stage:"Group" },
  { id:45, date:"2026-06-23", dow:"Tue", group:"K",   team1:"Portugal",        team2:"Uzbekistan",       time:"1:00 PM",  city:"Houston",              venue:"NRG Stadium",             stage:"Group" },
  { id:46, date:"2026-06-23", dow:"Tue", group:"L",   team1:"England",         team2:"Ghana",            time:"4:00 PM",  city:"Boston",               venue:"Gillette Stadium",        stage:"Group" },
  { id:47, date:"2026-06-23", dow:"Tue", group:"L",   team1:"Panama",          team2:"Croatia",          time:"7:00 PM",  city:"Toronto",              venue:"BMO Field",               stage:"Group" },
  { id:48, date:"2026-06-23", dow:"Tue", group:"K",   team1:"Colombia",        team2:"DR Congo",         time:"10:00 PM", city:"Zapopan",              venue:"Estadio Akron",           stage:"Group" },
  { id:49, date:"2026-06-24", dow:"Wed", group:"B",   team1:"Switzerland",     team2:"Canada",           time:"3:00 PM",  city:"Vancouver",            venue:"BC Place",                stage:"Group" },
  { id:50, date:"2026-06-24", dow:"Wed", group:"B",   team1:"Bosnia & Herz.",  team2:"Qatar",            time:"3:00 PM",  city:"Seattle",              venue:"Lumen Field",             stage:"Group" },
  { id:51, date:"2026-06-24", dow:"Wed", group:"C",   team1:"Scotland",        team2:"Brazil",           time:"6:00 PM",  city:"Miami",                venue:"Hard Rock Stadium",       stage:"Group" },
  { id:52, date:"2026-06-24", dow:"Wed", group:"C",   team1:"Morocco",         team2:"Haiti",            time:"6:00 PM",  city:"Atlanta",              venue:"Mercedes-Benz Stadium",   stage:"Group" },
  { id:53, date:"2026-06-24", dow:"Wed", group:"A",   team1:"Czech Republic",  team2:"Mexico",           time:"9:00 PM",  city:"Mexico City",          venue:"Estadio Azteca",          stage:"Group" },
  { id:54, date:"2026-06-24", dow:"Wed", group:"A",   team1:"South Africa",    team2:"South Korea",      time:"9:00 PM",  city:"Monterrey",            venue:"Estadio BBVA",            stage:"Group" },
  { id:55, date:"2026-06-25", dow:"Thu", group:"E",   team1:"Curaçao",         team2:"Ivory Coast",      time:"4:00 PM",  city:"Philadelphia",         venue:"Lincoln Financial Field", stage:"Group" },
  { id:56, date:"2026-06-25", dow:"Thu", group:"E",   team1:"Ecuador",         team2:"Germany",          time:"4:00 PM",  city:"New York / New Jersey",venue:"MetLife Stadium",         stage:"Group" },
  { id:57, date:"2026-06-25", dow:"Thu", group:"F",   team1:"Japan",           team2:"Sweden",           time:"7:00 PM",  city:"Dallas",               venue:"AT&T Stadium",            stage:"Group" },
  { id:58, date:"2026-06-25", dow:"Thu", group:"F",   team1:"Tunisia",         team2:"Netherlands",      time:"7:00 PM",  city:"Kansas City",          venue:"Arrowhead Stadium",       stage:"Group" },
  { id:59, date:"2026-06-25", dow:"Thu", group:"D",   team1:"Turkey",          team2:"USA",              time:"10:00 PM", city:"Los Angeles",          venue:"SoFi Stadium",            stage:"Group" },
  { id:60, date:"2026-06-25", dow:"Thu", group:"D",   team1:"Paraguay",        team2:"Australia",        time:"10:00 PM", city:"San Francisco",        venue:"Levi's Stadium",          stage:"Group" },
  { id:61, date:"2026-06-26", dow:"Fri", group:"I",   team1:"Norway",          team2:"France",           time:"3:00 PM",  city:"Boston",               venue:"Gillette Stadium",        stage:"Group" },
  { id:62, date:"2026-06-26", dow:"Fri", group:"I",   team1:"Senegal",         team2:"Iraq",             time:"3:00 PM",  city:"Toronto",              venue:"BMO Field",               stage:"Group" },
  { id:63, date:"2026-06-26", dow:"Fri", group:"H",   team1:"Cape Verde",      team2:"Saudi Arabia",     time:"8:00 PM",  city:"Houston",              venue:"NRG Stadium",             stage:"Group" },
  { id:64, date:"2026-06-26", dow:"Fri", group:"H",   team1:"Uruguay",         team2:"Spain",            time:"8:00 PM",  city:"Zapopan",              venue:"Estadio Akron",           stage:"Group" },
  { id:65, date:"2026-06-26", dow:"Fri", group:"G",   team1:"Egypt",           team2:"Iran",             time:"11:00 PM", city:"Seattle",              venue:"Lumen Field",             stage:"Group" },
  { id:66, date:"2026-06-26", dow:"Fri", group:"G",   team1:"New Zealand",     team2:"Belgium",          time:"11:00 PM", city:"Vancouver",            venue:"BC Place",                stage:"Group" },
  { id:67, date:"2026-06-27", dow:"Sat", group:"L",   team1:"Panama",          team2:"England",          time:"5:00 PM",  city:"New York / New Jersey",venue:"MetLife Stadium",         stage:"Group" },
  { id:68, date:"2026-06-27", dow:"Sat", group:"L",   team1:"Croatia",         team2:"Ghana",            time:"5:00 PM",  city:"Philadelphia",         venue:"Lincoln Financial Field", stage:"Group" },
  { id:69, date:"2026-06-27", dow:"Sat", group:"K",   team1:"Colombia",        team2:"Portugal",         time:"7:30 PM",  city:"Miami",                venue:"Hard Rock Stadium",       stage:"Group" },
  { id:70, date:"2026-06-27", dow:"Sat", group:"K",   team1:"DR Congo",        team2:"Uzbekistan",       time:"7:30 PM",  city:"Atlanta",              venue:"Mercedes-Benz Stadium",   stage:"Group" },
  { id:71, date:"2026-06-27", dow:"Sat", group:"J",   team1:"Algeria",         team2:"Austria",          time:"10:00 PM", city:"Kansas City",          venue:"Arrowhead Stadium",       stage:"Group" },
  { id:72, date:"2026-06-27", dow:"Sat", group:"J",   team1:"Jordan",          team2:"Argentina",        time:"10:00 PM", city:"Dallas",               venue:"AT&T Stadium",            stage:"Group" },
  { id:73, date:"2026-06-28", dow:"Sun", group:"R32", team1:"Runner-up A",     team2:"Runner-up B",      time:"3:00 PM",  city:"Los Angeles",          venue:"SoFi Stadium",            stage:"Round of 32" },
  { id:74, date:"2026-06-29", dow:"Mon", group:"R32", team1:"Winner C",        team2:"Runner-up F",      time:"1:00 PM",  city:"Houston",              venue:"NRG Stadium",             stage:"Round of 32" },
  { id:75, date:"2026-06-29", dow:"Mon", group:"R32", team1:"Winner E",        team2:"Best 3rd",         time:"4:30 PM",  city:"Boston",               venue:"Gillette Stadium",        stage:"Round of 32" },
  { id:76, date:"2026-06-29", dow:"Mon", group:"R32", team1:"Winner F",        team2:"Runner-up C",      time:"9:00 PM",  city:"Monterrey",            venue:"Estadio BBVA",            stage:"Round of 32" },
  { id:77, date:"2026-06-30", dow:"Tue", group:"R32", team1:"Winner I",        team2:"Best 3rd",         time:"5:00 PM",  city:"New York / New Jersey",venue:"MetLife Stadium",         stage:"Round of 32" },
  { id:78, date:"2026-06-30", dow:"Tue", group:"R32", team1:"Runner-up E",     team2:"Runner-up I",      time:"1:00 PM",  city:"Dallas",               venue:"AT&T Stadium",            stage:"Round of 32" },
  { id:79, date:"2026-06-30", dow:"Tue", group:"R32", team1:"Winner A",        team2:"Best 3rd",         time:"9:00 PM",  city:"Mexico City",          venue:"Estadio Azteca",          stage:"Round of 32" },
  { id:80, date:"2026-07-01", dow:"Wed", group:"R32", team1:"Winner L",        team2:"Best 3rd",         time:"12:00 PM", city:"Atlanta",              venue:"Mercedes-Benz Stadium",   stage:"Round of 32" },
  { id:81, date:"2026-07-01", dow:"Wed", group:"R32", team1:"Winner D",        team2:"Best 3rd",         time:"8:00 PM",  city:"San Francisco",        venue:"Levi's Stadium",          stage:"Round of 32" },
  { id:82, date:"2026-07-01", dow:"Wed", group:"R32", team1:"Winner G",        team2:"Best 3rd",         time:"4:00 PM",  city:"Seattle",              venue:"Lumen Field",             stage:"Round of 32" },
  { id:83, date:"2026-07-02", dow:"Thu", group:"R32", team1:"Runner-up K",     team2:"Runner-up L",      time:"7:00 PM",  city:"Toronto",              venue:"BMO Field",               stage:"Round of 32" },
  { id:84, date:"2026-07-02", dow:"Thu", group:"R32", team1:"Winner H",        team2:"Runner-up J",      time:"3:00 PM",  city:"Los Angeles",          venue:"SoFi Stadium",            stage:"Round of 32" },
  { id:85, date:"2026-07-02", dow:"Thu", group:"R32", team1:"Winner B",        team2:"Best 3rd",         time:"11:00 PM", city:"Vancouver",            venue:"BC Place",                stage:"Round of 32" },
  { id:86, date:"2026-07-03", dow:"Fri", group:"R32", team1:"Winner J",        team2:"Runner-up H",      time:"6:00 PM",  city:"Miami",                venue:"Hard Rock Stadium",       stage:"Round of 32" },
  { id:87, date:"2026-07-03", dow:"Fri", group:"R32", team1:"Winner K",        team2:"Best 3rd",         time:"9:30 PM",  city:"Kansas City",          venue:"Arrowhead Stadium",       stage:"Round of 32" },
  { id:88, date:"2026-07-03", dow:"Fri", group:"R32", team1:"Runner-up D",     team2:"Runner-up G",      time:"2:00 PM",  city:"Dallas",               venue:"AT&T Stadium",            stage:"Round of 32" },
  { id:89, date:"2026-07-04", dow:"Sat", group:"R16", team1:"W74",             team2:"W77",              time:"5:00 PM",  city:"Philadelphia",         venue:"Lincoln Financial Field", stage:"Round of 16" },
  { id:90, date:"2026-07-04", dow:"Sat", group:"R16", team1:"W73",             team2:"W75",              time:"1:00 PM",  city:"Houston",              venue:"NRG Stadium",             stage:"Round of 16" },
  { id:91, date:"2026-07-05", dow:"Sun", group:"R16", team1:"W76",             team2:"W78",              time:"4:00 PM",  city:"New York / New Jersey",venue:"MetLife Stadium",         stage:"Round of 16" },
  { id:92, date:"2026-07-05", dow:"Sun", group:"R16", team1:"W79",             team2:"W80",              time:"8:00 PM",  city:"Mexico City",          venue:"Estadio Azteca",          stage:"Round of 16" },
  { id:93, date:"2026-07-06", dow:"Mon", group:"R16", team1:"W83",             team2:"W84",              time:"3:00 PM",  city:"Dallas",               venue:"AT&T Stadium",            stage:"Round of 16" },
  { id:94, date:"2026-07-06", dow:"Mon", group:"R16", team1:"W81",             team2:"W82",              time:"8:00 PM",  city:"Seattle",              venue:"Lumen Field",             stage:"Round of 16" },
  { id:95, date:"2026-07-07", dow:"Tue", group:"R16", team1:"W86",             team2:"W88",              time:"12:00 PM", city:"Atlanta",              venue:"Mercedes-Benz Stadium",   stage:"Round of 16" },
  { id:96, date:"2026-07-07", dow:"Tue", group:"R16", team1:"W85",             team2:"W87",              time:"4:00 PM",  city:"Vancouver",            venue:"BC Place",                stage:"Round of 16" },
  { id:97, date:"2026-07-09", dow:"Thu", group:"QF",  team1:"W89",             team2:"W90",              time:"4:00 PM",  city:"Boston",               venue:"Gillette Stadium",        stage:"Quarterfinal" },
  { id:98, date:"2026-07-10", dow:"Fri", group:"QF",  team1:"W93",             team2:"W94",              time:"3:00 PM",  city:"Los Angeles",          venue:"SoFi Stadium",            stage:"Quarterfinal" },
  { id:99, date:"2026-07-11", dow:"Sat", group:"QF",  team1:"W91",             team2:"W92",              time:"5:00 PM",  city:"Miami",                venue:"Hard Rock Stadium",       stage:"Quarterfinal" },
  { id:100,date:"2026-07-11", dow:"Sat", group:"QF",  team1:"W95",             team2:"W96",              time:"9:00 PM",  city:"Kansas City",          venue:"Arrowhead Stadium",       stage:"Quarterfinal" },
  { id:101,date:"2026-07-14", dow:"Tue", group:"SF",  team1:"W97",             team2:"W98",              time:"3:00 PM",  city:"Dallas",               venue:"AT&T Stadium",            stage:"Semifinal" },
  { id:102,date:"2026-07-15", dow:"Wed", group:"SF",  team1:"W99",             team2:"W100",             time:"3:00 PM",  city:"Atlanta",              venue:"Mercedes-Benz Stadium",   stage:"Semifinal" },
  { id:103,date:"2026-07-18", dow:"Sat", group:"3PL", team1:"Semifinal Losers",team2:"",                 time:"5:00 PM",  city:"Miami",                venue:"Hard Rock Stadium",       stage:"Third Place" },
  { id:104,date:"2026-07-19", dow:"Sun", group:"FIN", team1:"Champion",        team2:"Finalist",         time:"3:00 PM",  city:"New York / New Jersey",venue:"MetLife Stadium",         stage:"Final" },
];

const ACTIVATION = {
  1:{score:5,reason:"OPENING MATCH. Mexico vs South Africa — Pan-African moment on world stage. Rematch of 2010."},
  7:{score:5,reason:"Brazil vs Morocco — two global diaspora giants. Massive cross-community cultural moment."},
  8:{score:4,reason:"Haiti's FIRST ever World Cup match. Boston's Haitian community will mobilize completely."},
  9:{score:3,reason:"Curaçao debut — smallest WC nation ever. Caribbean pride across the diaspora."},
  11:{score:4,reason:"Ivory Coast in Philly — reigning AFCON champs. Strong West African diaspora."},
  13:{score:4,reason:"Cape Verde's historic WC debut in Atlanta — perfect city for African football culture."},
  14:{score:3,reason:"Egypt in Seattle. North African community engagement opportunity."},
  17:{score:5,reason:"France vs Senegal in NYC — largest Senegalese diaspora in the US. THE match."},
  19:{score:4,reason:"Argentina vs Algeria in Kansas City. Defending champs vs Les Fennecs."},
  21:{score:5,reason:"Portugal vs DR CONGO — Congo's first WC match in 52 years. Historic. Houston's African community."},
  23:{score:4,reason:"Ghana in Toronto — massive Ghanaian community shows up loud."},
  25:{score:4,reason:"South Africa in Atlanta — most Black WC city. SA's second group match."},
  31:{score:3,reason:"Morocco's second match. Boston's growing North African community."},
  32:{score:5,reason:"Brazil vs Haiti in Philly — Caribbean and Brazilian diaspora collide."},
  33:{score:3,reason:"Historical milestone: 1,000th WC match ever. Tunisia involved."},
  35:{score:3,reason:"Germany vs Ivory Coast in Toronto — West African Toronto community."},
  36:{score:3,reason:"Ecuador vs Curaçao — Caribbean pride. Kansas City diaspora."},
  39:{score:4,reason:"Cape Verde vs Uruguay in Miami — Caribbean and African energy. Cape Verde's biggest ever match."},
  43:{score:4,reason:"Senegal vs Norway in NYC — Senegalese diaspora packs MetLife."},
  46:{score:4,reason:"England vs Ghana — dual-heritage narrative, huge Black British/Ghanaian story."},
  48:{score:4,reason:"Colombia vs DR Congo — Congo's second match, growing excitement around the Leopards."},
  52:{score:5,reason:"🔥 Morocco vs Haiti ATLANTA — ALL-DIASPORA DERBY. Maximum activation. Two nations, one city."},
  54:{score:4,reason:"South Africa's final group match — win or go home for Bafana Bafana."},
  55:{score:5,reason:"🔥 Curaçao vs Ivory Coast Philly — ALL-DIASPORA DERBY. Caribbean vs West Africa."},
  58:{score:3,reason:"Tunisia's final group match. North African community final push."},
  62:{score:4,reason:"Senegal vs Iraq in Toronto — Senegal's final group match. Championship atmosphere."},
  63:{score:4,reason:"Cape Verde's final group match. Houston's African diaspora in full effect."},
  65:{score:3,reason:"Egypt's final group match in Seattle."},
  68:{score:4,reason:"Ghana's final group match in Philly. Deep Ghanaian diaspora."},
  70:{score:5,reason:"🔥 DR Congo's final group match in ATLANTA. 52-year WC return, city is Black excellence HQ."},
  71:{score:3,reason:"Algeria's final group match in Kansas City."},
};

function getActivation(m) {
  if (ACTIVATION[m.id]) return ACTIVATION[m.id];
  const hc = ["Atlanta","Miami","New York / New Jersey","Philadelphia","Houston","Toronto"];
  if (hc.includes(m.city) && m.stage !== "Group") return { score:3, reason:`${m.stage} in ${m.city} — high Black diaspora city. Strong activation potential for any advancing African/Caribbean nation.` };
  return null;
}

function isDiaspora(n) { return !!DIASPORA_TEAMS[n]; }
function getMatchDiaspora(m) {
  const out = [];
  if (isDiaspora(m.team1)) out.push({ name:m.team1, ...DIASPORA_TEAMS[m.team1] });
  if (isDiaspora(m.team2)) out.push({ name:m.team2, ...DIASPORA_TEAMS[m.team2] });
  return out;
}

function matchColor(m) {
  const d = getMatchDiaspora(m);
  if (d.length >= 2) return { bg:"#FFB800", text:"#09090F", border:"#FFB800" };
  if (d.length === 1) return d[0].region === "Caribbean"
    ? { bg:"rgba(255,184,0,0.15)", text:"#FFD44D", border:"rgba(255,184,0,0.5)" }
    : { bg:"rgba(0,168,107,0.15)", text:"#00D48A", border:"rgba(0,168,107,0.5)" };
  const a = getActivation(m);
  if (a && a.score >= 4) return { bg:"rgba(255,107,53,0.1)", text:"#FF8C5A", border:"rgba(255,107,53,0.3)" };
  return { bg:"rgba(255,255,255,0.04)", text:"#555", border:"rgba(255,255,255,0.08)" };
}

const CITIES = [...new Set(MATCHES.map(m => m.city))].sort();
const STAGES = ["Group","Round of 32","Round of 16","Quarterfinal","Semifinal","Third Place","Final"];

// Calendar helpers
function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
function getFirstDayOfWeek(year, month) { return new Date(year, month, 1).getDay(); }

const MONTHS = [
  { label:"JUNE 2026", year:2026, month:5 },
  { label:"JULY 2026", year:2026, month:6 },
];

// ─── MATCH DETAIL MODAL ──────────────────────────────────────────────────────

function MatchDetail({ match, onClose }) {
  if (!match) return null;
  const d = getMatchDiaspora(match);
  const act = getActivation(match);
  const isDerby = d.length >= 2;
  const cn = CITY_DIASPORA_NOTES[match.city];

  return (
    <div onClick={onClose} style={{
      position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:1000,
      display:"flex", alignItems:"center", justifyContent:"center", padding:20
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background:"#111118", border:`1px solid ${isDerby ? "#FFB800" : d.length ? "#00A86B" : "rgba(255,255,255,0.1)"}`,
        borderRadius:16, padding:24, maxWidth:480, width:"100%",
        maxHeight:"85vh", overflowY:"auto"
      }}>
        {isDerby && (
          <div style={{ background:"#FFB800", color:"#09090F", fontSize:10, fontWeight:900,
            padding:"4px 10px", borderRadius:6, display:"inline-block", marginBottom:12,
            letterSpacing:2, fontFamily:"'Bebas Neue',sans-serif" }}>⚡ DIASPORA DERBY</div>
        )}
        <div style={{ color:"#666", fontSize:11, fontFamily:"monospace", marginBottom:8 }}>
          {match.dow} · {match.date.replace("2026-","")} · {match.time} ET
        </div>
        <div style={{ fontSize:22, fontWeight:800, fontFamily:"'Bebas Neue',sans-serif",
          letterSpacing:1.5, color:"#fff", marginBottom:4 }}>
          {isDiaspora(match.team1) ? DIASPORA_TEAMS[match.team1].flag + " " : ""}{match.team1}
          <span style={{ color:"#444", margin:"0 10px", fontSize:16 }}>vs</span>
          {isDiaspora(match.team2) ? DIASPORA_TEAMS[match.team2].flag + " " : ""}{match.team2}
        </div>
        <div style={{ color:"#888", fontSize:12, marginBottom:16 }}>
          📍 {match.city} · {match.venue} · Match #{match.id}
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:16 }}>
          <span style={{
            background: match.stage === "Final" ? "#FFB800" : match.stage === "Semifinal" ? "#FF6B35" :
              match.stage === "Quarterfinal" ? "#B44FFF" : "rgba(255,255,255,0.1)",
            color: ["Final","Semifinal","Quarterfinal"].includes(match.stage) ? "#09090F" : "#ccc",
            fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:5
          }}>{match.stage}</span>
          {match.stage === "Group" && <span style={{ background:"rgba(255,255,255,0.06)", color:"#666", fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:5 }}>Group {match.group}</span>}
          {d.map(x => <span key={x.name} style={{
            background: x.region === "Caribbean" ? "rgba(255,184,0,0.15)" : "rgba(0,168,107,0.15)",
            color: x.region === "Caribbean" ? "#FFB800" : "#00A86B",
            fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:5
          }}>{x.flag} {x.region}</span>)}
        </div>
        {act && (
          <div style={{ background:"rgba(255,184,0,0.06)", border:"1px solid rgba(255,184,0,0.15)", borderRadius:10, padding:"12px 14px", marginBottom:12 }}>
            <div style={{ color:"#FFB800", fontSize:11, fontWeight:800, marginBottom:5 }}>
              ⚡ ACTIVATION OPPORTUNITY · {act.score}/5
            </div>
            <div style={{ color:"#bbb", fontSize:12, lineHeight:1.6 }}>{act.reason}</div>
          </div>
        )}
        {cn && d.length > 0 && (
          <div style={{ background:"rgba(74,158,255,0.06)", border:"1px solid rgba(74,158,255,0.12)", borderRadius:10, padding:"12px 14px" }}>
            <div style={{ color:"#4A9EFF", fontSize:11, fontWeight:800, marginBottom:5 }}>
              🌍 {match.city.toUpperCase()} · COMMUNITY PROFILE
            </div>
            <div style={{ color:"#bbb", fontSize:12, lineHeight:1.6 }}>{cn}</div>
          </div>
        )}
        <button onClick={onClose} style={{
          marginTop:16, width:"100%", background:"rgba(255,255,255,0.06)",
          border:"1px solid rgba(255,255,255,0.1)", color:"#888",
          borderRadius:8, padding:"10px", fontSize:12, cursor:"pointer"
        }}>Close</button>
      </div>
    </div>
  );
}

// ─── CALENDAR VIEW ───────────────────────────────────────────────────────────

function CalendarMonth({ monthData, filteredIds, allMatches, onSelectMatch }) {
  const { label, year, month } = monthData;
  const days = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);
  const DOW = ["SUN","MON","TUE","WED","THU","FRI","SAT"];

  const matchesByDay = {};
  allMatches.forEach(m => {
    const [y, mo, day] = m.date.split("-").map(Number);
    if (y === year && mo - 1 === month) {
      if (!matchesByDay[day]) matchesByDay[day] = [];
      matchesByDay[day].push(m);
    }
  });

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <div style={{ marginBottom:32 }}>
      {/* Month header */}
      <div style={{
        fontFamily:"'Bebas Neue',sans-serif", fontSize:22, letterSpacing:3,
        color:"#fff", marginBottom:16, paddingBottom:12,
        borderBottom:"2px solid rgba(255,184,0,0.2)"
      }}>{label}</div>

      {/* Day headers */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:1, marginBottom:2 }}>
        {DOW.map(d => (
          <div key={d} style={{
            textAlign:"center", color:"#444", fontSize:10, fontWeight:800,
            letterSpacing:1, padding:"6px 0"
          }}>{d}</div>
        ))}
      </div>

      {/* Weeks */}
      {weeks.map((week, wi) => (
        <div key={wi} style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:1, marginBottom:1 }}>
          {week.map((day, di) => {
            const dayMatches = day ? (matchesByDay[day] || []) : [];
            const visibleMatches = dayMatches.filter(m => filteredIds.has(m.id));
            const allDayMatches = dayMatches;
            const hasDiaspora = allDayMatches.some(m => getMatchDiaspora(m).length > 0);
            const hasDerby = allDayMatches.some(m => getMatchDiaspora(m).length >= 2);
            const hasHighAct = allDayMatches.some(m => { const a = getActivation(m); return a && a.score >= 5; });

            return (
              <div key={di} style={{
                minHeight:100,
                background: day ? (hasDerby ? "rgba(255,184,0,0.04)" : hasDiaspora ? "rgba(0,168,107,0.03)" : "rgba(255,255,255,0.015)") : "transparent",
                border: day ? `1px solid ${hasDerby ? "rgba(255,184,0,0.2)" : hasDiaspora ? "rgba(0,168,107,0.15)" : "rgba(255,255,255,0.05)"}` : "1px solid transparent",
                borderRadius:8, padding:"6px 5px",
                position:"relative"
              }}>
                {day && (
                  <>
                    {/* Date number */}
                    <div style={{
                      fontSize:12, fontWeight:800,
                      color: hasDerby ? "#FFB800" : hasDiaspora ? "#00A86B" : "#555",
                      marginBottom:4, display:"flex", justifyContent:"space-between", alignItems:"center"
                    }}>
                      <span>{day}</span>
                      {hasHighAct && <span style={{ fontSize:8 }}>⚡</span>}
                    </div>

                    {/* Match pills */}
                    <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                      {visibleMatches.slice(0, 4).map(m => {
                        const c = matchColor(m);
                        const d = getMatchDiaspora(m);
                        const label = d.length >= 2
                          ? `${d[0].flag}${d[1].flag} DERBY`
                          : d.length === 1
                          ? `${d[0].flag} ${d[0].name.length > 8 ? d[0].name.slice(0,7)+"…" : d[0].name}`
                          : `${m.stage.replace("Round of ","R")}`;

                        return (
                          <button key={m.id} onClick={() => onSelectMatch(m)} style={{
                            background:c.bg, border:`1px solid ${c.border}`, color:c.text,
                            borderRadius:4, padding:"2px 5px", fontSize:9, fontWeight:700,
                            textAlign:"left", cursor:"pointer", width:"100%",
                            whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
                            letterSpacing:0.3
                          }}>{label}</button>
                        );
                      })}
                      {visibleMatches.length > 4 && (
                        <div style={{ color:"#444", fontSize:9, textAlign:"center" }}>+{visibleMatches.length - 4} more</div>
                      )}
                      {visibleMatches.length === 0 && allDayMatches.length > 0 && (
                        <div style={{ color:"#333", fontSize:9, textAlign:"center", padding:"2px 0" }}>
                          {allDayMatches.length} filtered
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── LIST MATCH CARD ─────────────────────────────────────────────────────────

function ListCard({ match, onSelect }) {
  const d = getMatchDiaspora(match);
  const act = getActivation(match);
  const isDerby = d.length >= 2;
  const hasDiaspora = d.length > 0;
  const border = isDerby ? "#FFB800" : hasDiaspora ? "#00A86B" : "rgba(255,255,255,0.05)";
  const bg = isDerby ? "rgba(255,184,0,0.05)" : hasDiaspora ? "rgba(0,168,107,0.04)" : "rgba(255,255,255,0.015)";

  return (
    <div onClick={() => onSelect(match)} style={{
      border:`1px solid ${border}`, background:bg, borderRadius:12,
      padding:"13px 16px", cursor:"pointer", position:"relative", overflow:"hidden",
      transition:"border-color 0.15s"
    }}>
      {isDerby && (
        <div style={{
          position:"absolute", top:0, right:0,
          background:"#FFB800", color:"#09090F",
          fontSize:9, fontWeight:900, padding:"3px 9px",
          borderBottomLeftRadius:8, letterSpacing:2,
          fontFamily:"'Bebas Neue',sans-serif"
        }}>⚡ DIASPORA DERBY</div>
      )}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:5, flexWrap:"wrap" }}>
            <span style={{ color:"#555", fontSize:11, fontFamily:"monospace", whiteSpace:"nowrap" }}>
              {match.dow} {match.date.replace("2026-","")}
            </span>
            <span style={{
              background: match.stage === "Final" ? "#FFB800" : match.stage === "Semifinal" ? "#FF6B35" :
                match.stage === "Quarterfinal" ? "#B44FFF" : "rgba(255,255,255,0.08)",
              color: ["Final","Semifinal","Quarterfinal"].includes(match.stage) ? "#09090F" : "#ccc",
              fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:4
            }}>{match.stage}</span>
            {match.stage === "Group" && <span style={{ color:"#444", fontSize:10 }}>Grp {match.group}</span>}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap" }}>
            <span style={{ fontSize:15, fontWeight:800, color: isDiaspora(match.team1) ? "#fff" : "#777",
              fontFamily:"'Bebas Neue',sans-serif", letterSpacing:1 }}>
              {isDiaspora(match.team1) ? DIASPORA_TEAMS[match.team1].flag + " " : ""}{match.team1}
            </span>
            <span style={{ color:"#333", fontSize:12 }}>vs</span>
            <span style={{ fontSize:15, fontWeight:800, color: isDiaspora(match.team2) ? "#fff" : "#777",
              fontFamily:"'Bebas Neue',sans-serif", letterSpacing:1 }}>
              {isDiaspora(match.team2) ? DIASPORA_TEAMS[match.team2].flag + " " : ""}{match.team2}
            </span>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <span style={{ color:"#555", fontSize:11 }}>📍 {match.city}</span>
            <span style={{ color:"#444", fontSize:11 }}>· {match.time} ET</span>
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:5, flexShrink:0 }}>
          {d.map(x => (
            <span key={x.name} style={{
              background: x.region === "Caribbean" ? "rgba(255,184,0,0.12)" : "rgba(0,168,107,0.12)",
              color: x.region === "Caribbean" ? "#FFB800" : "#00A86B",
              fontSize:10, fontWeight:700, padding:"2px 6px", borderRadius:4,
              border:`1px solid ${x.region === "Caribbean" ? "rgba(255,184,0,0.25)" : "rgba(0,168,107,0.25)"}`,
              whiteSpace:"nowrap"
            }}>{x.flag} {x.region}</span>
          ))}
          {act && (
            <div style={{ display:"flex", gap:2 }}>
              {[1,2,3,4,5].map(i => <div key={i} style={{ width:7, height:7, borderRadius:"50%",
                background: i <= act.score ? (act.score === 5 ? "#FFB800" : act.score >= 4 ? "#00A86B" : "#4A9EFF") : "rgba(255,255,255,0.1)" }}/>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────

export default function App() {
  const [view, setView]             = useState("list");        // "list" | "calendar"
  const [calMonth, setCalMonth]     = useState(0);             // 0=June, 1=July
  const [diasporaOnly, setDiaspora] = useState(false);
  const [regionFilter, setRegion]   = useState("All");
  const [cityFilter, setCity]       = useState("All");
  const [stageFilter, setStage]     = useState("All");
  const [teamFilter, setTeam]       = useState("All");
  const [actMin, setActMin]         = useState(0);
  const [selectedMatch, setSelected] = useState(null);

  const filtered = useMemo(() => MATCHES.filter(m => {
    const d = getMatchDiaspora(m);
    if (diasporaOnly && !d.length) return false;
    if (regionFilter === "Africa" && !d.some(x => x.region === "Africa")) return false;
    if (regionFilter === "Caribbean" && !d.some(x => x.region === "Caribbean")) return false;
    if (regionFilter === "Derby" && d.length < 2) return false;
    if (regionFilter === "Congo" && !d.some(x => x.name === "DR Congo")) return false;
    if (cityFilter !== "All" && m.city !== cityFilter) return false;
    if (stageFilter !== "All" && m.stage !== stageFilter) return false;
    if (teamFilter !== "All" && m.team1 !== teamFilter && m.team2 !== teamFilter) return false;
    if (actMin > 0) { const a = getActivation(m); if (!a || a.score < actMin) return false; }
    return true;
  }), [diasporaOnly, regionFilter, cityFilter, stageFilter, teamFilter, actMin]);

  const filteredIds = useMemo(() => new Set(filtered.map(m => m.id)), [filtered]);

  const totalDiaspora = MATCHES.filter(m => getMatchDiaspora(m).length > 0).length;
  const totalDerby    = MATCHES.filter(m => getMatchDiaspora(m).length >= 2).length;
  const highAct       = MATCHES.filter(m => { const a = getActivation(m); return a && a.score >= 4; }).length;

  const sel = {
    background:"#0F0F1C", border:"1px solid rgba(255,255,255,0.09)", color:"#fff",
    borderRadius:8, padding:"8px 28px 8px 11px", fontSize:11, fontFamily:"inherit",
    cursor:"pointer", outline:"none", appearance:"none", WebkitAppearance:"none",
    backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath fill='%23555' d='M5 6L0 0h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat:"no-repeat", backgroundPosition:"right 9px center"
  };

  return (
    <div style={{ minHeight:"100vh", background:"#09090F", color:"#fff", fontFamily:"'Syne','Trebuchet MS',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&display=swap');
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:#333;border-radius:4px}
        select option{background:#0F0F1C}
        button:hover{opacity:0.85}
      `}</style>

      {/* HEADER */}
      <div style={{
        background:"linear-gradient(135deg,#0D0D1A 0%,#090910 50%,#0A0800 100%)",
        borderBottom:"1px solid rgba(255,184,0,0.12)", padding:"22px 20px 18px"
      }}>
        <div style={{ maxWidth:980, margin:"0 auto" }}>
          <div style={{ color:"rgba(255,184,0,0.6)", fontSize:10, fontWeight:700, letterSpacing:3, marginBottom:5 }}>
            FIFA WORLD CUP 2026 · ALL 48 TEAMS CONFIRMED
          </div>
          <h1 style={{
            margin:"0 0 3px", fontFamily:"'Bebas Neue',sans-serif",
            fontSize:"clamp(24px,5vw,40px)", letterSpacing:2,
            background:"linear-gradient(90deg,#FFB800,#fff 55%)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"
          }}>BLACK DIASPORA DASHBOARD</h1>
          <p style={{ color:"#555", fontSize:11, margin:"0 0 16px" }}>
            10 African nations · 2 Caribbean nations · 104 matches · DR Congo confirmed 🇨🇩
          </p>

          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            {[
              { label:"Diaspora Matches", value:totalDiaspora, color:"#00A86B" },
              { label:"Diaspora Derbies", value:totalDerby,    color:"#FFB800" },
              { label:"High Activation",  value:highAct,       color:"#FF6B35" },
              { label:"African Nations",  value:10,            color:"#4A9EFF" },
            ].map(s => (
              <div key={s.label} style={{ background:"rgba(255,255,255,0.03)", borderRadius:9, padding:"9px 14px", border:`1px solid ${s.color}18` }}>
                <div style={{ color:s.color, fontSize:20, fontWeight:800, fontFamily:"'Bebas Neue',sans-serif" }}>{s.value}</div>
                <div style={{ color:"#444", fontSize:9, letterSpacing:1, fontWeight:700 }}>{s.label.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STICKY CONTROLS */}
      <div style={{ background:"#0C0C16", borderBottom:"1px solid rgba(255,255,255,0.05)", padding:"12px 20px", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ maxWidth:980, margin:"0 auto" }}>

          {/* ROW 1: View toggle + filters */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:6, alignItems:"center", marginBottom:8 }}>

            {/* VIEW TOGGLE */}
            <div style={{ display:"flex", background:"rgba(255,255,255,0.05)", borderRadius:9, padding:3, marginRight:4 }}>
              {[
                { id:"list",     label:"≡ LIST" },
                { id:"calendar", label:"⊞ CALENDAR" },
              ].map(v => (
                <button key={v.id} onClick={() => setView(v.id)} style={{
                  background: view === v.id ? "#FFB800" : "transparent",
                  border:"none", color: view === v.id ? "#09090F" : "#666",
                  borderRadius:6, padding:"6px 14px", fontSize:11, fontWeight:800,
                  cursor:"pointer", letterSpacing:0.5, transition:"all 0.15s"
                }}>{v.label}</button>
              ))}
            </div>

            {/* CALENDAR MONTH TOGGLE (only shown in calendar view) */}
            {view === "calendar" && (
              <div style={{ display:"flex", background:"rgba(255,255,255,0.04)", borderRadius:8, padding:2, marginRight:4 }}>
                {MONTHS.map((m, i) => (
                  <button key={i} onClick={() => setCalMonth(i)} style={{
                    background: calMonth === i ? "rgba(255,255,255,0.1)" : "transparent",
                    border:"none", color: calMonth === i ? "#fff" : "#555",
                    borderRadius:6, padding:"5px 12px", fontSize:11, fontWeight:700,
                    cursor:"pointer", transition:"all 0.15s"
                  }}>{m.label}</button>
                ))}
              </div>
            )}

            <div style={{ width:1, height:24, background:"rgba(255,255,255,0.08)", margin:"0 4px" }}/>

            {/* DIASPORA TOGGLE */}
            <button onClick={() => setDiaspora(!diasporaOnly)} style={{
              background: diasporaOnly ? "#00A86B" : "rgba(0,168,107,0.08)",
              border:`1px solid ${diasporaOnly ? "#00A86B" : "rgba(0,168,107,0.2)"}`,
              color: diasporaOnly ? "#fff" : "#00A86B",
              borderRadius:8, padding:"7px 12px", fontSize:11, fontWeight:800, cursor:"pointer"
            }}>{diasporaOnly ? "✓ " : ""}DIASPORA ONLY</button>

            <select value={regionFilter} onChange={e => setRegion(e.target.value)} style={sel}>
              <option value="All">🌍 All Regions</option>
              <option value="Africa">🟢 African Teams</option>
              <option value="Caribbean">🟡 Caribbean Teams</option>
              <option value="Derby">⚡ Derbies Only</option>
              <option value="Congo">🇨🇩 DR Congo</option>
            </select>

            <select value={cityFilter} onChange={e => setCity(e.target.value)} style={sel}>
              <option value="All">📍 All Cities</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select value={stageFilter} onChange={e => setStage(e.target.value)} style={sel}>
              <option value="All">🏆 All Stages</option>
              {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <select value={teamFilter} onChange={e => setTeam(e.target.value)} style={sel}>
              <option value="All">👕 Any Team</option>
              {Object.entries(DIASPORA_TEAMS).map(([n,t]) => <option key={n} value={n}>{t.flag} {n}</option>)}
            </select>

            <select value={actMin} onChange={e => setActMin(Number(e.target.value))} style={sel}>
              <option value={0}>⚡ Any Activation</option>
              <option value={3}>⚡ 3+ Stars</option>
              <option value={4}>⚡ 4+ Stars</option>
              <option value={5}>⚡ 5-Star Only</option>
            </select>
          </div>

          {/* ROW 2: Nation quick-select pills */}
          <div style={{ display:"flex", gap:5, flexWrap:"wrap", alignItems:"center" }}>
            <span style={{ color:"#333", fontSize:10, fontWeight:700, letterSpacing:1, marginRight:2 }}>NATION:</span>
            {Object.entries(DIASPORA_TEAMS).map(([name, info]) => (
              <button key={name} onClick={() => setTeam(teamFilter === name ? "All" : name)} style={{
                background: teamFilter === name ? (info.region === "Caribbean" ? "#FFB800" : "#00A86B") : "rgba(255,255,255,0.03)",
                border:`1px solid ${teamFilter === name ? "transparent" : info.region === "Caribbean" ? "rgba(255,184,0,0.15)" : "rgba(0,168,107,0.15)"}`,
                color: teamFilter === name ? "#09090F" : "#777",
                borderRadius:6, padding:"4px 9px", fontSize:10, fontWeight:700, cursor:"pointer",
                display:"flex", alignItems:"center", gap:3, position:"relative"
              }}>
                {info.flag} {name}
                {name === "DR Congo" && teamFilter !== name && (
                  <span style={{ background:"#00A86B", color:"#09090F", fontSize:7, fontWeight:900,
                    padding:"1px 3px", borderRadius:3, letterSpacing:0.5 }}>NEW</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth:980, margin:"0 auto", padding:"18px 20px" }}>

        {/* Legend + count */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:8 }}>
          <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
            {[
              { color:"#FFB800", label:"Diaspora Derby" },
              { color:"#00A86B", label:"African nation" },
              { color:"#FFD44D", label:"Caribbean nation" },
              { color:"#FF8C5A", label:"High activation (non-diaspora)" },
            ].map(l => (
              <div key={l.label} style={{ display:"flex", alignItems:"center", gap:5 }}>
                <div style={{ width:9, height:9, borderRadius:2, background:l.color }}/>
                <span style={{ color:"#444", fontSize:10 }}>{l.label}</span>
              </div>
            ))}
          </div>
          <div style={{ color:"#444", fontSize:11 }}>
            <span style={{ color:"#FFB800", fontWeight:700 }}>{filtered.length}</span> / {MATCHES.length} matches
            {view === "calendar" && <span style={{ color:"#555" }}> · click any pill to expand</span>}
          </div>
        </div>

        {/* LIST VIEW */}
        {view === "list" && (
          <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
            {filtered.length === 0
              ? <div style={{ textAlign:"center", color:"#333", padding:"60px 0" }}>
                  <div style={{ fontSize:28, marginBottom:10 }}>🔍</div>
                  No matches with these filters.
                </div>
              : filtered.map(m => <ListCard key={m.id} match={m} onSelect={setSelected} />)
            }
          </div>
        )}

        {/* CALENDAR VIEW */}
        {view === "calendar" && (
          <CalendarMonth
            monthData={MONTHS[calMonth]}
            filteredIds={filteredIds}
            allMatches={MATCHES}
            onSelectMatch={setSelected}
            activeMonth={calMonth}
          />
        )}

        {/* CITY INTELLIGENCE (list view only) */}
        {view === "list" && (
          <div style={{ marginTop:36, border:"1px solid rgba(74,158,255,0.12)", borderRadius:14, overflow:"hidden" }}>
            <div style={{ background:"rgba(74,158,255,0.06)", padding:"12px 18px", borderBottom:"1px solid rgba(74,158,255,0.1)" }}>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:15, letterSpacing:2, color:"#4A9EFF" }}>CITY DIASPORA INTELLIGENCE</div>
              <div style={{ color:"#333", fontSize:10, marginTop:1 }}>Tap a city to filter matches</div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))" }}>
              {Object.entries(CITY_DIASPORA_NOTES).map(([city, note]) => (
                <div key={city} style={{ padding:"12px 16px", borderBottom:"1px solid rgba(255,255,255,0.03)", borderRight:"1px solid rgba(255,255,255,0.03)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                    <span style={{ fontWeight:800, fontSize:11, color:"#ccc" }}>{city}</span>
                    <button onClick={() => setCity(city === cityFilter ? "All" : city)} style={{
                      background: cityFilter === city ? "#4A9EFF" : "rgba(74,158,255,0.08)",
                      border:"none", color: cityFilter === city ? "#09090F" : "#4A9EFF",
                      borderRadius:4, padding:"2px 7px", fontSize:9, cursor:"pointer", fontWeight:800
                    }}>{cityFilter === city ? "✓" : "Filter"}</button>
                  </div>
                  <div style={{ color:"#555", fontSize:10, lineHeight:1.6 }}>{note}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ height:48 }} />
      </div>

      {/* MODAL */}
      {selectedMatch && <MatchDetail match={selectedMatch} onClose={() => setSelected(null)} />}
    </div>
  );
}
