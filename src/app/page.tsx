'use client';
import React, { useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import Image from "next/image";


type Nationality = {
  country: { name: string };
  playerCount: number;
};

type LeagueData = {
  tournament: { name: string; id: number; slug: string; country: { name: string }; };
  type: string;
  nationalities: Nationality[];
  totalPlayers: number;
  teamCount: number;
  sufficientPlayers: boolean;
  updatedAt: string;
};

export default function App() {
  const [data, setData] = useState<Record<string, LeagueData>>({});
  const [selectedLeague, setSelectedLeague] = useState<string>("");

  useEffect(() => {
    fetch("https://api-jugadores-8wlm.onrender.com/report")
      .then((res) => res.json())
      .then((json) => {
        // Flatten all countries -> leagues into one object
        const allLeagues: Record<string, LeagueData> = {};
        Object.values(json).forEach((countryLeagues: unknown) => {
          (countryLeagues as LeagueData[]).forEach((league: LeagueData) => {
            if (league.sufficientPlayers) {
              allLeagues[`${league.tournament.country.name}_${league.tournament.id}`] = league;
            }
          });
        });
        setData(allLeagues);
      })
      .catch((err) => console.error("Error fetching:", err));
  }, []);

  const leagues = Object.keys(data);

  const renderFlag = (countryName: string) => {
  const ukFlags: Record<string, string> = {
    England: "/flags/england.png",
    Scotland: "/flags/scotland.png",
    Wales: "/flags/wales.png",
    "Northern Ireland": "/flags/northern_ireland.png",
  };

  if (ukFlags[countryName]) {
    return (
    <Image
    src={ukFlags[countryName]}
    alt={countryName}
    width={24}
    height={24}
    style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />

    );
  }

  return (
    <ReactCountryFlag
      countryCode={countryNameToCode(countryName)}
      svg
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  );
};


  // Render flags as circles
  const renderCircles = (leagueKey: string) => {
    if (!leagueKey || !data[leagueKey]) return null;

    return (
      <div className="flex flex-wrap gap-1 mt-6">
        {data[leagueKey].nationalities.map((nat, idx) => {
          const circles = Array.from({ length: nat.playerCount }, (_, i) => (
            <div
              key={`${idx}-${i}`}
              className="w-7 h-7 rounded-full overflow-hidden shadow-sm border border-sky-300 flex items-center justify-center"
            >
              {["England", "Scotland", "Wales", "Northern Ireland"].includes(nat.country.name) ? (
                renderFlag(nat.country.name)
              ) : (
              <ReactCountryFlag
                countryCode={countryNameToCode(nat.country.name)}
                svg
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />)}
            </div>
          ));
          return circles;
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-white text-gray-800">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-sky-500 to-cyan-400 bg-clip-text text-transparent">
          Nationality Distribution
        </h1>

        {/* Selector */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-600">
            Selecciona un país / liga
          </label>
          <select
            className="border border-sky-200 p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
            value={selectedLeague}
            onChange={(e) => setSelectedLeague(e.target.value)}
          >
            <option value="">-- Selecciona una liga --</option>
            {leagues.map((leagueKey) => (
              <option key={leagueKey} value={leagueKey}>
                {data[leagueKey].tournament.name} ({data[leagueKey].tournament.country.name})
              </option>
            ))}
          </select>
        </div>

        {/* Display */}
        {selectedLeague && (
          <div className="bg-white p-6 rounded-xl shadow-md border border-sky-100">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              {data[selectedLeague].tournament.name}{" "}
              <span className="text-gray-500">
                ({data[selectedLeague].tournament.country.name})
              </span>
            </h2>
            {renderCircles(selectedLeague)}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Country name -> ISO Alpha-2 code
 */
function countryNameToCode(name: string): string {
  const mapping: Record<string, string> = {
    Afghanistan: "AF",
    Albania: "AL",
    Algeria: "DZ",
    Andorra: "AD",
    Angola: "AO",
    "Antigua and Barbuda": "AG",
    Argentina: "AR",
    Armenia: "AM",
    Australia: "AU",
    Austria: "AT",
    Azerbaijan: "AZ",
    Bahamas: "BS",
    Bahrain: "BH",
    Bangladesh: "BD",
    Barbados: "BB",
    Belarus: "BY",
    Belgium: "BE",
    Belize: "BZ",
    Benin: "BJ",
    Bermuda: "BM",
    Bhutan: "BT",
    Bolivia: "BO",
    "Bosnia & Herzegovina": "BA",
    Botswana: "BW",
    Brazil: "BR",
    Brunei: "BN",
    Bulgaria: "BG",
    "Burkina Faso": "BF",
    Burundi: "BI",
    Cambodia: "KH",
    Cameroon: "CM",
    Canada: "CA",
    "Cape Verde": "CV",
    "Central African Republic": "CF",
    Chad: "TD",
    Chile: "CL",
    China: "CN",
    Colombia: "CO",
    Comoros: "KM",
    "Congo Republic": "CG",
    "DR Congo": "CD",
    "Costa Rica": "CR",
    Croatia: "HR",
    Cuba: "CU",
    Cyprus: "CY",
    Czechia: "CZ",
    Denmark: "DK",
    Djibouti: "DJ",
    Dominica: "DM",
    "Dominican Republic": "DO",
    Ecuador: "EC",
    Egypt: "EG",
    "El Salvador": "SV",
    England: "GB",
    "Equatorial Guinea": "GQ",
    Eritrea: "ER",
    Estonia: "EE",
    Eswatini: "SZ",
    Ethiopia: "ET",
    Fiji: "FJ",
    Finland: "FI",
    France: "FR",
    Gabon: "GA",
    Gambia: "GM",
    Georgia: "GE",
    Germany: "DE",
    Ghana: "GH",
    Greece: "GR",
    Guatemala: "GT",
    Guinea: "GN",
    "Guinea-Bissau": "GW",
    Guyana: "GY",
    Haiti: "HT",
    Honduras: "HN",
    Hungary: "HU",
    Iceland: "IS",
    India: "IN",
    Indonesia: "ID",
    Iran: "IR",
    Iraq: "IQ",
    Ireland: "IE",
    Israel: "IL",
    Italy: "IT",
    "Ivory Coast": "CI",
    Jamaica: "JM",
    Japan: "JP",
    Jordan: "JO",
    Kazakhstan: "KZ",
    Kenya: "KE",
    Kosovo: "XK",
    Kuwait: "KW",
    Kyrgyzstan: "KG",
    Laos: "LA",
    Latvia: "LV",
    Lebanon: "LB",
    Lithuania: "LT",
    Luxembourg: "LU",
    Madagascar: "MG",
    Malawi: "MW",
    Malaysia: "MY",
    Maldives: "MV",
    Mali: "ML",
    Malta: "MT",
    Mauritania: "MR",
    Mauritius: "MU",
    Mexico: "MX",
    Moldova: "MD",
    Monaco: "MC",
    Mongolia: "MN",
    Montenegro: "ME",
    Morocco: "MA",
    Mozambique: "MZ",
    Namibia: "NA",
    Nepal: "NP",
    Netherlands: "NL",
    "New Zealand": "NZ",
    Nicaragua: "NI",
    Niger: "NE",
    Nigeria: "NG",
    "North Macedonia": "MK",
    Norway: "NO",
    Oman: "OM",
    Pakistan: "PK",
    Palestine: "PS",
    Panama: "PA",
    Paraguay: "PY",
    Peru: "PE",
    Philippines: "PH",
    Poland: "PL",
    Portugal: "PT",
    Qatar: "QA",
    Romania: "RO",
    Russia: "RU",
    Rwanda: "RW",
    "San Marino": "SM",
    "Saudi Arabia": "SA",
    Senegal: "SN",
    Serbia: "RS",
    Singapore: "SG",
    Slovakia: "SK",
    Slovenia: "SI",
    Somalia: "SO",
    "South Africa": "ZA",
    "South Korea": "KR",
    Spain: "ES",
    Sudan: "SD",
    Suriname: "SR",
    Sweden: "SE",
    Switzerland: "CH",
    Syria: "SY",
    Taiwan: "TW",
    Tajikistan: "TJ",
    Tanzania: "TZ",
    Thailand: "TH",
    Togo: "TG",
    Trinidad: "TT",
    Tunisia: "TN",
    Türkiye: "TR",
    Uganda: "UG",
    Ukraine: "UA",
    "United Arab Emirates": "AE",
    USA: "US",
    Uruguay: "UY",
    Uzbekistan: "UZ",
    Venezuela: "VE",
    Vietnam: "VN",
    Yemen: "YE",
    Zambia: "ZM",
    Zimbabwe: "ZW",
    Wales: "GB",
    "Northern Ireland": "GB",
    "Côte d&apos;Ivoire": "CI", "Bosnia &amp; Herzegovina": "BA", "Faroe Islands": "FO", "Saint Kitts &amp; Nevis": "KN", "Saint Vincent and the Grenadines": "VC", Aruba: "AW", "Cayman Islands": "KY", Curacao: "CW", "Hong Kong": "HK", Macao: "MO", "Puerto Rico": "PR", "Réunion": "RE", "Saint Lucia": "LC", "Saint Martin": "SX", "Turks and Caicos": "TC", "U.S. Virgin Islands": "VI",Scotland:"GB", "Chinese Taipei":"TW",
    "South Sudan":"SS", "East Timor":"TL", Martinique:"MQ", Liberia: "LR", Libya: "LY", "Sierra Leone": "SL", "Congo": "CG", "Guinea Bissau": "GW", "Antigua & Barbuda": "AG", "St. Vincent & the Grenadines": "VC",
    Vanuatu:"VU", Turkmenistan:"TM", "Trinidad and Tobago":"TT",Guadeloupe:"GP", "Gibraltar":"GI",
    "Sao Tome and Principe":"ST", Myanmar: "MM", "Saint Kitts and Nevis":"KN",Lesotho:"LS","Solomon Islands":"SB",
    Tuvalu:"TV","Papua New Guinea":"PG", "Sri Lanka": "LK","New Caledonia":"NC", "North Korea": "KP"
    ,"Grenada":"GD", "French Guiana":"GF"
  };
  return mapping[name] || "UN";
}