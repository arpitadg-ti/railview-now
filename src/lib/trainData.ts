// Mock train data for Indian Railways
export const mockTrains = [
  {
    train_number: "12321",
    train_name: "Kolkata Mail",
    from_station: "Howrah Junction",
    to_station: "New Delhi",
    current_station: "Kanpur Central",
    next_station: "Aligarh Junction",
    current_lat: 26.4499,
    current_lng: 80.3319,
    delay_minutes: 15,
    status: "delayed",
    route: [
      { station_name: "Howrah Junction", station_code: "HWH", arrival_time: null, departure_time: "06:35", distance_km: 0, platform: "9", sequence_number: 1 },
      { station_name: "Asansol Junction", station_code: "ASN", arrival_time: "08:50", departure_time: "08:55", distance_km: 213, platform: "3", sequence_number: 2 },
      { station_name: "Dhanbad Junction", station_code: "DHN", arrival_time: "10:10", departure_time: "10:15", distance_km: 326, platform: "2", sequence_number: 3 },
      { station_name: "Gaya Junction", station_code: "GAYA", arrival_time: "12:15", departure_time: "12:20", distance_km: 473, platform: "1", sequence_number: 4 },
      { station_name: "Mughalsarai Junction", station_code: "MGS", arrival_time: "14:30", departure_time: "14:40", distance_km: 602, platform: "5", sequence_number: 5 },
      { station_name: "Allahabad Junction", station_code: "ALD", arrival_time: "16:25", departure_time: "16:30", distance_km: 730, platform: "4", sequence_number: 6 },
      { station_name: "Kanpur Central", station_code: "CNB", arrival_time: "19:05", departure_time: "19:15", distance_km: 926, platform: "6", sequence_number: 7 },
      { station_name: "Aligarh Junction", station_code: "ALJN", arrival_time: "22:50", departure_time: "22:52", distance_km: 1170, platform: "2", sequence_number: 8 },
      { station_name: "New Delhi", station_code: "NDLS", arrival_time: "01:15", departure_time: null, distance_km: 1441, platform: "7", sequence_number: 9 }
    ]
  },
  {
    train_number: "12833",
    train_name: "Howrah Express",
    from_station: "Ahmedabad Junction",
    to_station: "Howrah Junction",
    current_station: "Raipur Junction",
    next_station: "Bilaspur Junction",
    current_lat: 21.2514,
    current_lng: 81.6296,
    delay_minutes: 0,
    status: "on-time",
    route: [
      { station_name: "Ahmedabad Junction", station_code: "ADI", arrival_time: null, departure_time: "19:50", distance_km: 0, platform: "5", sequence_number: 1 },
      { station_name: "Vadodara Junction", station_code: "BRC", arrival_time: "21:20", departure_time: "21:25", distance_km: 102, platform: "4", sequence_number: 2 },
      { station_name: "Surat", station_code: "ST", arrival_time: "23:10", departure_time: "23:15", distance_km: 264, platform: "2", sequence_number: 3 },
      { station_name: "Nagpur Junction", station_code: "NGP", arrival_time: "09:45", departure_time: "09:55", distance_km: 920, platform: "3", sequence_number: 4 },
      { station_name: "Raipur Junction", station_code: "R", arrival_time: "14:30", departure_time: "14:40", distance_km: 1210, platform: "1", sequence_number: 5 },
      { station_name: "Bilaspur Junction", station_code: "BSP", arrival_time: "16:35", departure_time: "16:45", distance_km: 1330, platform: "5", sequence_number: 6 },
      { station_name: "Jharsuguda Junction", station_code: "JSG", arrival_time: "20:05", departure_time: "20:10", distance_km: 1560, platform: "2", sequence_number: 7 },
      { station_name: "Rourkela Junction", station_code: "ROU", arrival_time: "21:20", departure_time: "21:25", distance_km: 1640, platform: "4", sequence_number: 8 },
      { station_name: "Howrah Junction", station_code: "HWH", arrival_time: "04:40", departure_time: null, distance_km: 2020, platform: "8", sequence_number: 9 }
    ]
  },
  {
    train_number: "12302",
    train_name: "Rajdhani Express",
    from_station: "New Delhi",
    to_station: "Howrah Junction",
    current_station: "Patna Junction",
    next_station: "Mokameh Junction",
    current_lat: 25.5941,
    current_lng: 85.1376,
    delay_minutes: 5,
    status: "delayed",
    route: [
      { station_name: "New Delhi", station_code: "NDLS", arrival_time: null, departure_time: "16:55", distance_km: 0, platform: "2", sequence_number: 1 },
      { station_name: "Kanpur Central", station_code: "CNB", arrival_time: "21:35", departure_time: "21:40", distance_km: 441, platform: "3", sequence_number: 2 },
      { station_name: "Allahabad Junction", station_code: "ALD", arrival_time: "23:48", departure_time: "23:50", distance_km: 637, platform: "6", sequence_number: 3 },
      { station_name: "Mughalsarai Junction", station_code: "MGS", arrival_time: "01:50", departure_time: "01:55", distance_km: 765, platform: "2", sequence_number: 4 },
      { station_name: "Patna Junction", station_code: "PNBE", arrival_time: "05:45", departure_time: "05:50", distance_km: 997, platform: "5", sequence_number: 5 },
      { station_name: "Mokameh Junction", station_code: "MKA", arrival_time: "06:45", departure_time: "06:47", distance_km: 1080, platform: "1", sequence_number: 6 },
      { station_name: "Howrah Junction", station_code: "HWH", arrival_time: "10:15", departure_time: null, distance_km: 1441, platform: "12", sequence_number: 7 }
    ]
  },
  {
    train_number: "12246",
    train_name: "Duronto Express",
    from_station: "Howrah Junction",
    to_station: "Mumbai Central",
    current_station: "Nagpur Junction",
    next_station: "Bhusawal Junction",
    current_lat: 21.1458,
    current_lng: 79.0882,
    delay_minutes: 0,
    status: "on-time",
    route: [
      { station_name: "Howrah Junction", station_code: "HWH", arrival_time: null, departure_time: "14:00", distance_km: 0, platform: "14", sequence_number: 1 },
      { station_name: "Rourkela Junction", station_code: "ROU", arrival_time: "19:10", departure_time: "19:15", distance_km: 374, platform: "3", sequence_number: 2 },
      { station_name: "Jharsuguda Junction", station_code: "JSG", arrival_time: "20:25", departure_time: "20:27", distance_km: 454, platform: "2", sequence_number: 3 },
      { station_name: "Raipur Junction", station_code: "R", arrival_time: "00:05", departure_time: "00:10", distance_km: 810, platform: "4", sequence_number: 4 },
      { station_name: "Nagpur Junction", station_code: "NGP", arrival_time: "04:45", departure_time: "04:55", distance_km: 1110, platform: "6", sequence_number: 5 },
      { station_name: "Bhusawal Junction", station_code: "BSL", arrival_time: "09:00", departure_time: "09:05", distance_km: 1430, platform: "1", sequence_number: 6 },
      { station_name: "Mumbai Central", station_code: "BCT", arrival_time: "14:50", departure_time: null, distance_km: 1840, platform: "9", sequence_number: 7 }
    ]
  },
  {
    train_number: "12951",
    train_name: "Mumbai Rajdhani",
    from_station: "Mumbai Central",
    to_station: "New Delhi",
    current_station: "Vadodara Junction",
    next_station: "Ratlam Junction",
    current_lat: 22.3072,
    current_lng: 73.1812,
    delay_minutes: 10,
    status: "delayed",
    route: [
      { station_name: "Mumbai Central", station_code: "BCT", arrival_time: null, departure_time: "16:40", distance_km: 0, platform: "7", sequence_number: 1 },
      { station_name: "Surat", station_code: "ST", arrival_time: "20:20", departure_time: "20:25", distance_km: 263, platform: "5", sequence_number: 2 },
      { station_name: "Vadodara Junction", station_code: "BRC", arrival_time: "22:10", departure_time: "22:15", distance_km: 394, platform: "2", sequence_number: 3 },
      { station_name: "Ratlam Junction", station_code: "RTM", arrival_time: "01:30", departure_time: "01:35", distance_km: 656, platform: "4", sequence_number: 4 },
      { station_name: "Kota Junction", station_code: "KOTA", arrival_time: "04:40", departure_time: "04:45", distance_km: 905, platform: "3", sequence_number: 5 },
      { station_name: "Mathura Junction", station_code: "MTJ", arrival_time: "08:30", departure_time: "08:32", distance_km: 1252, platform: "6", sequence_number: 6 },
      { station_name: "New Delhi", station_code: "NDLS", arrival_time: "10:10", departure_time: null, distance_km: 1384, platform: "11", sequence_number: 7 }
    ]
  },
  {
    train_number: "30311",
    train_name: "Sealdah-Naihati Local",
    from_station: "Sealdah",
    to_station: "Naihati",
    current_station: "Dum Dum Junction",
    next_station: "Belgharia",
    current_lat: 22.6277,
    current_lng: 88.4171,
    delay_minutes: 0,
    status: "on-time",
    route: [
      { station_name: "Sealdah", station_code: "SDAH", arrival_time: null, departure_time: "08:15", distance_km: 0, platform: "12", sequence_number: 1 },
      { station_name: "Dum Dum Junction", station_code: "DDJ", arrival_time: "08:28", departure_time: "08:30", distance_km: 8, platform: "2", sequence_number: 2 },
      { station_name: "Belgharia", station_code: "BLH", arrival_time: "08:35", departure_time: "08:36", distance_km: 11, platform: "1", sequence_number: 3 },
      { station_name: "Agarpara", station_code: "AGP", arrival_time: "08:41", departure_time: "08:42", distance_km: 14, platform: "1", sequence_number: 4 },
      { station_name: "Sodpur", station_code: "SEP", arrival_time: "08:47", departure_time: "08:48", distance_km: 17, platform: "2", sequence_number: 5 },
      { station_name: "Khardaha", station_code: "KHA", arrival_time: "08:53", departure_time: "08:54", distance_km: 21, platform: "1", sequence_number: 6 },
      { station_name: "Halisahar", station_code: "HLS", arrival_time: "09:00", departure_time: "09:01", distance_km: 25, platform: "1", sequence_number: 7 },
      { station_name: "Naihati", station_code: "NH", arrival_time: "09:08", departure_time: null, distance_km: 30, platform: "3", sequence_number: 8 }
    ]
  },
  {
    train_number: "30411",
    train_name: "Howrah-Bandel Local",
    from_station: "Howrah Junction",
    to_station: "Bandel Junction",
    current_station: "Bally",
    next_station: "Belur",
    current_lat: 22.6533,
    current_lng: 88.3396,
    delay_minutes: 2,
    status: "delayed",
    route: [
      { station_name: "Howrah Junction", station_code: "HWH", arrival_time: null, departure_time: "09:00", distance_km: 0, platform: "18", sequence_number: 1 },
      { station_name: "Bally", station_code: "BLY", arrival_time: "09:07", departure_time: "09:08", distance_km: 4, platform: "1", sequence_number: 2 },
      { station_name: "Belur", station_code: "BEQ", arrival_time: "09:12", departure_time: "09:13", distance_km: 7, platform: "1", sequence_number: 3 },
      { station_name: "Liluah", station_code: "LLH", arrival_time: "09:18", departure_time: "09:19", distance_km: 10, platform: "2", sequence_number: 4 },
      { station_name: "Naihati", station_code: "NH", arrival_time: "09:35", departure_time: "09:36", distance_km: 28, platform: "4", sequence_number: 5 },
      { station_name: "Bandel Junction", station_code: "BDC", arrival_time: "09:55", departure_time: null, distance_km: 42, platform: "2", sequence_number: 6 }
    ]
  },
  {
    train_number: "34711",
    train_name: "Sealdah-Diamond Harbor Local",
    from_station: "Sealdah",
    to_station: "Diamond Harbor",
    current_station: "Ballygunge Junction",
    next_station: "Park Circus",
    current_lat: 22.5326,
    current_lng: 88.3657,
    delay_minutes: 0,
    status: "on-time",
    route: [
      { station_name: "Sealdah", station_code: "SDAH", arrival_time: null, departure_time: "10:30", distance_km: 0, platform: "9", sequence_number: 1 },
      { station_name: "Ballygunge Junction", station_code: "BGB", arrival_time: "10:38", departure_time: "10:39", distance_km: 5, platform: "3", sequence_number: 2 },
      { station_name: "Park Circus", station_code: "PQS", arrival_time: "10:42", departure_time: "10:43", distance_km: 7, platform: "1", sequence_number: 3 },
      { station_name: "Majerhat", station_code: "MJT", arrival_time: "10:50", departure_time: "10:51", distance_km: 11, platform: "2", sequence_number: 4 },
      { station_name: "Sonarpur Junction", station_code: "SPR", arrival_time: "11:10", departure_time: "11:11", distance_km: 25, platform: "1", sequence_number: 5 },
      { station_name: "Diamond Harbor", station_code: "DHH", arrival_time: "12:05", departure_time: null, distance_km: 53, platform: "1", sequence_number: 6 }
    ]
  }
];
