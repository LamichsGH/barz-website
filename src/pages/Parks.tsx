import React from 'react';
import { MapPin, Star, Filter, Clock, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, X, Map, Search, Loader2 } from 'lucide-react';
import { getDistance } from 'geolib';
import Fuse from 'fuse.js';

interface Coordinates {
  latitude: number;
  longitude: number;
}

export default function Parks() {
  const [selectedAreas, setSelectedAreas] = React.useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = React.useState<number[]>([]);
  const [currentImageIndexes, setCurrentImageIndexes] = React.useState<{ [key: string]: number }>({});
  const [sortBy, setSortBy] = React.useState<'rating' | 'name' | 'distance'>('rating');
  const [expandedRatings, setExpandedRatings] = React.useState<{ [key: string]: boolean }>({});
  const [viewMode, setViewMode] = React.useState<'list' | 'map'>('list');
  const [postcode, setPostcode] = React.useState('');
  const [userCoords, setUserCoords] = React.useState<Coordinates | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isSearching, setIsSearching] = React.useState(false);

  // UK postcode validation regex
  const ukPostcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;

  // Function to format postcode with proper spacing
  const formatPostcode = (postcode: string): string => {
    const clean = postcode.toUpperCase().replace(/[^A-Z0-9]/g, '');
    return clean.length > 3 ? `${clean.slice(0, -3)} ${clean.slice(-3)}` : clean;
  };

  // Function to validate postcode format
  const isValidPostcodeFormat = (postcode: string): boolean => {
    return ukPostcodeRegex.test(postcode.toUpperCase());
  };

  // Function to fetch coordinates from postcode
  const fetchPostcodeCoords = async (postcode: string) => {
    try {
      setIsSearching(true);
      setError(null);
      const cleanPostcode = formatPostcode(postcode);
      const response = await fetch(`https://api.postcodes.io/postcodes/${cleanPostcode}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok || !data.result) {
        throw new Error('Postcode not found. Please check and try again.');
      }

      setUserCoords({
        latitude: data.result.latitude,
        longitude: data.result.longitude
      });
      setSortBy('distance');
      setError(null);
    } catch (err) {
      setError((err as Error).message || 'Please enter a valid UK postcode');
      setUserCoords(null);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle postcode input changes
  const handlePostcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPostcode(value);
    setError(null);
  };

  // Calculate distance between two points
  const calculateDistance = (park: typeof parks[keyof typeof parks][0]) => {
    if (!userCoords || !park.coordinates) return Infinity;

    return getDistance(
      { latitude: userCoords.latitude, longitude: userCoords.longitude },
      { latitude: park.coordinates.latitude, longitude: park.coordinates.longitude }
    );
  };

  const handleImageChange = (parkName: string, direction: 'next' | 'prev') => {
    setCurrentImageIndexes(prev => {
      const currentIndex = prev[parkName] || 0;
      const park = Object.values(parks).flat().find(p => p.name === parkName);
      const totalImages = park?.images?.length || 1;
      
      let newIndex;
      if (direction === 'next') {
        newIndex = (currentIndex + 1) % totalImages;
      } else {
        newIndex = (currentIndex - 1 + totalImages) % totalImages;
      }
      
      return { ...prev, [parkName]: newIndex };
    });
  };

  const handleAreaToggle = (areaId: string) => {
    setSelectedAreas(prev => 
      prev.includes(areaId)
        ? prev.filter(a => a !== areaId)
        : [...prev, areaId]
    );
  };

  const handleRatingToggle = (rating: number) => {
    setSelectedRatings(prev => 
      prev.includes(rating)
        ? prev.filter(r => r !== rating)
        : [...prev, rating]
    );
  };

  const clearFilters = () => {
    setSelectedRatings([]);
    setSelectedAreas([]);
    setUserCoords(null);
    setPostcode('');
    setSortBy('rating');
    setError(null);
  };

  const areas = [
    { id: 'central', name: 'CENTRAL LONDON' },
    { id: 'north', name: 'NORTH LONDON' },
    { id: 'south', name: 'SOUTH LONDON' },
    { id: 'east', name: 'EAST LONDON' },
    { id: 'west', name: 'WEST LONDON' }
  ];

  const getAllParks = () => {
    if (selectedAreas.length === 0) {
      return Object.values(parks).flat();
    }
    return selectedAreas.flatMap(area => parks[area as keyof typeof parks] || []);
  };

  const parks = {
    central: [
      {
        name: "TGO OUTDOOR GYM",
        coordinates: { latitude: 51.5205215, longitude: -0.1212977 },
        address: "Old Gloucester St, London WC1N 3BP",
        equipment: ["Pull-up Bars", "Parallel Bars", "Dip Bars"],
        difficulty: "All Levels",
        rating: 4.0,
        hours: "24/7",
        description: "Modern outdoor gym with essential calisthenics equipment in a central location.",
        url: "https://calisthenics-parks.com/spots/25674-en-london-outdoor-exercise-gym-old-gloucester-street",
        mapsUrl: "https://www.google.com/maps/place/TGO+Outdoor+Gym/@51.5205248,-0.1238726,17z/data=!3m1!4b1!4m6!3m5!1s0x48761b369b896c4d:0x59c0b58a21d40880!8m2!3d51.5205215!4d-0.1212977!16s%2Fg%2F11c555195g?entry=ttu&g_ep=EgoyMDI1MDQwOS4wIKXMDSoASAFQAw%3D%3D",
        images: ["https://i.imgur.com/GyGEznY.jpeg"]
      },
      {
        name: "EXERCISE EQUIPMENT LONDON",
        coordinates: { latitude: 51.527726, longitude: -0.123391 },
        address: "Wakefield Mews, Camden, London, WC1H 8BZ",
        equipment: ["Pull-up Bars", "Parallel Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Basic outdoor fitness equipment near Camden area.",
        url: "https://calisthenics-parks.com/spots/29815-en-calisthenics-facility-london-exercise-equipment-london",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=Wakefield+Mews+Camden+London+WC1H+8BZ",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OLD GLOUCESTER STREET OUTDOOR GYM",
        coordinates: { latitude: 51.520477, longitude: -0.121109 },
        address: "48 Old Gloucester Street, Camden, London, WC1N 3BT",
        equipment: ["Pull-up Bars", "Parallel Bars", "Monkey Bars", "Wall Bars", "Push-up Bars"],
        difficulty: "All Levels",
        rating: 4.0,
        hours: "24/7",
        description: "Well-equipped exercise park with comprehensive calisthenics equipment.",
        url: "https://calisthenics-parks.com/spots/25674-en-exercise-park-london-old-gloucester-street-outdoor-gym",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=48+Old+Gloucester+Street+Camden+London+WC1N+3BT",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR FITNESS SPA FIELDS",
        coordinates: { latitude: 51.525452, longitude: -0.108347 },
        address: "38 Northampton Road, Clerkenwell, London, EC1R 0DF",
        equipment: ["Parallel Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Basic outdoor fitness facility in Spa Fields with parallel bars.",
        url: "https://calisthenics-parks.com/spots/16087-en-calisthenics-facility-london-outdoor-fitness-spa-fields",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=38+Northampton+Road+Clerkenwell+London+EC1R+0DF",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR FITNESS SPOT LONDON",
        coordinates: { latitude: 51.520525, longitude: -0.12017 },
        address: "40 New North Street, Holborn and Covent Garden, London, WC1N 3PH",
        equipment: ["Pull-up Bars", "Dip Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Small outdoor fitness spot near Holborn.",
        url: "https://calisthenics-parks.com/spots/17742-en-calisthenics-facility-london-outdoor-fitness-spot-london",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=40+New+North+Street+Holborn+London+WC1N+3PH",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR GYM - EMBANKMENT",
        coordinates: { latitude: 51.50739, longitude: -0.122036 },
        address: "1 Victoria Embankment, Westminster, London, WC2N 6PA",
        equipment: ["Pull-up Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Pull-up bars along Victoria Embankment for outdoor training.",
        url: "https://calisthenics-parks.com/spots/25975-en-outdoor-pull-up-bars-london-victoria-embankment-pull-up-bars",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=1+Victoria+Embankment+Westminster+London+WC2N+6PA",
        images: ["https://i.imgur.com/Ve54aox.png"]
      }
    ],
    north: [
      {
        name: "PRIMROSE HILL – STREET WORKOUT PARK",
        coordinates: { latitude: 51.5369682, longitude: -0.157952 },
        address: "133 Prince Albert Road, Camden Town, London, NW8 7LS",
        equipment: ["Pull-up Bars", "Parallel Bars", "Rings"],
        difficulty: "All Levels",
        rating: 4.0,
        hours: "24/7",
        description: "Well-equipped outdoor workout area with pull-up bars, parallel bars, rings, and more. Popular for calisthenics and bodyweight training. Clean and maintained, though some bars may be slippery.",
        url: "https://calisthenics-parks.com/spots/277-en-street-workout-park-london-at-primrose-hill",
        mapsUrl: "https://www.google.co.uk/maps/place/Primrose+Hill+Trim+Trail/@51.5369715,-0.1605269,17z/data=!3m1!4b1!4m6!3m5!1s0x48761ae9ec4b1049:0x56300b921547d9da!8m2!3d51.5369682!4d-0.157952!16s%2Fg%2F11c6z15s5m?entry=ttu&g_ep=EgoyMDI1MDQwOS4wIKXMDSoJLDEwMjExNjQwSAFQAw%3D%3D",
        images: ["https://i.imgur.com/ZU4fbqA.jpeg", "https://i.imgur.com/wSVRC07.jpeg", "https://i.imgur.com/qm5gdgQ.jpeg", "https://i.imgur.com/MNphDCh.jpeg"]
      },
      {
        name: "ELTHORNE PARK",
        coordinates: { latitude: 51.5617, longitude: -0.1277 },
        address: "Outdoor Gym, 17 Hazellville Rd, London N19 3NF",
        equipment: ["Pull-up Bars", "Monkey Bars", "Dip Bars", "Parallel Bars"],
        difficulty: "All Levels",
        rating: 3.0,
        hours: "24/7",
        description: "Well-equipped calisthenics setup with soft flooring in a spacious green park.",
        url: "https://calisthenics-parks.com/spots/4475-en-london-outdoor-exercise-gym-elthorne-park",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=Outdoor+Gym+17+Hazellville+Rd+London+N19+3NF",
        images: ["https://i.imgur.com/1OAhuiu.jpg"]
      },
      {
        name: "BARNARD PARK EXERCISE EQUIPMENT",
        coordinates: { latitude: 51.537676, longitude: -0.113551 },
        address: "24 Hemingford Road, Islington, London, N1 0JU",
        equipment: ["Pull-up Bars", "Parallel Bars"],
        difficulty: "All Levels",
        rating: 4.0,
        hours: "24/7",
        description: "Quality outdoor gym equipment in Barnard Park, Islington.",
        url: "https://calisthenics-parks.com/spots/31166-en-outdoor-gym-london-barnard-park-exercise-equipment",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=24+Hemingford+Road+Islington+London+N1+0JU",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "BODYWEIGHT FITNESS",
        coordinates: { latitude: 51.547214, longitude: -0.132425 },
        address: "Pandian Way, Cantelowes, London, NW1 9AE",
        equipment: ["Pull-up Bars", "Dip Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Basic bodyweight fitness equipment for calisthenics workouts.",
        url: "https://calisthenics-parks.com/spots/10837-en-bodyweight-fitness-london-calisthenics-workout",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=Pandian+Way+Cantelowes+London+NW1+9AE",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "BUTTERFIELD GREEN, STOKE NEWINGTON",
        coordinates: { latitude: 51.555207, longitude: -0.082214 },
        address: "80 Milton Grove, Clissold, London, N16 8TH",
        equipment: ["Pull-up Bars", "Parallel Bars", "Monkey Bars", "Push-up Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Exercise stations at Butterfield Green with various equipment.",
        url: "https://calisthenics-parks.com/spots/7485-en-london-exercise-stations-butterfield-green-stoke-newington",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=80+Milton+Grove+Clissold+London+N16+8TH",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "CALEDONIAN PARK EXERCISE EQUIPMENT",
        coordinates: { latitude: 51.547402, longitude: -0.124514 },
        address: "120 Clock View Crescent, Islington, London, N7 9GP",
        equipment: ["Push-up Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Basic exercise equipment in Caledonian Park.",
        url: "https://calisthenics-parks.com/spots/31405-en-outdoor-gym-london-caledonian-park-exercise-equipment",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=120+Clock+View+Crescent+Islington+London+N7+9GP",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "CALISTHENICS EQUIPMENT - RUSSELL PARK",
        coordinates: { latitude: 51.594673, longitude: -0.097561 },
        address: "91 Willingdon Road, Noel Park, London, N22 6SE",
        equipment: ["Parallel Bars", "Push-up Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Calisthenics equipment at Russell Park with basic setup.",
        url: "https://calisthenics-parks.com/spots/2410-en-london-calisthenics-equipment-russell-park",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=91+Willingdon+Road+Noel+Park+London+N22+6SE",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "CALISTHENICS PARK - KILBURN GRANGE PARK",
        coordinates: { latitude: 51.544759, longitude: -0.198002 },
        address: "50 Palmerston Road, Kilburn, London, NW6 2JL",
        equipment: ["Parallel Bars", "Monkey Bars", "Wall Bars"],
        difficulty: "All Levels",
        rating: 4.0,
        hours: "24/7",
        description: "Excellent calisthenics park in Kilburn with varied equipment.",
        url: "https://calisthenics-parks.com/spots/2605-en-london-calisthenics-park-kilburn-grange-park",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=50+Palmerston+Road+Kilburn+London+NW6+2JL",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "EDMONTON (LONDON) - PARKOUR WORKOUT SPOT - RAYS ROAD",
        coordinates: { latitude: 51.615647, longitude: -0.050708 },
        address: "34 Rays Road, Edmonton, London, N18 2NX",
        equipment: ["Pull-up Bars", "Push-up Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Parkour and calisthenics workout spot on Rays Road.",
        url: "https://calisthenics-parks.com/spots/2504-en-edmonton-london-parkour-workout-spot-rays-road",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=34+Rays+Road+Edmonton+London+N18+2NX",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "FITNESS TRAIL – HIGHGATE WOODS FITNESS TRAIL",
        coordinates: { latitude: 51.572, longitude: -0.145 },
        address: "197 Archway Road, Highgate, London, N6 4JD",
        equipment: ["Pull-up Bars", "Parallel Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Fitness trail through Highgate Woods with exercise stations.",
        url: "https://calisthenics-parks.com/spots/436-en-london-highgate-woods-trim-trail-fitness-trail",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=197+Archway+Road+Highgate+London+N6+4JD",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "FITNESS TRAIL – PARLIAMENT HILL FIELDS",
        coordinates: { latitude: 51.555876, longitude: -0.15707 },
        address: "67 Savernake Road, Highgate, London, NW3 2JP",
        equipment: ["Pull-up Bars", "Parallel Bars", "Monkey Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Fitness trail at Parliament Hill Fields with multiple exercise stations.",
        url: "https://calisthenics-parks.com/spots/439-en-london-fitness-trail-parliament-hill-fields",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=67+Savernake+Road+Highgate+London+NW3+2JP",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "FORTUNE GREEN PULL UP BARS",
        coordinates: { latitude: 51.554486, longitude: -0.198426 },
        address: "3 Ajax Road, Camden, London, NW6 1EF",
        equipment: ["Pull-up Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Simple pull-up bar installation at Fortune Green.",
        url: "https://calisthenics-parks.com/spots/29017-en-outdoor-gym-london-fortune-green-pull-up-bars",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=3+Ajax+Road+Camden+London+NW6+1EF",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "MAYGROVE PEACE PARK",
        coordinates: { latitude: 51.548215, longitude: -0.198197 },
        address: "112 Maygrove Road, Fortune Green, London, NW6 2EG",
        equipment: ["Pull-up Bars", "Parallel Bars", "Push-up Bars"],
        difficulty: "All Levels",
        rating: 3.0,
        hours: "24/7",
        description: "Exercise stations at Maygrove Peace Park with good equipment variety.",
        url: "https://calisthenics-parks.com/spots/7597-en-london-exercise-stations-maygrove-peace-park",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=112+Maygrove+Road+Fortune+Green+London+NW6+2EG",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "MONTROSE PARK OUTSIDE GYM",
        coordinates: { latitude: 51.599553, longitude: -0.254746 },
        address: "181 Booth Road, Barnet, London, NW9 5JX",
        equipment: ["Pull-up Bars", "Dip Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Outdoor gym at Montrose Park with calisthenics equipment.",
        url: "https://calisthenics-parks.com/spots/28620-en-outdoor-pull-up-bars-london-montrose-park-outside-gym-calisthenics-involved",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=181+Booth+Road+Barnet+London+NW9+5JX",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "NEASDEN BRENT RESERVOIR OUTDOOR GYM",
        coordinates: { latitude: 51.565162, longitude: -0.249657 },
        address: "49 Aboyne Road, Welsh Harp, London, NW2 7QH",
        equipment: ["Pull-up Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Exercise park near Brent Reservoir with pull-up bars.",
        url: "https://calisthenics-parks.com/spots/7280-en-london-exercise-park-neasden-brent-reservoir-outdoor-gym",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=49+Aboyne+Road+Welsh+Harp+London+NW2+7QH",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR FITNESS PYMMES PARK",
        coordinates: { latitude: 51.617885, longitude: -0.072395 },
        address: "7 Sweet Briar Walk, Edmonton, London, N18 1RU",
        equipment: ["Pull-up Bars", "Parallel Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Fitness facility at Pymmes Park for outdoor workouts.",
        url: "https://calisthenics-parks.com/spots/9053-en-fitness-facility-london-outdoor-fitness-pymmes-park",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=7+Sweet+Briar+Walk+Edmonton+London+N18+1RU",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR FITNESS ROE GREEN PARK",
        coordinates: { latitude: 51.584609, longitude: -0.27062 },
        address: "347 Kingsbury Road, Fryent, London, NW9 9NE",
        equipment: ["Pull-up Bars", "Push-up Bars", "Dip Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Exercise park at Roe Green Park with various fitness equipment.",
        url: "https://calisthenics-parks.com/spots/9516-en-exercise-park-london-outdoor-fitness-roe-green-park",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=347+Kingsbury+Road+Fryent+London+NW9+9NE",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR GYM - QUEENS PARK",
        coordinates: { latitude: 51.533858, longitude: -0.208454 },
        address: "53 Harvist Road, Queens Park, London, NW6 6EY",
        equipment: ["Pull-up Bars", "Parallel Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Outdoor gym equipment at Queens Park.",
        url: "https://calisthenics-parks.com/spots/440-en-london-queens-park-fitnesspark-uk",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=53+Harvist+Road+Queens+Park+London+NW6+6EY",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR GYM ROSEMARYS GARDEN LONDON",
        coordinates: { latitude: 51.538843, longitude: -0.088987 },
        address: "6 Sherborne Street, Canonbury, London, N1 3FJ",
        equipment: ["Pull-up Bars", "Dip Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Small outdoor gym setup at Rosemary's Garden.",
        url: "https://calisthenics-parks.com/spots/10933-en-bodyweight-training-london-calisthenics-workout",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=6+Sherborne+Street+Canonbury+London+N1+3FJ",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR GYM WEST HACKNEY RECREATIONAL GROUND",
        coordinates: { latitude: 51.55672, longitude: -0.071966 },
        address: "17 Evering Road, Stoke Newington, London, N16 7UQ",
        equipment: ["Pull-up Bars", "Parallel Bars", "Push-up Bars"],
        difficulty: "All Levels",
        rating: 3.0,
        hours: "24/7",
        description: "Workout station at West Hackney Recreational Ground.",
        url: "https://calisthenics-parks.com/spots/16435-en-workout-station-london-outdoor-gym-west-hackney-recreational-ground",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=17+Evering+Road+Stoke+Newington+London+N16+7UQ",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR GYM.- LORDSHIP RECREATION GROUND",
        coordinates: { latitude: 51.591977, longitude: -0.08663 },
        address: "Higham Road, West Green, London, N17 6NS",
        equipment: ["Pull-up Bars", "Parallel Bars", "Push-up Bars"],
        difficulty: "All Levels",
        rating: 3.0,
        hours: "24/7",
        description: "Outdoor gym at Lordship Recreation Ground with good equipment.",
        url: "https://calisthenics-parks.com/spots/5955-en-london-outdoor-gym-lordship-recreation-ground",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=Higham+Road+West+Green+London+N17+6NS",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "POLYGON PARK OUTDOOR GYM",
        coordinates: { latitude: 51.531923, longitude: -0.131667 },
        address: "114 Polygon Road, Camden, London, NW1 1EP",
        equipment: ["Pull-up Bars", "Parallel Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Exercise park at Polygon Park.",
        url: "https://calisthenics-parks.com/spots/19037-en-exercise-park-london-polygon-park-outdoor-gym",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=114+Polygon+Road+Camden+London+NW1+1EP",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "PUBLIC EXERCISE HORIZONTAL ROW OF BARS",
        coordinates: { latitude: 51.545512, longitude: -0.10926 },
        address: "23 Arundel Square, Islington, London, N7 8AT",
        equipment: ["Pull-up Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Public exercise area with horizontal bars for pull-ups.",
        url: "https://calisthenics-parks.com/spots/28465-en-exercise-park-london-public-excersisee-horizontal-row-of-bars",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=23+Arundel+Square+Islington+London+N7+8AT",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "SHOREDITCH PARK OUTDOOR GYM",
        coordinates: { latitude: 51.535024, longitude: -0.085831 },
        address: "19-21 Bridport Place, Hackney, London, N1 5JN",
        equipment: ["Pull-up Bars", "Monkey Bars", "Dip Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Exercise park at Shoreditch Park with various equipment.",
        url: "https://calisthenics-parks.com/spots/27191-en-exercise-park-london-shoreditch-park-outdoor-gym",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=19-21+Bridport+Place+Hackney+London+N1+5JN",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "STEEL WARRIORS FINSBURY PARK",
        coordinates: { latitude: 51.574647, longitude: -0.103116 },
        address: "13 Endymion Road, Harringay, London, N4 1EE",
        equipment: ["Pull-up Bars", "Parallel Bars", "Monkey Bars", "Wall Bars", "Push-up Bars"],
        difficulty: "All Levels",
        rating: 4.0,
        hours: "24/7",
        description: "Excellent calisthenics gym built by Steel Warriors with comprehensive equipment.",
        url: "https://calisthenics-parks.com/spots/15357-en-calisthenics-gym-london-steel-warriors-finsbury-park",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=13+Endymion+Road+Harringay+London+N4+1EE",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "WOOD GREEN COMMON OUTDOOR GYM",
        coordinates: { latitude: 51.597008, longitude: -0.116884 },
        address: "114 Station Road, Haringey, London, N22 7SX",
        equipment: ["Pull-up Bars", "Parallel Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Outdoor gym at Wood Green Common.",
        url: "https://calisthenics-parks.com/spots/31584-en-outdoor-gym-london-wood-green-common-outdoor-gym",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=114+Station+Road+Haringey+London+N22+7SX",
        images: ["https://i.imgur.com/Ve54aox.png"]
      }
    ],
    south: [
      {
        name: "SLADE GARDENS – CALISTHENICS KENGURU.PRO PARK",
        coordinates: { latitude: 51.4710208, longitude: -0.1155952 },
        address: "3 Ingleborough St, London SW9 0DL",
        equipment: ["Pull-up Bars", "Parallel Bars"],
        difficulty: "All Levels",
        rating: 3.0,
        hours: "24/7",
        description: "Quiet outdoor gym with a basic setup of pull-up bars and parallel bars. Great for bodyweight workouts and peaceful sessions.",
        url: "https://calisthenics-parks.com/spots/1942-en-london-calisthenics-kengurupro-park-slade-gardens",
        mapsUrl: "https://www.google.co.uk/maps/place/SouthWest+Body+Workout/@51.4709899,-0.115706,18z/data=!4m15!1m8!3m7!1s0x48760460528921d3:0x46cdc3beb5c05fe3!2s3+Ingleborough+St,+London+SW9+0DL!3b1!8m2!3d51.4709838!4d-0.114575!16s%2Fg%2F11c5f3trsm!3m5!1s0x487604604da09679:0xf45027ac5d2f1511!8m2!3d51.4710208!4d-0.1155952!16s%2Fg%2F11f8llddpc?entry=ttu&g_ep=EgoyMDI1MDQwOS4wIKXMDSoJLDEwMjExNjQwSAFQAw%3D%3D",
        images: ["https://i.imgur.com/ZU4fbqA.jpeg", "https://i.imgur.com/wSVRC07.jpeg", "https://i.imgur.com/qm5gdgQ.jpeg", "https://i.imgur.com/MNphDCh.jpeg"]
      },
      {
        name: "KENNINGTON PARK – STREET WORKOUT PARK",
        coordinates: { latitude: 51.4842662, longitude: -0.1071077 },
        address: "651 St. Agnes Place, Oval, London, SE11 4AY",
        equipment: ["Pull-up Bars", "Parallel Bars", "Ab Benches", "Monkey Bars"],
        difficulty: "All Levels",
        rating: 4.0,
        hours: "24/7",
        description: "Premier calisthenics spot in London with Kenguru.PRO equipment. Popular community hub featuring high bars for muscle-ups and comprehensive training setup. Active community and regular meetups.",
        url: "https://calisthenics-parks.com/spots/278-en-street-workout-park-london-at-kennington-park",
        mapsUrl: "https://www.google.co.uk/maps/place/Kennington+Park+Outdoor+Exercise+Bars/@51.4842662,-0.10805,19z/data=!4m10!1m2!2m1!1sLondon+-+Street+Workout+Park+-+Kennington+Park!3m6!1s0x4876049039553bdb:0x9bac5a3360af4417!8m2!3d51.4842662!4d-0.1071077!15sCi5Mb25kb24gLSBTdHJlZXQgV29ya291dCBQYXJrIC0gS2VubmluZ3RvbiBQYXJrkgEDZ3lt4AEA!16s%2Fg%2F11f15h_wwp?entry=ttu&g_ep=EgoyMDI1MDQwOS4wIKXMDSoASAFQAw%3D%3D",
        images: ["https://i.imgur.com/NCue7dc.jpeg", "https://i.imgur.com/yd2Ffij.jpeg", "https://i.imgur.com/GXiabR1.jpeg"]
      },
      {
        name: "CALISTHENICS PARK – BROCKWELL PARK / BRIXTON",
        coordinates: { latitude: 51.4519, longitude: -0.1058 },
        address: "65 Dulwich Road, Herne Hill, London, SE24 0PB",
        equipment: ["Pull-up Bars", "Parallel Bars", "Dip Bars", "Monkey Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Basic calisthenics setup in Brockwell Park with standard equipment.",
        url: "https://calisthenics-parks.com/spots/435-en-london-calisthenics-park-brockwell-park-brixton",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=65+Dulwich+Road+London+SE24+0PB+United+Kingdom",
        images: ["https://i.imgur.com/7jz9oEk.jpeg", "https://i.imgur.com/RPdHGLN.jpeg"]
      },
      {
        name: "BRIXTON OUTDOOR PULL-UP BAR",
        coordinates: { latitude: 51.4647, longitude: -0.1132 },
        address: "9 Serenaders Rd Brixton, London SW9 7QP",
        equipment: ["Pull-up Bars"],
        difficulty: "Beginner",
        rating: 2.0,
        hours: "24/7",
        description: "Simple but sturdy pull-up station near Brixton center.",
        url: "https://calisthenics-parks.com/spots/1267-en-london-outdoor-pull-up-bar-brixton",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=9+Serenaders+Rd+Brixton+London+SW9+7QP",
        images: ["https://i.imgur.com/yBedgfl.jpeg"]
      },
      {
        name: "PECKHAM RYE PARK",
        coordinates: { latitude: 51.4605, longitude: -0.0659 },
        address: "Peckham Rye Outdooor Gym, London SE22 0SH",
        equipment: ["Pull-up Bars", "Push-up Bars", "Monkey Bars"],
        difficulty: "All Levels",
        rating: 3.0,
        hours: "24/7",
        description: "Peaceful workout spot in a leafy setting with varied equipment and good accessibility.",
        url: "https://calisthenics-parks.com/spots/3750-en-london-outdoor-gym-peckham-rye-park",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=FW5R%2B3V+Peckham+Rye+Outdooor+Gym+London+SE22+0SH",
        images: ["https://i.imgur.com/gaur4St.jpeg"]
      },
      {
        name: "AYELSBURY ESTATE OUTDOOR GYM",
        coordinates: { latitude: 51.485812, longitude: -0.086151 },
        address: "309 Inville Road, Southwark, London, SE17 2HX",
        equipment: ["Pull-up Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Exercise park at Ayelsbury Estate with pull-up bars.",
        url: "https://calisthenics-parks.com/spots/18616-en-exercise-park-london-ayelsbury-estate-outdoor-gym",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=309+Inville+Road+Southwark+London+SE17+2HX",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "BISHOP'S PARK OUTDOOR GYM",
        coordinates: { latitude: 51.472365, longitude: -0.217805 },
        address: "11 Bishop's Avenue, Hammersmith and Fulham, London, SW6 6DX",
        equipment: ["Pull-up Bars", "Parallel Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Trim trail at Bishop's Park with outdoor gym equipment.",
        url: "https://calisthenics-parks.com/spots/19231-en-trim-trail-london-bishops-park-outdoor-gym",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=11+Bishops+Avenue+Hammersmith+London+SW6+6DX",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "BLAKER COURT FREESTYLE CALISTHENICS",
        coordinates: { latitude: 51.477533, longitude: 0.031173 },
        address: "116 Fairlawn Court, Greenwich, London, SE7 7DT",
        equipment: ["Pull-up Bars", "Parallel Bars", "Monkey Bars", "Wall Bars"],
        difficulty: "All Levels",
        rating: 4.0,
        hours: "24/7",
        description: "Comprehensive calisthenics stations at Blaker Court with various equipment.",
        url: "https://calisthenics-parks.com/spots/28653-en-calisthenics-stations-london-blaker-court-freestyle-calisthenics-and-weights-apparatus",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=116+Fairlawn+Court+Greenwich+London+SE7+7DT",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "BURGESS PARK OUTDOOR GYM",
        coordinates: { latitude: 51.482803, longitude: -0.091346 },
        address: "Canal Street, Southwark, London, SE5 0AJ",
        equipment: ["Pull-up Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Fitness facility at Burgess Park with pull-up bars.",
        url: "https://calisthenics-parks.com/spots/18615-en-fitness-facility-london-burgess-park-outdoor-gym",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=Canal+Street+Southwark+London+SE5+0AJ",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "CALISTHENICS PARK – CLAPHAM COMMON",
        coordinates: { latitude: 51.461528, longitude: -0.153805 },
        address: "6 Clapham Common North Side, Northcote, London, SW4 9SD",
        equipment: ["Pull-up Bars", "Parallel Bars", "Push-up Bars"],
        difficulty: "All Levels",
        rating: 3.0,
        hours: "24/7",
        description: "Calisthenics park at Clapham Common with good equipment variety.",
        url: "https://calisthenics-parks.com/spots/431-en-london-calisthenics-park-clapham-common-uk",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=6+Clapham+Common+North+Side+Northcote+London+SW4+9SD",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "CALISTHENICS ROEHAMPTON",
        coordinates: { latitude: 51.446057, longitude: -0.235954 },
        address: "43 Wanborough Drive, Wandsworth, London, SW15 4AN",
        equipment: ["Pull-up Bars", "Monkey Bars", "Dip Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Outdoor gym in Roehampton with calisthenics equipment.",
        url: "https://calisthenics-parks.com/spots/26780-en-outdoor-gym-london-calisthenics-roehampton",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=43+Wanborough+Drive+Wandsworth+London+SW15+4AN",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "CALISTHENICS STATIONS BARRACK FIELDS",
        coordinates: { latitude: 51.483797, longitude: 0.063356 },
        address: "Grand Depot Road, Woolwich Common, London, SE18 6XN",
        equipment: ["Pull-up Bars", "Parallel Bars", "Push-up Bars"],
        difficulty: "All Levels",
        rating: 3.0,
        hours: "24/7",
        description: "Exercise stations at Barrack Fields with various calisthenics equipment.",
        url: "https://calisthenics-parks.com/spots/7554-en-london-exercise-stations-calisthenics-stations-barrack-fields",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=Grand+Depot+Road+Woolwich+Common+London+SE18+6XN",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "CHARLTON PARK TGO GYM",
        coordinates: { latitude: 51.479303, longitude: 0.039058 },
        address: "Torrance Close, Charlton, London, SE7 8PE",
        equipment: ["Pull-up Bars", "Dip Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Outdoor gym at Charlton Park with TGO equipment.",
        url: "https://calisthenics-parks.com/spots/7250-en-london-outdoor-gym-charlton-park-tgo-gym",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=Torrance+Close+Charlton+London+SE7+8PE",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "EXERCISE EQUIPMENT LONDON - GREENWICH",
        coordinates: { latitude: 51.480636, longitude: 0.090995 },
        address: "Winn Common Road, Greenwich, London, SE18 2NL",
        equipment: ["Pull-up Bars", "Parallel Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Workout station with exercise equipment in Greenwich area.",
        url: "https://calisthenics-parks.com/spots/31100-en-workout-station-london-exercise-equipment-london",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=Winn+Common+Road+Greenwich+London+SE18+2NL",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "FITNESS TRAIL – WANDSWORTH COMMON",
        coordinates: { latitude: 51.45064, longitude: -0.171141 },
        address: "32 Baskerville Road, Wandsworth Common, London, SW18 3RS",
        equipment: ["Pull-up Bars", "Parallel Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Fitness trail at Wandsworth Common with exercise stations.",
        url: "https://calisthenics-parks.com/spots/434-en-london-fitness-trail-wandsworth-common",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=32+Baskerville+Road+Wandsworth+Common+London+SW18+3RS",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "KIDBROOKE GREEN TGO GYM",
        coordinates: { latitude: 51.465644, longitude: 0.031754 },
        address: "219 Rochester Way, Eltham, London, SE3 8AY",
        equipment: ["Pull-up Bars", "Push-up Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Exercise park at Kidbrooke Green with TGO gym equipment.",
        url: "https://calisthenics-parks.com/spots/9327-en-exercise-park-london-kidbrooke-green-tgo-gym",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=219+Rochester+Way+Eltham+London+SE3+8AY",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "LEWISHAM - OUTDOOR GYM - CORNMILL GARDENS",
        coordinates: { latitude: 51.462944, longitude: -0.014867 },
        address: "23 Elmira Street, Lewisham, London, SE13 7GB",
        equipment: ["Pull-up Bars", "Dip Bars"],
        difficulty: "All Levels",
        rating: 3.0,
        hours: "24/7",
        description: "Outdoor gym at Cornmill Gardens in Lewisham.",
        url: "https://calisthenics-parks.com/spots/26399-en-outdoor-gym-london-london-lewisham-outdoor-gym-cornmill-gardens",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=23+Elmira+Street+Lewisham+London+SE13+7GB",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR EXERCISE GYM - BATTERSEA PARK",
        coordinates: { latitude: 51.478005, longitude: -0.149425 },
        address: "Battersea Park Millennium Arena, Carriage Drive East, London, SW11 4BE",
        equipment: ["Pull-up Bars", "Parallel Bars", "Push-up Bars"],
        difficulty: "All Levels",
        rating: 3.0,
        hours: "24/7",
        description: "Outdoor exercise gym at Battersea Park with various equipment.",
        url: "https://calisthenics-parks.com/spots/6851-en-london-outdoor-exercise-gym-battersea-park",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=Battersea+Park+Millennium+Arena+Carriage+Drive+East+London+SW11+4BE",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR EXERCISE GYM - DULWICH PARK",
        coordinates: { latitude: 51.440681, longitude: -0.074929 },
        address: "Carriage Drive, Village, London, SE21 7HA",
        equipment: ["Pull-up Bars", "Dip Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Outdoor exercise gym at Dulwich Park.",
        url: "https://calisthenics-parks.com/spots/5505-en-london-outdoor-exercise-gym-dulwich-park",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=Carriage+Drive+Village+London+SE21+7HA",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR FITNESS - CROWN WOODS",
        coordinates: { latitude: 51.467978, longitude: 0.06902 },
        address: "Crown Woods Lane, Shooters Hill, London, SE18 3JA",
        equipment: ["Pull-up Bars", "Parallel Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Outdoor fitness area at Crown Woods.",
        url: "https://calisthenics-parks.com/spots/12715-en-outdoor-fitness-london-calisthenics-workout",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=Crown+Woods+Lane+Shooters+Hill+London+SE18+3JA",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR FITNESS BARRACK FIELD",
        coordinates: { latitude: 51.486636, longitude: 0.064017 },
        address: "411 Repository Road, Woolwich Common, London, SE18 4BH",
        equipment: ["Pull-up Bars", "Parallel Bars", "Push-up Bars"],
        difficulty: "All Levels",
        rating: 3.0,
        hours: "24/7",
        description: "Calisthenics stations at Barrack Field with multiple equipment types.",
        url: "https://calisthenics-parks.com/spots/7553-en-london-calisthenics-stations-outdoor-fitness-barrack-field",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=411+Repository+Road+Woolwich+Common+London+SE18+4BH",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR FITNESS BLYTHE HILL FIELDS",
        coordinates: { latitude: 51.44639, longitude: -0.032566 },
        address: "39 Bankhurst Road, Crofton Park, London, SE6 4XL",
        equipment: ["Pull-up Bars", "Parallel Bars"],
        difficulty: "All Levels",
        rating: 3.0,
        hours: "24/7",
        description: "Workout station at Blythe Hill Fields.",
        url: "https://calisthenics-parks.com/spots/15217-en-workout-station-london-outdoor-fitness-blythe-hill-fields",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=39+Bankhurst+Road+Crofton+Park+London+SE6+4XL",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR FITNESS GRANGEWOOD PARK",
        coordinates: { latitude: 51.402083, longitude: -0.08857 },
        address: "175 Ross Road, London, SE25 6TW",
        equipment: ["Pull-up Bars", "Parallel Bars", "Monkey Bars", "Push-up Bars"],
        difficulty: "All Levels",
        rating: 4.0,
        hours: "24/7",
        description: "Excellent calisthenics stations at Grangewood Park with comprehensive equipment.",
        url: "https://calisthenics-parks.com/spots/15808-en-calisthenics-stations-london-outdoor-fitness-grangewood-park",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=175+Ross+Road+London+SE25+6TW",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR FITNESS GYM - BARNES",
        coordinates: { latitude: 51.482634, longitude: -0.239786 },
        address: "11 Barnes Ave, London SW13 9AA",
        equipment: ["Pull-up Bars", "Parallel Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Outdoor fitness gym in Barnes with Denfit equipment including high bars and dip stations.",
        url: "https://calisthenics-parks.com/spots/1081-en-london-outdoor-fitness-gym-barnes",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=11+Barnes+Ave+London+SW13+9AA",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR FITNESS MAYOW PARK",
        coordinates: { latitude: 51.431168, longitude: -0.048901 },
        address: "95 Dacres Road, Perry Vale, London, SE23 2BN",
        equipment: ["Pull-up Bars", "Dip Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Calisthenics facility at Mayow Park.",
        url: "https://calisthenics-parks.com/spots/9184-en-calisthenics-facility-london-outdoor-fitness-mayow-park",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=95+Dacres+Road+Perry+Vale+London+SE23+2BN",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR FITNESS NORBURY PARK",
        coordinates: { latitude: 51.413697, longitude: -0.114344 },
        address: "353 Norbury Avenue, Norbury, London, SW16 3LZ",
        equipment: ["Pull-up Bars", "Parallel Bars", "Monkey Bars", "Wall Bars", "Push-up Bars"],
        difficulty: "All Levels",
        rating: 4.0,
        hours: "24/7",
        description: "Comprehensive exercise park at Norbury Park with excellent equipment variety.",
        url: "https://calisthenics-parks.com/spots/15807-en-exercise-park-london-outdoor-fitness-norbury-park",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=353+Norbury+Avenue+Norbury+London+SW16+3LZ",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR FITNESS RUSKIN PARK",
        coordinates: { latitude: 51.465395, longitude: -0.095931 },
        address: "38 Finsen Road, Herne Hill, London, SE5 9AW",
        equipment: ["Pull-up Bars", "Parallel Bars", "Monkey Bars", "Push-up Bars"],
        difficulty: "All Levels",
        rating: 4.0,
        hours: "24/7",
        description: "Excellent fitness facility at Ruskin Park with comprehensive equipment.",
        url: "https://calisthenics-parks.com/spots/14989-en-fitness-facility-london-outdoor-fitness-ruskin-park",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=38+Finsen+Road+Herne+Hill+London+SE5+9AW",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR GYM - ARCHBISHOPS PARK",
        coordinates: { latitude: 51.498488, longitude: -0.11651 },
        address: "5 Lambeth Pal Rd, Bishop's, London, SE1 7LG",
        equipment: ["Parallel Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Outdoor gym at Archbishops Park with parallel bars.",
        url: "https://calisthenics-parks.com/spots/487-en-london-street-workout-park-lambeth-bichops-archbichops-park",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=5+Lambeth+Pal+Rd+Bishops+London+SE1+7LG",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR GYM - HILLY FIELDS",
        coordinates: { latitude: 51.45894, longitude: -0.030227 },
        address: "Hilly Fields, Adelaide Avenue, Telegraph Hill, London, SE4 1YR",
        equipment: ["Pull-up Bars", "Parallel Bars"],
        difficulty: "All Levels",
        rating: 3.0,
        hours: "24/7",
        description: "Outdoor gym at Hilly Fields with good equipment.",
        url: "https://calisthenics-parks.com/spots/6852-en-london-outdoor-gym-hilly-fields",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=Hilly+Fields+Adelaide+Avenue+Telegraph+Hill+London+SE4+1YR",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR GYM - IMPERIAL PARK",
        coordinates: { latitude: 51.470722, longitude: -0.183413 },
        address: "Imperial Wharf Garden, Imperial Crescent, London, SW6 2QW",
        equipment: ["Pull-up Bars", "Monkey Bars", "Push-up Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Outdoor gym at Imperial Park with various equipment.",
        url: "https://calisthenics-parks.com/spots/5487-en-london-outdoor-gym-imperial-park",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=Imperial+Wharf+Garden+Imperial+Crescent+London+SW6+2QW",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR GYM - NORMAND PARK",
        coordinates: { latitude: 51.483823, longitude: -0.208429 },
        address: "Lillie Road, West Kensington, London, SW6 7QB",
        equipment: ["Pull-up Bars", "Parallel Bars", "Monkey Bars", "Push-up Bars", "Dip Bars"],
        difficulty: "All Levels",
        rating: 3.0,
        hours: "24/7",
        description: "Comprehensive outdoor gym at Normand Park with varied equipment.",
        url: "https://calisthenics-parks.com/spots/6026-en-london-outdoor-gym-normand-park",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=Lillie+Road+West+Kensington+London+SW6+7QB",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR GYM - ST AGNES PLACE",
        coordinates: { latitude: 51.482789, longitude: -0.106571 },
        address: "39 St. Agnes Place, Lambeth, London, SE11 4AX",
        equipment: ["Pull-up Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Outdoor gym at St Agnes Place.",
        url: "https://calisthenics-parks.com/spots/19711-en-outdoor-gym-london-london-outdoor-gym-st-agnes-place",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=39+St+Agnes+Place+Lambeth+London+SE11+4AX",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR GYM – CLAPHAM COMMON",
        coordinates: { latitude: 51.456581, longitude: -0.155458 },
        address: "201 Broomwood Road, Northcote, London, SW4 9AU",
        equipment: ["Pull-up Bars", "Parallel Bars", "Push-up Bars"],
        difficulty: "All Levels",
        rating: 3.0,
        hours: "24/7",
        description: "Outdoor gym at Clapham Common with good equipment variety.",
        url: "https://calisthenics-parks.com/spots/432-en-london-fitness-park-clapham-common-uk",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=201+Broomwood+Road+Northcote+London+SW4+9AU",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR GYM ANERLEY BETTS PARK",
        coordinates: { latitude: 51.409317, longitude: -0.063118 },
        address: "52 Betts Way, Crystal Palace, London, SE20 8TZ",
        equipment: ["Pull-up Bars", "Push-up Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Outdoor pull-up bars at Anerley Betts Park.",
        url: "https://calisthenics-parks.com/spots/15435-en-outdoor-pull-up-bars-london-outdoor-gym-anerley-betts-park",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=52+Betts+Way+Crystal+Palace+London+SE20+8TZ",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR GYM CASTELNAU RECREATION GROUND",
        coordinates: { latitude: 51.482634, longitude: -0.239786 },
        address: "30 Barnes Avenue, Richmond upon Thames, London, SW13 9AA",
        equipment: ["Pull-up Bars", "Dip Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Calisthenics facility at Castelnau Recreation Ground.",
        url: "https://calisthenics-parks.com/spots/26166-en-calisthenics-facility-london-outdoor-gym-castelnau-recreation-ground",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=30+Barnes+Avenue+Richmond+upon+Thames+London+SW13+9AA",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR GYM FOR STREET WORKOUT - BRIXTON",
        coordinates: { latitude: 51.469194, longitude: -0.108962 },
        address: "4 Bennett Rd Brixton, London SW9 7ES",
        equipment: ["Pull-up Bars", "Parallel Bars"],
        difficulty: "All Levels",
        rating: 3.0,
        hours: "24/7",
        description: "Outdoor gym for street workout in Brixton with Incite Fitness equipment.",
        url: "https://calisthenics-parks.com/spots/1377-en-london-outdoor-gym-for-street-workout-brixton",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=4+Bennett+Rd+Brixton+London+SW9+7ES",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR GYM LATCHMERE RECREATION GROUND",
        coordinates: { latitude: 51.471561, longitude: -0.161075 },
        address: "23 Burns Road, Wandsworth, London, SW11 5AG",
        equipment: ["Pull-up Bars", "Monkey Bars", "Wall Bars", "Push-up Bars", "Dip Bars"],
        difficulty: "All Levels",
        rating: 4.0,
        hours: "24/7",
        description: "Excellent outdoor fitness park at Latchmere Recreation Ground.",
        url: "https://calisthenics-parks.com/spots/17902-en-outdoor-fitness-park-london-outdoor-gym-latchmere-recreation-ground",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=23+Burns+Road+Wandsworth+London+SW11+5AG",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR GYM LONDRES",
        coordinates: { latitude: 51.486806, longitude: -0.166987 },
        address: "30 Flood Walk, Kensington and Chelsea, London, SW3 5RR",
        equipment: ["Pull-up Bars", "Parallel Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Exercise park in Chelsea area.",
        url: "https://calisthenics-parks.com/spots/29195-en-exercise-park-london-outdoor-gym-londres",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=30+Flood+Walk+Kensington+and+Chelsea+London+SW3+5RR",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR GYM MANOR HOUSE GARDENS",
        coordinates: { latitude: 51.455215, longitude: 0.007541 },
        address: "95 Brightfield Road, Lewisham, London, SE12 8PD",
        equipment: ["Pull-up Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Outdoor pull-up bars at Manor House Gardens.",
        url: "https://calisthenics-parks.com/spots/25978-en-outdoor-pull-up-bars-london-outdoor-gym-manor-house-gardens",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=95+Brightfield+Road+Lewisham+London+SE12+8PD",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR WORKOUT - WOOLWICH",
        coordinates: { latitude: 51.486978, longitude: 0.065559 },
        address: "72 Simmons Rd, Woolwich Common, London, SE18 6AQ",
        equipment: ["Pull-up Bars", "Parallel Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Outdoor workout area in Woolwich.",
        url: "https://calisthenics-parks.com/spots/13600-en-outdoor-workout-london-calisthenics-workout",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=72+Simmons+Rd+Woolwich+Common+London+SE18+6AQ",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "PALEWELL COMMON OUTDOOR GYM",
        coordinates: { latitude: 51.459587, longitude: -0.259761 },
        address: "Palewell Common Drive, East Sheen, London, SW14 8RE",
        equipment: ["Pull-up Bars", "Monkey Bars", "Push-up Bars", "Dip Bars"],
        difficulty: "All Levels",
        rating: 3.0,
        hours: "24/7",
        description: "Calisthenics gym at Palewell Common with good equipment variety.",
        url: "https://calisthenics-parks.com/spots/8471-en-calisthenics-gym-london-palewell-common-outdoor-gym",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=Palewell+Common+Drive+East+Sheen+London+SW14+8RE",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "PELICAN OUTDOOR GYM",
        coordinates: { latitude: 51.472857, longitude: -0.075994 },
        address: "10 Talfourd Place, The Lane, London, SE15 5NL",
        equipment: ["Pull-up Bars", "Dip Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Calisthenics facility at Pelican outdoor gym.",
        url: "https://calisthenics-parks.com/spots/17427-en-calisthenics-facility-london-pelican-outdoor-gym",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=10+Talfourd+Place+The+Lane+London+SE15+5NL",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "STREET WORKOUT PARK – CLAPHAM COMMON",
        coordinates: { latitude: 51.455314, longitude: -0.153825 },
        address: "46 Manchuria Road, Balham, London, SW4 9AR",
        equipment: ["Pull-up Bars"],
        difficulty: "All Levels",
        rating: 3.0,
        hours: "24/7",
        description: "Street workout park at Clapham Common.",
        url: "https://calisthenics-parks.com/spots/433-en-london-calisthenics-park-clapham-common-street-workout",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=46+Manchuria+Road+Balham+London+SW4+9AR",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "TACHBROOK ESTATE OUTDOOR GYM",
        coordinates: { latitude: 51.48724, longitude: -0.13181 },
        address: "Balvaird Place, Westminster, London, SW1V 3SL",
        equipment: ["Pull-up Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Fitness park at Tachbrook Estate with pull-up bars.",
        url: "https://calisthenics-parks.com/spots/19457-en-fitness-park-london-tachbrook-estate-outdoor-gym",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=Balvaird+Place+Westminster+London+SW1V+3SL",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "VINCENNES ESTATE COMMUNITY GYM",
        coordinates: { latitude: 51.430475, longitude: -0.092521 },
        address: "4 St. Bernards Close, Lambeth, London, SE27 9RY",
        equipment: ["Pull-up Bars", "Parallel Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Community gym at Vincennes Estate.",
        url: "https://calisthenics-parks.com/spots/28255-en-fitness-park-london-vincennes-estate-community-gym",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=4+St+Bernards+Close+Lambeth+London+SE27+9RY",
        images: ["https://i.imgur.com/Ve54aox.png"]
      }
    ],
    east: [
      {
        name: "OPEN AIR GYM NEAR TO THE PARK",
        coordinates: { latitude: 51.4977211, longitude: -0.0261563 },
        address: "165 Westferry Road, Tower Hamlets, London, E14 8QB",
        equipment: ["Pull-up Bars", "Parallel Bars"],
        difficulty: "All Levels",
        rating: 4.0,
        hours: "24/7",
        description: "Open park with a basic setup for calisthenics, including parallel bars and pull-up bars. A good spot for casual outdoor training.",
        url: "https://calisthenics-parks.com/spots/27257-en-outdoor-pull-up-bars-london-open-air-gym-near-to-the-park",
        mapsUrl: "https://www.google.co.uk/maps/place/Park+With+Gym/@51.4977918,-0.0261073,18.24z/data=!4m15!1m8!3m7!1s0x487602c0c2e27ef7:0x94923d070278172d!2sTopmast+Point,+165+Westferry+Rd,+London+E14+8NH!3b1!8m2!3d51.4981002!4d-0.025544!16s%2Fg%2F1tdk9k3p!3m5!1s0x4876037b795a1255:0x181508630b68cb61!8m2!3d51.4977211!4d-0.0261563!16s%2Fg%2F11r0zp4szm?entry=ttu&g_ep=EgoyMDI1MDQyMi4wIKXMDSoASAFQAw%3D%3D",
        images: ["https://i.imgur.com/hPDbvG5.jpeg", "https://i.imgur.com/eCpJquW.jpeg", "https://i.imgur.com/NXIY6pT.jpeg", "https://i.imgur.com/NEaweRy.jpeg"]
      },
      {
        name: "STREET WORKOUT PARK – LONDON FIELDS EAST SIDE",
        coordinates: { latitude: 51.5384198, longitude: -0.0603973 },
        address: "11 Exmouth Place, London Fields, London, E8 3RN",
        equipment: ["Pull-up Bars", "Parallel Bars", "Dip Bars"],
        difficulty: "All Levels",
        rating: 4.0,
        hours: "24/7",
        description: "Modern Kenguru Pro facility near Broadway Market entrance. High-quality equipment in a convenient location.",
        url: "https://calisthenics-parks.com/spots/4388-en-london-street-workout-park-london-fields-east-side",
        mapsUrl: "https://www.google.com/maps/place/Pull-up+Bars/@51.5386872,-0.0606124,18.82z/data=!4m14!1m7!3m6!1s0x48761de5d5cf7abb:0x6d9c2088c4eac45b!2sLondon+Fields+Studios!8m2!3d51.5391853!4d-0.058691!16s%2Fg%2F11jmzh4gxc!3m5!1s0x48761d001d5bb5db:0xc80c79f312106926!8m2!3d51.5384198!4d-0.0603973!16s%2Fg%2F11x0c6xl8k?entry=ttu&g_ep=EgoyMDI1MDQwOS4wIKXMDSoASAFQAw%3D%3D",
        images: ["https://i.imgur.com/Uyk02Kp.jpeg", "https://i.imgur.com/oOMnk8S.jpeg", "https://i.imgur.com/rJJ5gS8.jpeg"]
      },
      {
        name: "OUTDOOR FITNESS STUDIO – VICTORIA PARK",
        coordinates: { latitude: 51.5402787, longitude: -0.0329637 },
        address: "32 St. Mark's Gate, Tower Hamlets, London, E9 5HT",
        equipment: ["Pull-up Bars", "Parallel Bars", "Dip Bars"],
        difficulty: "All Levels",
        rating: 4.0,
        hours: "24/7",
        description: "Well-maintained fitness rig by the tennis courts. Comprehensive calisthenics setup in Victoria Park.",
        url: "https://calisthenics-parks.com/spots/26404-en-london-outdoor-fitness-studio-victoria-park",
        mapsUrl: "https://www.google.com/maps/place/Outside+Gym/@51.5402787,-0.0336074,19z/data=!4m6!3m5!1s0x48761d8b604c8f17:0x1c56107a08d01ba9!8m2!3d51.5402787!4d-0.0329637!16s%2Fg%2F11s_z4g4n6?entry=ttu&g_ep=EgoyMDI1MDQwOS4wIKXMDSoASAFQAw%3D%3D",
        images: ["https://i.imgur.com/BVvuujG.png", "https://i.imgur.com/E8OXbTz.jpeg", "https://i.imgur.com/5yz9Qy4.jpeg", "https://i.imgur.com/9ukaRNR.jpeg"]
      },
      {
        name: "MEATH GARDENS OUTDOOR GYM",
        coordinates: { latitude: 51.5287569, longitude: -0.0438465 },
        address: "10 Palmers Road, Tower Hamlets, London, E2 0SN",
        equipment: ["Pull-up Bars", "Parallel Bars", "Dip Bars"],
        difficulty: "All Levels",
        rating: 4.0,
        hours: "24/7",
        description: "Peaceful training spot in Meath Gardens with essential calisthenics equipment. Perfect for focused workouts.",
        url: "https://calisthenics-parks.com/spots/26501-en-london-fitness-park-meath-gardens-outdoor-gym",
        mapsUrl: "https://www.google.com/maps/place/Outdoor+gym/@51.5295256,-0.043822,18.23z/data=!4m15!1m8!3m7!1s0x48761d26b93b4ee3:0x1dc2b416affa5026!2s10+Palmers+Rd,+Bethnal+Green,+London+E3+5RP!3b1!8m2!3d51.5298471!4d-0.0423564!16s%2Fg%2F11bw3h26t1!3m5!1s0x48761d004de57bc7:0x4356e21fa3a159f3!8m2!3d51.5287569!4d-0.0438465!16s%2Fg%2F11w_zj25km?entry=ttu&g_ep=EgoyMDI1MDQwOS4wIKXMDSoASAFQAw%3D%3D",
        images: ["https://i.imgur.com/PBPFPNx.jpeg", "https://i.imgur.com/OeZXPNG.jpeg"]
      },
      {
        name: "OUTDOOR GYM WENNINGTON GREEN",
        coordinates: { latitude: 51.5313198, longitude: -0.0420322 },
        address: "Wennington Green, Mile End Park, London E3",
        equipment: ["Pull-up Bars", "Parallel Bars", "Dip Bars"],
        difficulty: "All Levels",
        rating: 4.0,
        hours: "24/7",
        description: "Recently upgraded facility with comprehensive equipment. Scenic canal-side location perfect for varied workouts.",
        url: "https://calisthenics-parks.com/spots/7673-en-calisthenics-park-london-outdoor-gym-wennington-green",
        mapsUrl: "https://www.google.co.uk/maps/place/Wennington+Green+Active+Zone/@51.5313198,-0.0420322,18z/data=!4m14!1m7!3m6!1s0x48761dc29956adc7:0xaa8e086e5423ab50!2sWennington+Green!8m2!3d51.5315703!4d-0.0419086!16s%2Fg%2F11h4g7p57t!3m5!1s0x48761d56f91eb989:0x3ea9df9dcf0568e!8m2!3d51.5313198!4d-0.0420322!16s%2Fg%2F11q56r9td9?entry=ttu&g_ep=EgoyMDI1MDQwOS4wIKXMDSoASAFQAw%3D%3D",
        images: ["https://i.imgur.com/YsNBdrp.jpeg", "https://i.imgur.com/Ejkshlj.jpeg", "https://i.imgur.com/gRnEHKv.jpeg", "https://i.imgur.com/GErFfm2.jpeg", "https://i.imgur.com/4IdO8KI.jpeg", "https://i.imgur.com/i5QHeMy.jpeg"]
      },
      {
        name: "WEAVER'S FIELD OUTDOOR GYM",
        coordinates: { latitude: 51.5255593, longitude: -0.0612298 },
        address: "202 Mape Street, Tower Hamlets, London, E2 6HD",
        equipment: ["Pull-up Bars", "Parallel Bars"],
        difficulty: "All Levels",
        rating: 3.0,
        hours: "06:00 - 21:00",
        description: "New facility in Weavers Field with accessible equipment and evening lighting. Great for basic calisthenics training.",
        url: "https://calisthenics-parks.com/spots/26709-en-calisthenics-stations-london-weavers-field-outdoor-gym",
        mapsUrl: "https://www.google.co.uk/maps/place/Weavers+Fields/@51.5253593,-0.0617273,19.74z/data=!4m10!1m2!2m1!1sWeavers+Fields+calisthenics!3m6!1s0x48761d6d1c8dbbdd:0x81d834d0041b67b6!8m2!3d51.5255593!4d-0.0612298!15sChtXZWF2ZXJzIEZpZWxkcyBjYWxpc3RoZW5pY3NaHSIbd2VhdmVycyBmaWVsZHMgY2FsaXN0aGVuaWNzkgEEcGFya5oBJENoZERTVWhOTUc5blMwVkpRMEZuU1VOVWFHUkRNVzluUlJBQuABAPoBBAh_ECA!16s%2Fg%2F11vs9k3hc4?entry=ttu&g_ep=EgoyMDI1MDQwOS4wIKXMDSoASAFQAw%3D%3D",
        images: ["https://i.imgur.com/a0qR1fc.jpeg", "https://i.imgur.com/mVUFNQN.jpeg", "https://i.imgur.com/i5VrbP6.jpeg"]
      },
      {
        name: "OAK HILL PARK",
        coordinates: { latitude: 51.6372, longitude: -0.1551 },
        address: "Oak Hill Park (CALISTHENICS PARK), Parkside Gardens, London EN4 8JP",
        equipment: ["Pull-up Bars", "Parallel Bars"],
        difficulty: "Beginner",
        rating: 3.0,
        hours: "24/7",
        description: "Basic calisthenics setup in a quiet residential park. Ideal for beginners and casual training.",
        url: "https://calisthenics-parks.com/spots/oak-hill-park",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=Oak+Hill+Park+(CALISTHENICS+PARK)+Parkside+Gardens+London+EN4+8JP+United+Kingdom",
        images: ["https://i.imgur.com/7aupblR.jpeg"]
      },
      {
        name: "SIR JOHN MCDOUGALL GARDENS",
        coordinates: { latitude: 51.4972, longitude: -0.0225 },
        address: "Block C, 60, Westferry Road, Millwall, London E14 8JE",
        equipment: ["Pull-up Bars", "Dip Bars", "Monkey Bars", "Incline Bench", "Sit-up Bench", "Rings"],
        difficulty: "All Levels",
        rating: 3.0,
        hours: "24/7",
        description: "New facility with diverse equipment including rings. Riverside location with great Thames views.",
        url: "https://calisthenics-parks.com/spots/6032-en-london-outdoor-gym-sir-john-mcdougall-gardens",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=60+Westferry+Road+London+E14+8JE",
        images: ["https://i.imgur.com/0NtDrQc.jpeg"]
      },
      {
        name: "OUTDOOR EXERCISE PARK – BARKING",
        coordinates: { latitude: 51.5247, longitude: 0.0812 },
        address: "369 Burges Rd, London E6 2ET",
        equipment: ["Pull-up Bars", "Parallel Bars", "Dip Bars"],
        difficulty: "All Levels",
        rating: 3.0,
        hours: "24/7",
        description: "Standard calisthenics setup in Barking with essential equipment.",
        url: "https://calisthenics-parks.com/spots/1114-en-london-outdoor-exercise-park-barking",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=369+Burges+Rd+London+E6+2ET+UK",
        images: ["https://i.imgur.com/Dbd19o9.jpeg"]
      },
      {
        name: "ALDGATE EAST",
        coordinates: { latitude: 51.514947, longitude: -0.071295 },
        address: "10 New Drum Street, Tower Hamlets, London, E1 7AT",
        equipment: ["Pull-up Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Outdoor pull-up bars near Aldgate East station.",
        url: "https://calisthenics-parks.com/spots/30470-en-outdoor-pull-up-bars-london-aldgate-east-london-exercise-equipment",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=10+New+Drum+Street+Tower+Hamlets+London+E1+7AT",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "CALISTHENICS GYM - BACKYARD CINEMA",
        coordinates: { latitude: 51.536121, longitude: -0.039094 },
        address: "70 Old Ford Road, Tower Hamlets, London, E9 7DD",
        equipment: ["Pull-up Bars", "Dip Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Outdoor gym near Backyard Cinema.",
        url: "https://calisthenics-parks.com/spots/19814-en-outdoor-gym-london-london-calisthenics-gym-backyard-cinema",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=70+Old+Ford+Road+Tower+Hamlets+London+E9+7DD",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "CALISTHENICS GYM - WESTFIELD AVENUE",
        coordinates: { latitude: 51.542808, longitude: -0.009977 },
        address: "31 Westfield Avenue, Newham, London, E20 1HZ",
        equipment: ["Pull-up Bars", "Parallel Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Outdoor pull-up bars on Westfield Avenue.",
        url: "https://calisthenics-parks.com/spots/19619-en-outdoor-pull-up-bars-london-london-calisthenics-gym-westfield-avenue",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=31+Westfield+Avenue+Newham+London+E20+1HZ",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "CALISTHENICS GYM CHICKSAND STREET PARK",
        coordinates: { latitude: 51.518578, longitude: -0.06895 },
        address: "22 Chicksand Street, Spitalfields, London, E1 5LQ",
        equipment: ["Pull-up Bars", "Parallel Bars"],
        difficulty: "All Levels",
        rating: 3.0,
        hours: "24/7",
        description: "Workout station at Chicksand Street Park.",
        url: "https://calisthenics-parks.com/spots/15838-en-workout-station-london-calisthenics-gym-chicksand-street-park",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=22+Chicksand+Street+Spitalfields+London+E1+5LQ",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "CALISTHENICS PARK - LANGDON PARK (POPLAR)",
        coordinates: { latitude: 51.515966, longitude: -0.0122 },
        address: "Bright Street, Poplar, London, E14 6PH",
        equipment: ["Pull-up Bars", "Parallel Bars", "Wall Bars", "Push-up Bars"],
        difficulty: "All Levels",
        rating: 4.0,
        hours: "24/7",
        description: "Comprehensive calisthenics park at Langdon Park with varied equipment.",
        url: "https://calisthenics-parks.com/spots/5143-en-london-calisthenics-park-langdon-park-poplar",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=Bright+Street+Poplar+London+E14+6PH",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "EXERCISE EQUIPMENT LONDON - STRATFORD",
        coordinates: { latitude: 51.538691, longitude: -0.004764 },
        address: "76 Doran Walk, Newham, London, E15 2JT",
        equipment: ["Pull-up Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Outdoor pull-up bars in Stratford area.",
        url: "https://calisthenics-parks.com/spots/31236-en-outdoor-pull-up-bars-london-exercise-equipment-london",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=76+Doran+Walk+Newham+London+E15+2JT",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "FITNESS PARK – MABLEY GREEN",
        coordinates: { latitude: 51.549168, longitude: -0.028249 },
        address: "6 Crowfoot Close, Hackney Wick, London, E9 5HS",
        equipment: ["Push-up Bars", "Dip Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Fitness park at Mabley Green.",
        url: "https://calisthenics-parks.com/spots/441-en-london-mabley-green-fitness-park-uk",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=6+Crowfoot+Close+Hackney+Wick+London+E9+5HS",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR EXERCISE STATION - MILLWALL PARK",
        coordinates: { latitude: 51.489181, longitude: -0.013582 },
        address: "2 Manchester Grove, Island Gardens, London, E14 3BA",
        equipment: ["Pull-up Bars", "Parallel Bars", "Monkey Bars"],
        difficulty: "All Levels",
        rating: 3.0,
        hours: "24/7",
        description: "Outdoor exercise station at Millwall Park with varied equipment.",
        url: "https://calisthenics-parks.com/spots/3414-en-london-outdoor-exercise-station-millwall-park",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=2+Manchester+Grove+Island+Gardens+London+E14+3BA",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR FITNESS CATHALL",
        coordinates: { latitude: 51.559343, longitude: 0.002863 },
        address: "15 Plantain Gardens, Cathall, London, E11 4YD",
        equipment: ["Pull-up Bars", "Push-up Bars"],
        difficulty: "All Levels",
        rating: 3.0,
        hours: "24/7",
        description: "Public pull-up bars at Cathall.",
        url: "https://calisthenics-parks.com/spots/9003-en-public-pull-up-bars-london-outdoor-fitness-cathall",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=15+Plantain+Gardens+Cathall+London+E11+4YD",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR FITNESS LANGTHORNE PARK",
        coordinates: { latitude: 51.556549, longitude: 0.005308 },
        address: "50 Birch Grove, Cathall, London, E11 4YG",
        equipment: ["Pull-up Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Public pull-up bars at Langthorne Park.",
        url: "https://calisthenics-parks.com/spots/8399-en-public-pull-up-bars-london-outdoor-fitness-langthorne-park",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=50+Birch+Grove+Cathall+London+E11+4YG",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR FITNESS RIDGEWAY PARK",
        coordinates: { latitude: 51.624327, longitude: -0.010141 },
        address: "39 Peel Close, Endlebury, London, E4 6RS",
        equipment: ["Pull-up Bars", "Parallel Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Workout station at Ridgeway Park.",
        url: "https://calisthenics-parks.com/spots/8805-en-workout-station-london-outdoor-fitness-ridgeway-park",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=39+Peel+Close+Endlebury+London+E4+6RS",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR FITNESS SPRINGFIELD PARK",
        coordinates: { latitude: 51.573235, longitude: -0.05916 },
        address: "Spring Lane, Springfield, London, E5 9BL",
        equipment: ["Pull-up Bars", "Monkey Bars", "Push-up Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Fitness park at Springfield Park.",
        url: "https://calisthenics-parks.com/spots/16035-en-fitness-park-outdoor-fitness-springfield-park-london",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=Spring+Lane+Springfield+London+E5+9BL",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR GYM - CAMERON BEST PARK",
        coordinates: { latitude: 51.529692, longitude: -0.061314 },
        address: "18 Winkley Street, St. Peter's, London, E2 6QF",
        equipment: ["Pull-up Bars", "Dip Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Outdoor gym for calisthenics workout at Cameron Best Park.",
        url: "https://calisthenics-parks.com/spots/12261-en-outdoor-gym-london-calisthenics-workout",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=18+Winkley+Street+St+Peters+London+E2+6QF",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR GYM - POLLARD SQUARE (BETHNAL GREEN)",
        coordinates: { latitude: 51.52688, longitude: -0.065254 },
        address: "Florida Street, Globe Town, Bethnal Green, London, E2 6AE",
        equipment: ["Pull-up Bars", "Parallel Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Outdoor gym at Pollard Square in Bethnal Green.",
        url: "https://calisthenics-parks.com/spots/6841-en-london-outdoor-gym-pollard-square-bethnal-green",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=Florida+Street+Globe+Town+Bethnal+Green+London+E2+6AE",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR GYM - THAMES BARRIER PARK",
        coordinates: { latitude: 51.502176, longitude: 0.034691 },
        address: "Booth Road, Silvertown, London, E16 2GQ",
        equipment: ["Pull-up Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Outdoor gym at Thames Barrier Park.",
        url: "https://calisthenics-parks.com/spots/6105-en-london-outdoor-gym-thames-barrier-park",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=Booth+Road+Silvertown+London+E16+2GQ",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR GYM - WALTHAMSTOW",
        coordinates: { latitude: 51.596998, longitude: -0.036229 },
        address: "97 Hecham Close, Higham Hill, London, E17 5QT",
        equipment: ["Pull-up Bars", "Wall Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Outdoor gym in Walthamstow area.",
        url: "https://calisthenics-parks.com/spots/2651-en-london-outdoor-gym-walthamstow",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=97+Hecham+Close+Higham+Hill+London+E17+5QT",
        images: ["https://i.imgur.com/Ve54aox.png"]
      }
    ],
    west: [
      {
        name: "WESTBOURNE GREEN OPEN SPACE – CALISTHENICS PARK",
        coordinates: { latitude: 51.5203112, longitude: -0.1888485 },
        address: "W2 18, Bourne Terrace, Warwick Estate, Westbourne Green, Westminster, London, W2 5TH, United Kingdom",
        equipment: ["Pull-up Bars", "Parallel Bars", "Wall Bars", "Ladders"],
        difficulty: "All Levels",
        rating: 4.0,
        hours: "24/7",
        description: "Premier Kenguru.Pro facility with extensive equipment. 5-min walk from Royal Oak station. Popular community spot with excellent bar setup and varied training options.",
        url: "https://calisthenics-parks.com/spots/5890-en-london-calisthenics-park-westbourne-green-open-space",
        mapsUrl: "https://www.google.com/maps/place/Westbourne+Green+Calisthenics+Park/@51.5199179,-0.1891518,3a,86.6y,2.71h,69.99t/data=!3m7!1e1!3m5!1snXRUWeF36hekhZcSY5mboA!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D20.012540553183214%26panoid%3DnXRUWeF36hekhZcSY5mboA%26yaw%3D2.7051787263168183!7i16384!8i8192!4m6!3m5!1s0x4876110c5cce3be7:0xa44c414e41e83497!8m2!3d51.5203112!4d-0.1888485!16s%2Fg%2F11sshv6ydn?entry=ttu&g_ep=EgoyMDI1MDQwOS4wIKXMDSoASAFQAw%3D%3D",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "BOLLO BROOK PARK OUTDOOR FUNCTIONAL GYM",
        coordinates: { latitude: 51.5015368, longitude: -0.2729523 },
        address: "172 Bollo Bridge Road, South Acton, London, W3 8DG, United Kingdom",
        equipment: ["Pull-up Bars", "Monkey Bars", "Wall Bars", "Push-up Bars", "Dip Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Calisthenics setup in Bollo Brook Park with core equipment for bodyweight training.",
        url: "https://calisthenics-parks.com/spots/17007-en-calisthenics-facility-london-bollo-brook-park-outdoor-functional-gym",
        mapsUrl: "https://www.google.com/maps/place/Calisthenics+sports+ground+%2F+outdoor+gym/@51.5012313,-0.274276,18.36z/data=!4m10!1m2!2m1!1sbolo+brook+park+outdoor+gym!3m6!1s0x48760f001d009411:0xaec2cc61b1c15f8!8m2!3d51.5015368!4d-0.2729523!15sChtib2xvIGJyb29rIHBhcmsgb3V0ZG9vciBneW2SAQNneW2qAWUQASofIhtib2xvIGJyb29rIHBhcmsgb3V0ZG9vciBneW0oADIfEAEiGzJY0YzaNeps7RGqNi1R8IIygrMDNKZ9-u906jIfEAIiG2JvbG8gYnJvb2sgcGFyayBvdXRkb29yIGd5beABAA!16s%2Fg%2F11lcfqykr9?entry=ttu&g_ep=EgoyMDI1MDgxMy4wIKXMDSoASAFQAw%3D%3D",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "EXERCISE PARK - HOLLAND PARK",
        coordinates: { latitude: 51.499756, longitude: -0.201853 },
        address: "27 Ilchester Place, Holland, London, W14 8NH",
        equipment: ["Parallel Bars", "Monkey Bars", "Push-up Bars"],
        difficulty: "All Levels",
        rating: 3.0,
        hours: "24/7",
        description: "A well-maintained exercise area within the beautiful Holland Park, offering a range of equipment for a full bodyweight workout.",
        url: "https://calisthenics-parks.com/spots/2610-en-london-exercise-park-holland-park",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=27%20Ilchester%20Place%2C%20Holland%2C%20London%2C%20W14%208NH%2C%20United%20Kingdom",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR FITNESS GYM - HANGER HILL PARK",
        coordinates: { latitude: 51.524276, longitude: -0.295655 },
        address: "4 Hillcrest Rd, London W5 1HW",
        equipment: ["Pull-up Bars", "Parallel Bars"],
        difficulty: "All Levels",
        rating: 3.0,
        hours: "24/7",
        description: "Located at the playground in Hanger Hill Park, this spot features pull-up bars of different heights and a pair of parallel bars, suitable for a variety of exercises.",
        url: "https://calisthenics-parks.com/spots/1090-en-london-outdoor-fitness-studio-hanger-hill-park",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=4%20Hillcrest%20Rd%2C%20London%20W5%201HW%20Pull%20Up%20Bars%20Parallel%20Bar%20Calisthenics%20Outdoor%20Fitness%20Bodyweight%20Exercises%20Sling%20Trainer%20Workouts%20Ninja%20Warrior%20Functional%20Training%20Parkour%20Bootcamp%20Workout%20Obstacle%20Races%20Personal%20Fitness%20Training%20Upcoming%20events%20Load%20upcoming%20events%20Add%20event%20Summary%20of%20editorial%20West%20london%20outdoor%20fitness%20gym.%20At%20the%20big%20playground%20at%20Hanger%20Hill%20Park%20you%20find%203%20pull%20up%20bars%20in%20different%20heights.%20Next%20to%20the%20high%20bars%20you%20find%20a%20pair%20of%20parallel%20bars%20for%20all%20kinds%20of%20dips.%20This%20workout%20spot%20works%20with%20parkour%2C%20street%20workout%2C%20freeletics%2C%20bootcamp%20workout%2C%20outdoor%20fitness%2C%20crossathletics%20and%20bodyweight%20exercises.%20Hanger%20Hill%20Park%20in%20London%20has%20good%20running%20paths%20and%20big%20greens%20for%20football%20too.%20Walker%20James%20(2017)%3A%20Seems%20they've%20removed%20the%20third%20pull-up%20section%20too.%20Now%20you%20have%20to%20do%20pull-ups%20with%20your%20knees%20bent.%20I%20don't%20get%20there%20regularly%20as%20there%20are%20other%20parks%20closer%20to%20home%20but%20these%20are%20my%20favourite%20as%20they%20are%20just%20horizontal%20bars%20with%20a%20choice%20of%20heights.%20On%20the%20plus%20side%20they%20were%20relaying%20the%20bitumen%20on%20the%20paths%20so%20maybe%20the%20workout%20stations%20are%20next%3F%20Walter%20Basile%20(2017)%3A%20Hello%2C%20I've%20sent%20a%20request%20in%20Feb%202017.%20The%20Council%20answered%20saying%20that%20they%20would%20have%20repaired%2C%20but%20it%20is%20still%20like%20this.%20Calisthenics%20parks%20can%20you%20do%20something%20%3F%20Calisthenics%20Parks%20Team%20(2016)%3A%20Thank%20you%20for%20the%20info.%20Sad%20story%20but%20good%20you%20share%20this%20info%20with%20all%20the%20other%20people%20try%20to%20train%20there.%2098percentGorilla%20(2016)%3A%20As%20of%20today%2015%2F12%2F2016%20the%20parallel%20bars%20are%20broken.%20Been%20like%20this%20for%20at%20least%20a%20month%20now%20and%20there%20is%20no%20sign%20of%20any%20repair%20being%20done.%20One%20bar%20competely%20missing%20but%20it's%20still%20possible%20to%20do%20dips%20using%20the%20tops%20of%20the%20support%20posts.%20Will%20post%20again%20when%20this%20has%20been%20fixed.%20View%20more%20details%20Location%201%20Fox%20Lane%2C%20Hanger%20Hill%2C%20London%2C%20W5%201HW%2C%20United%20Kingdom%20United%20Kingdom%20London%20London%20-%20Outdoor%20Fitness%20gym%20-%20Hanger%20Hill%20Park%20Europe%20England%20Workout%20Locations%20Outdoor%20gym%20Fitness%20Trails%20Calisthenics%20Park%20Parkour%20Park%20Workout%20Programs%20%2F%20Fitness%20Apps%20CrossFit%20Runtastic%20Results%20Barstarzz%20BTX%20Workout%20Freeletics%20Workout%20App%20Madbarz%20Fitness%20App%20Frank%20Medrano%20Calisthenics%20Bodyweight%20Workout%20Calisthenic%20Movement%20-%20Training%20Plans%20-%20Personal%20Training%20Baristi%20Workout%20You%20Are%20Your%20Own%20Gym%20by%20Mark%20Lauren%20YKings%20PBT%20(Progressive%20Bodyweight%20Training)%20-%20mobile%20App%20Bar%20Brothers%20Workout%20MovesDB%20-%20Calisthenics%20App%20Calisthenics%20Accessories%20Kettlebell%20Gymnastic%20Rings%20Gym%20Chalk%20Resistance%20Bands%20%2F%20Pull%20Up%20Bands%20Training%20gloves%20%2F%20Fitness%20gloves%20Push%20Up%20Handles%20Recommended%20products%20Load%20ads%20All%20prices%20including%20the%20legally%20determined%20sales%20tax%2C%20plus%20shipping%20charges.%20Errors%20and%20omissions%20excepted.%204%20Comments%20Write%20a%20comment%20Walker%20James%20says%207%20years%20before%20en%20Seems%20they've%20removed%20the%20third%20pull-up%20section%20too.%20Now%20you%20have%20to%20do%20pull-ups%20with%20your%20knees%20bent.%20I%20don't%20get%20there%20regularly%20as%20there%20are%20other%20parks%20closer%20to%20home%20but%20these%20are%20my%20favourite%20as%20they%20are%20just%20horizontal%20bars%20with%20a%20choice%20of%20heights.%20On%20the%20plus%20side%20they%20were%20relaying%20the%20bitumen%20on%20the%20paths%20so%20maybe%20the%20workout%20stations%20are%20next%3F%20Seems%20they've%20removed%20the%20third%20pull-up%20section%20too.%20Now%20you%20have%20to%20do%20pull-ups%20with%20your%20knees%20bent.%20I%20don't%20get%20there%20regularly%20as%20there%20are%20other%20parks%20closer%20to%20home%20but%20these%20are%20my%20favourite%20as%20they%20are%20just%20horizontal%20bars%20with%20a%20choice%20of%20heights.%20On%20the%20plus%20side%20they%20were%20relaying%20the%20bitumen%20on%20the%20paths%20so%20maybe%20the%20workout%20stations%20are%20next%3F%20Submit%20Walter%20Basile%20says%208%20years%20before%20en%20Hello%2C%20I've%20sent%20a%20request%20in%20Feb%202017.%20The%20Council%20answered%20saying%20that%20they%20would%20have%20repaired%2C%20but%20it%20is%20still%20like%20this.%20Calisthenics%20parks%20can%20you%20do%20something%20%3F%20Hello%2C%20I've%20sent%20a%20request%20in%20Feb%202017.%20The%20Council%20answered%20saying%20that%20they%20would%20have%20repaired%2C%20but%20it%20is%20still%20like%20this.%20Calisthenics%20parks%20can%20you%20do%20something%20%3F%20Submit%20Calisthenics%20Parks%20Team%20says%208%20years%20before%20en%20Thank%20you%20for%20the%20info.%20Sad%20story%20but%20good%20you%20share%20this%20info%20with%20all%20the%20other%20people%20try%20to%20train%20there.%20Thank%20you%20for%20the%20info.%20Sad%20story%20but%20good%20you%20share%20this%20info%20with%20all%20the%20other%20people%20try%20to%20train%20there.%20Submit%2098percentGorilla%20says%208%20years%20before%20en%20As%20of%20today%2015%2F12%2F2016%20the%20parallel%20bars%20are%20broken.%20Been%20like%20this%20for%20at%20least%20a%20month%20now%20and%20there%20is%20no%20sign%20of%20any%20repair%20being%20done.%20One%20bar%20competely%20missing%20but%20it's%20still%20possible%20to%20do%20dips%20using%20the%20tops%20of%20the%20support%20posts.%20Will%20post%20again%20when%20this%20has%20been%20fixed.%20As%20of%20today%2015%2F12%2F2016%20the%20parallel%20bars%20are%20broken.%20Been%20like%20this%20for%20at%20least%20a%20month%20now%20and%20there%20is%20no%20sign%20of%20any%20repair%20being%20done.%20One%20bar%20competely%20missing%20but%20it's%20still%20possible%20to%20do%20dips%20using%20the%20tops%20of%20the%20support%20posts.%20Will%20post%20again%20when%20this%20has%20been%20fixed.%20Submit",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR FITNESS STATION - SUNBEAM GARDENS",
        coordinates: { latitude: 51.523972, longitude: -0.220648 },
        address: "35 Shrewsbury Street, Dalgarno, London, W10 5DL",
        equipment: ["Pull-up Bars", "Parallel Bars"],
        difficulty: "All Levels",
        rating: 3.0,
        hours: "24/7",
        description: "A compact fitness station in Sunbeam Gardens with essential equipment for calisthenics training.",
        url: "https://calisthenics-parks.com/spots/2609-en-london-outdoor-fitness-station-sunbeam-gardens",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=35%20Shrewsbury%20Street%2C%20Dalgarno%2C%20London%2C%20W10%205DL%2C%20United%20Kingdom",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR GYM - WORMWOOD SCRUBS",
        coordinates: { latitude: 51.518499, longitude: -0.244746 },
        address: "85 Braybrook Street, College Park, London, W12 0BX",
        equipment: ["Pull-up Bars", "Dip Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "Basic outdoor gym facilities located in the expansive Wormwood Scrubs Park, perfect for combining running with bodyweight exercises.",
        url: "https://calisthenics-parks.com/spots/3086-en-london-outdoor-gym-wormwood-scrubs",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=85%20Braybrook%20Street%2C%20College%20Park%2C%20London%2C%20W12%200BX%2C%20United%20Kingdom",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "OUTDOOR GYM MANDA HILLS BARS",
        coordinates: { latitude: 51.524122, longitude: -0.19517 },
        address: "43 Edbrooke Road, Harrow Road, London, W9 2AY",
        equipment: ["Pull-up Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "A simple trim trail feature with pull-up bars for basic strength training.",
        url: "https://calisthenics-parks.com/spots/16791-en-trim-trail-london-outdoor-gym-manda-hills-bars",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=43%20Edbrooke%20Road%2C%20Harrow%20Road%2C%20London%2C%20W9%202AY%2C%20United%20Kingdom",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "STREET WORKOUT PARK - GURNELL SKATE PARK",
        coordinates: { latitude: 51.52933, longitude: -0.327573 },
        address: "215 Argyle Road, Ealing, London, W13 0BA",
        equipment: ["Pull-up Bars", "Parallel Bars"],
        difficulty: "All Levels",
        rating: 2.0,
        hours: "24/7",
        description: "A small street workout area located near the Gurnell Skate Park, offering basic equipment for calisthenics.",
        url: "https://calisthenics-parks.com/spots/20578-en-outdoor-gym-london-london-street-workout-park-gurnell-skate-park",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=215%20Argyle%20Road%2C%20Ealing%2C%20London%2C%20W13%200BA%2C%20United%20Kingdom",
        images: ["https://i.imgur.com/Ve54aox.png"]
      },
      {
        name: "STREET WORKOUT PARK – PADDINGTON",
        coordinates: { latitude: 51.530906, longitude: -0.19075 },
        address: "104 Grantully Road, Maida Vale, London, W9 1PD",
        equipment: ["Pull-up Bars", "Parallel Bars", "Monkey Bars"],
        difficulty: "All Levels",
        rating: 3.0,
        hours: "24/7",
        description: "A well-equipped street workout park in Paddington with a good variety of bars for a complete upper body and core workout.",
        url: "https://calisthenics-parks.com/spots/474-en-london-street-workout-park-paddington-uk",
        mapsUrl: "https://www.google.com/maps/search/?api=1&query=104%20Grantully%20Road%2C%20Maida%20Vale%2C%20London%2C%20W9%201PD%2C%20United%20Kingdom",
        images: ["https://i.imgur.com/Ve54aox.png"]
      }
    ]
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating)
                ? 'text-[#209D50] fill-[#209D50]'
                : i < rating
                ? 'text-[#209D50] fill-[#209D50] opacity-50'
                : 'text-[#209D50] opacity-20'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-black/60">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const groupParksByRating = (parksList: typeof parks[keyof typeof parks]) => {
    if (sortBy === 'distance' && userCoords) {
      return [{
        rating: 0,
        parks: parksList
      }];
    }

    const groups: { [key: number]: typeof parks[keyof typeof parks] } = {};
    parksList.forEach(park => {
      const rating = Math.floor(park.rating);
      if (!groups[rating]) groups[rating] = [];
      groups[rating].push(park);
    });
    return Object.entries(groups)
      .sort(([a], [b]) => Number(b) - Number(a))
      .map(([rating, parks]) => ({
        rating: Number(rating),
        parks: parks.sort((a, b) => b.rating - a.rating)
      }));
  };

  const filterAndSortParks = (parksList: typeof parks[keyof typeof parks]) => {
    let filteredParks = parksList
      .filter(park => 
        selectedRatings.length === 0 || selectedRatings.includes(Math.floor(park.rating))
      );

    if (sortBy === 'distance' && userCoords) {
      filteredParks.sort((a, b) => calculateDistance(a) - calculateDistance(b));
    } else if (sortBy === 'rating') {
      filteredParks.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'name') {
      filteredParks.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filteredParks;
  };

  const findParkArea = (park: typeof parks[keyof typeof parks][0]) => {
    for (const [key, value] of Object.entries(parks)) {
      if (Array.isArray(value) && value.includes(park)) {
        return areas.find(a => a.id === key)?.name || 'UNKNOWN REGION';
      }
    }
    return 'UNKNOWN REGION';
  };

  return (
    <div className="min-h-screen bg-[#E1DFD9]">
      <section className="pt-32 pb-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="impact-text text-5xl md:text-7xl text-[#209D50] mb-6">
              LONDON PARKS<span className="text-[#E1DFD9]">.</span>
            </h1>
            <p className="text-black/70 text-base md:text-lg max-w-2xl mx-auto px-4">
              Find calisthenics parks in your area of London. Select a region to see available locations.
            </p>
           <p className="text-black/60 text-sm max-w-2xl mx-auto px-4 mt-2">
             Please note: We're currently using publicly available images. We're working on capturing higher quality photos 
             ourselves and will update regularly. Feel free to submit your own park photos through our contact section!
           </p>
          </div>

          <div className="bg-[#E1DFD9] py-4 space-y-4">
            <div className="flex flex-wrap justify-center gap-2">
              {areas.map((area) => (
                <button
                  key={area.id}
                  onClick={() => handleAreaToggle(area.id)}
                  className={`px-4 sm:px-6 md:px-8 py-2.5 md:py-3 rounded-full impact-text text-base sm:text-lg md:text-xl transition-all duration-300
                    ${selectedAreas.includes(area.id)
                      ? 'bg-[#209D50] text-white shadow-md scale-[1.02]' 
                      : 'bg-white/60 text-black hover:bg-white/80'}`}
                >
                  {area.name}
                </button>
              ))}
            </div>

            {(selectedAreas.length > 0 || viewMode === 'list') && (
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/80 rounded-2xl sm:rounded-full p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 w-full sm:w-auto">
                  <span className="text-black/70 impact-text text-sm sm:text-base">FILTER BY RATING:</span>
                  {[4, 3, 2, 1].map(rating => (
                    <button
                      key={rating}
                      onClick={() => handleRatingToggle(rating)}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all duration-300
                        ${selectedRatings.includes(rating)
                          ? 'bg-[#209D50] text-white'
                          : 'bg-black/5 text-black/60 hover:bg-black/10'}`}
                    >
                      {[...Array(rating)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${selectedRatings.includes(rating) ? 'fill-white' : ''}`}
                        />
                      ))}
                    </button>
                  ))}
                  {selectedRatings.length > 0 && (
                    <button
                      onClick={clearFilters}
                      className="ml-2 p-1 rounded-full hover:bg-black/5 transition-colors"
                    >
                      <X className="h-4 w-4 text-black/60" />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-4 ml-auto w-full sm:w-auto justify-center sm:justify-end">
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-black/40" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'rating' | 'name')}
                      className="bg-transparent outline-none text-black/70"
                    >
                      <option value="rating">Highest Rated</option>
                      <option value="distance" disabled={!userCoords}>
                        Nearest First
                      </option>
                      <option value="name">Alphabetical</option>
                    </select>
                  </div>
                  <button
                    onClick={() => setViewMode(prev => prev === 'list' ? 'map' : 'list')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300
                      ${viewMode === 'map' 
                        ? 'bg-[#209D50] text-white' 
                        : 'bg-black/5 text-black/60 hover:bg-black/10'}`}
                  >
                    <Map className="h-5 w-5" />
                    <span className="impact-text">{viewMode === 'list' ? 'MAP VIEW' : 'LIST VIEW'}</span>
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white/80 rounded-2xl sm:rounded-full p-4 sm:p-5 mt-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative flex-1 w-full group">
                  <input
                    type="text"
                    value={postcode}
                    onChange={(e) => handlePostcodeChange(e)}
                    placeholder="ENTER YOUR POSTCODE (e.g., SW1A 1AA)"
                    className="w-full bg-black/5 rounded-full px-6 py-3 pr-12 text-black text-lg
                      border-2 border-transparent focus:border-[#209D50]/50
                      outline-none transition-all duration-300
                      placeholder:text-black/40 impact-text"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {isSearching ? (
                      <Loader2 className="h-5 w-5 text-black/40 animate-spin" />
                    ) : (
                      <Search className="h-5 w-5 text-black/40" />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {userCoords && (
                    <button
                      onClick={() => {
                        setUserCoords(null);
                        setPostcode('');
                        setError(null);
                        setSortBy('rating');
                      }}
                      className="px-4 py-3 rounded-full impact-text text-black/60
                        bg-black/5 hover:bg-black/10 transition-all duration-300"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={() => fetchPostcodeCoords(postcode)}
                    disabled={isSearching || !postcode.trim()}
                    className={`px-8 py-3 rounded-full impact-text text-white
                      transition-all duration-300 whitespace-nowrap
                      ${isSearching || !postcode.trim()
                        ? 'bg-black/20 cursor-not-allowed'
                        : 'bg-[#209D50]/90 hover:bg-[#209D50] border-2 border-black'}`}
                  >
                    {isSearching ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      'FIND NEAREST PARKS'
                    )}
                  </button>
                </div>
              </div>
              
              {error && (
                <p className="mt-3 text-red-500 text-sm text-center impact-text">
                  {error}
                </p>
              )}
              
              {userCoords && (
                <p className="mt-3 text-[#209D50] text-sm text-center">
                  Showing parks sorted by distance from your location
                </p>
              )}
            </div>
          </div>

          {viewMode === 'map' && (
            <div className="mt-8 bg-white/80 rounded-3xl p-8 text-center">
              <Map className="h-12 w-12 text-[#209D50] mx-auto mb-4" />
              <h3 className="impact-text text-2xl text-black mb-2">MAP VIEW COMING SOON</h3>
              <p className="text-black/60">
                We're working on an interactive map to help you find parks more easily.
                Stay tuned for updates!
              </p>
            </div>
          )}

          {viewMode === 'list' && (
            <div className="grid gap-8">
              {groupParksByRating(filterAndSortParks(
                getAllParks()
              )).map(({ rating, parks }) => {
                const isExpanded = expandedRatings[`${rating}`] ?? true;
                return (
                  <div key={rating} className="bg-white/60 rounded-3xl p-6 shadow-lg">
                    <button
                      onClick={() => setExpandedRatings(prev => ({
                        ...prev,
                        [`${rating}`]: !isExpanded
                      }))}
                      className="w-full flex items-center justify-between mb-6"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          {[...Array(rating)].map((_, i) => (
                            <Star key={i} className="h-6 w-6 text-[#209D50] fill-[#209D50]" />
                          ))}
                        </div>
                        <span className="text-black/60 text-sm">({parks.length} parks)</span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-6 w-6 text-[#209D50]" />
                      ) : (
                        <ChevronDown className="h-6 w-6 text-[#209D50]" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
                        {parks.map((park, index) => (
                          <div 
                            key={index}
                            className="bg-white/80 rounded-2xl overflow-hidden shadow-lg 
                              hover:bg-white/90 transition-all duration-300 group
                              hover:shadow-xl hover:-translate-y-1"
                          >
                            <div className="w-full bg-black h-14 rounded-t-2xl flex items-center justify-center px-4
                              impact-text text-white text-xl tracking-wider uppercase text-center">
                              {park.name}
                            </div>
                            {park.images && (
                              <div className="aspect-[16/9] w-full overflow-hidden bg-black/5 relative">
                                {park.images && park.images.length > 0 ? (
                                  <div className="relative h-full group">
                                    <div className="absolute inset-0">
                                      <img
                                        src={park.images[currentImageIndexes[park.name] || 0]}
                                        alt={`${park.name} - View ${(currentImageIndexes[park.name] || 0) + 1}`}
                                        className="w-full h-full object-cover transition-all duration-700"
                                        onError={(e) => {
                                          const target = e.target as HTMLImageElement;
                                          target.src = 'https://i.imgur.com/Ve54aox.png';
                                        }}
                                      />
                                    </div>
                                    {park.images && park.images.length > 1 && (
                                      <>
                                        <div className="absolute inset-x-0 bottom-0 flex justify-center items-center gap-2 p-4 bg-gradient-to-t from-black/50 to-transparent">
                                          {park.images.map((_, idx) => (
                                            <button
                                              key={idx}
                                              onClick={() => setCurrentImageIndexes(prev => ({ ...prev, [park.name]: idx }))}
                                              className={`w-2 h-2 rounded-full transition-all duration-300
                                                ${idx === (currentImageIndexes[park.name] || 0)
                                                  ? 'bg-white scale-125'
                                                  : 'bg-white/50 hover:bg-white/80'}`}
                                              aria-label={`View image ${idx + 1}`}
                                            />
                                          ))}
                                        </div>
                                        <div className="absolute inset-y-0 left-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleImageChange(park.name, 'prev');
                                            }}
                                            className="p-2 m-2 rounded-full bg-black/50 text-white hover:bg-black/70 
                                              transition-colors"
                                            aria-label="Previous image"
                                          >
                                            <ChevronLeft className="w-6 h-6" />
                                          </button>
                                        </div>
                                        <div className="absolute inset-y-0 right-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleImageChange(park.name, 'next');
                                            }}
                                            className="p-2 m-2 rounded-full bg-black/50 text-white hover:bg-black/70 
                                              transition-colors"
                                            aria-label="Next image"
                                          >
                                            <ChevronRight className="w-6 h-6" />
                                          </button>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                ) : park.images && park.images.length > 0 && (
                                  <img
                                    src={park.images[0]}
                                    alt={park.name}
                                    className="w-full h-full object-cover hover:scale-105 transition-all duration-700"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = 'https://i.imgur.com/Ve54aox.png';
                                    }}
                                  />
                                )}
                              </div>
                            )}
                            <div className="p-6 space-y-5">
                              <div className="flex items-center justify-between gap-3">
                                <span className="inline-block text-[11px] sm:text-xs font-medium bg-[#209D50]/10 text-[#209D50] rounded-full px-3 py-1">
                                  {park.difficulty}
                                </span>
                                {(selectedAreas.length !== 1) && (
                                  <span className="text-[11px] sm:text-xs font-medium bg-black/5 text-black/60 rounded-full px-3 py-1">
                                    {findParkArea(park)}
                                  </span>
                                )}
                              </div>

                              <div className="grid sm:grid-cols-[1fr,auto] gap-3">
                                <div className="flex items-start gap-2 min-w-0">
                                  <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                  <span className="text-sm text-black/70 leading-snug whitespace-normal break-words">
                                    {park.address}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 whitespace-nowrap">
                                  <Clock className="h-4 w-4 flex-shrink-0" />
                                  <span className="text-sm text-black/70">{park.hours}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 py-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < Math.floor(park.rating)
                                        ? 'text-[#209D50] stroke-[#209D50] fill-[#209D50]'
                                        : 'text-[#209D50]/20 stroke-[#209D50]/20'
                                    }`}
                                  />
                                ))}
                                <span className="text-sm text-black/50">
                                  {park.rating.toFixed(1)}
                                </span>
                              </div>

                              <p className="text-sm text-black/70 leading-relaxed">
                                {park.description}
                              </p>

                              <div className="flex flex-wrap gap-2">
                                {park.equipment.map((item, i) => (
                                  <span
                                    key={i}
                                    className="text-xs bg-black/5 text-black/80 rounded-full px-3 py-1.5"
                                  >
                                    {item}
                                  </span>
                                ))}
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
                                <a
                                  href={park.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (park.url) window.open(park.url, '_blank', 'noopener,noreferrer');
                                  }}
                                  className="bg-white text-black border-2 border-black w-full rounded-lg h-12 sm:h-11 flex items-center justify-center impact-text text-sm tracking-wide hover:bg-black/5 transition-colors"
                                >
                                  VIEW FULL INFO
                                </a>
                                {park.mapsUrl && (
                                  <a
                                    href={park.mapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (park.mapsUrl) window.open(park.mapsUrl, '_blank', 'noopener,noreferrer');
                                    }}
                                    className="bg-black text-white rounded-lg border-2 border-black w-full h-12 sm:h-11 flex items-center justify-center impact-text text-sm tracking-wide hover:bg-black/80 transition-colors"
                                  >
                                    OPEN IN MAPS
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}