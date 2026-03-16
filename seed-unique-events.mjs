import { MongoClient, ObjectId } from 'mongodb';

const uri = "mongodb+srv://O-HAIRE:n3EVEdOEM6DSLAfl@cluster-ohc.xj7b6ye.mongodb.net/?appName=Cluster-OHC";
const client = new MongoClient(uri);

// Data Provided by User (JSON Array)
const jsonData = [
  { "id": "TICKET-2873", "ticket_title": "Bus to Metallica 19th June", "slug": "bus-to-metallica-19th-june", "date": "2026-06-19", "description": "Transporte de autocarro para o concerto de Metallica no Marlay Park. Inclui produção massiva com pirotecnia e clássicos como Enter Sandman.", "values": { "_ticket-price": "30.00", "currency": "EUR" }, "images": ["https://ohaireconcertcoaches.ie/wp-content/uploads/2025/01/placeholder-2.png"], "event_details": { "_event-venue": "Marlay Park", "_time": "16:00 (Portões)", "_event-day": "Sexta-feira", "venue_location": "Rathfarnham, Dublin 16" } },
  { "id": "TICKET-2834", "ticket_title": "Bus to Bon Jovi 30th August", "slug": "bus-to-bon-jovi-30th-august", "date": "2026-08-30", "description": "Transfer de ida e volta para o concerto de Bon Jovi no Croke Park. Saídas de Roscommon, Longford e Mullingar.", "values": { "_ticket-price": "30.00", "currency": "EUR" }, "images": ["https://ohaireconcertcoaches.ie/wp-content/uploads/2026/02/westlife_25th_september_250x250.png"], "event_details": { "_event-venue": "Croke Park", "_time": "A confirmar", "_event-day": "Domingo", "venue_location": "Jones' Rd, Drumcondra, Dublin 3" } },
  { "id": "TICKET-253", "ticket_title": "Pitbull 3 Arena 19th February 2025", "slug": "pitbull-3-arena-19th-february-2025", "date": "2025-02-19", "description": "Serviço de autocarro concert coach para o espetáculo de Pitbull na 3Arena.", "values": { "_ticket-price": "59.85", "currency": "EUR" }, "images": ["https://ohaireconcertcoaches.ie/wp-content/uploads/2025/01/image_13-2.jpeg"], "event_details": { "_event-venue": "3Arena", "_time": "18:30", "_event-day": "Quarta-feira", "venue_location": "North Wall Quay, Dublin" } },
  { "id": "TICKET-2861", "ticket_title": "Longitude Festival - Marlay Park", "slug": "longitude-festival-6th-july", "date": "2026-07-06", "description": "Transfer para o Longitude Festival. Ambiente de alta energia e moda festivaleira.", "values": { "_ticket-price": "30.00", "currency": "EUR" }, "images": [], "event_details": { "_event-venue": "Marlay Park", "_time": "Todo o dia", "_event-day": "Sábado", "venue_location": "Dublin" } },
  { "id": "TICKET-2844", "ticket_title": "Benson Boone - Malahide Castle", "slug": "benson-boone-malahide-castle", "date": "2025-10-24", "description": "Concerto ao vivo no histórico Malahide Castle.", "values": { "_ticket-price": "Varia", "currency": "EUR" }, "images": ["https://ohaireconcertcoaches.ie/wp-content/uploads/2025/06/Benson-boone-e1758201722418.webp"], "event_details": { "_event-venue": "Malahide Castle", "_time": "17:00", "_event-day": "Sexta-feira", "venue_location": "Malahide, Co. Dublin" } },
  { "id": "TICKET-2875", "ticket_title": "Kodaline 20th June", "slug": "kodaline-20th-june", "date": "2026-06-20", "description": "Bus transfer para o concerto de Kodaline.", "values": { "_ticket-price": "30.00", "currency": "EUR" }, "images": [], "event_details": { "_event-venue": "St. Anne’s Park", "_time": "16:00", "_event-day": "Sábado", "venue_location": "Raheny, Dublin" } },
  { "id": "TICKET-2751", "ticket_title": "The Script - Aviva Stadium", "slug": "the-script-aviva-stadium", "date": "2025-07-12", "description": "The Script regressa ao Aviva Stadium para uma noite inesquecível.", "values": { "_ticket-price": "30.00", "currency": "EUR" }, "images": ["https://ohaireconcertcoaches.ie/wp-content/uploads/2025/01/logo-concert-1.jpeg"], "event_details": { "_event-venue": "Aviva Stadium", "_time": "18:00", "_event-day": "Sábado", "venue_location": "Lansdowne Rd, Dublin 4" } },
  { "id": "TICKET-2800", "ticket_title": "Justin Timberlake - Malahide", "slug": "justin-timberlake-malahide", "date": "2025-06-26", "description": "Forget Tomorrow World Tour em Dublin.", "values": { "_ticket-price": "30.00", "currency": "EUR" }, "images": [], "event_details": { "_event-venue": "Malahide Castle", "_time": "17:00", "_event-day": "Quinta-feira", "venue_location": "Malahide" } },
  { "id": "TICKET-2810", "ticket_title": "Alanis Morissette - Malahide", "slug": "alanis-morissette-malahide", "date": "2025-06-29", "description": "Alanis Morissette ao vivo com convidados especiais.", "values": { "_ticket-price": "30.00", "currency": "EUR" }, "images": [], "event_details": { "_event-venue": "Malahide Castle", "_time": "17:00", "_event-day": "Domingo", "venue_location": "Malahide" } },
  { "id": "TICKET-2825", "ticket_title": "Snow Patrol - Phoenix Park", "slug": "snow-patrol-phoenix-park", "date": "2025-07-05", "description": "Concerto ao ar livre no Phoenix Park.", "values": { "_ticket-price": "35.00", "currency": "EUR" }, "images": [], "event_details": { "_event-venue": "Phoenix Park", "_time": "16:00", "_event-day": "Sábado", "venue_location": "Dublin 8" } },
  { "id": "TICKET-2780", "ticket_title": "Cat Burns - Malahide Castle", "slug": "cat-burns-malahide", "date": "2025-06-23", "description": "Suporte para Teddy Swims no Malahide Castle.", "values": { "_ticket-price": "Incluído no transfer", "currency": "EUR" }, "images": [], "event_details": { "_event-venue": "Malahide Castle", "_time": "17:00", "_event-day": "Terça-feira", "venue_location": "Malahide" } },
  { "id": "TICKET-2795", "ticket_title": "The Castellows - Malahide", "slug": "the-castellows-malahide", "date": "2025-06-23", "description": "Abertura para o show principal no Malahide Castle.", "values": { "_ticket-price": "N/A", "currency": "EUR" }, "images": [], "event_details": { "_event-venue": "Malahide Castle", "_time": "17:00", "_event-day": "Terça-feira", "venue_location": "Malahide" } },
  { "id": "TICKET-2900", "ticket_title": "Oasis - Croke Park (Bus)", "slug": "oasis-croke-park-bus", "date": "2025-08-16", "description": "Transfer exclusivo para a reunião de Oasis em Dublin.", "values": { "_ticket-price": "35.00", "currency": "EUR" }, "images": [], "event_details": { "_event-venue": "Croke Park", "_time": "A confirmar", "_event-day": "Sábado", "venue_location": "Dublin" } },
  { "id": "TICKET-2910", "ticket_title": "Iron Maiden - Malahide Castle", "slug": "iron-maiden-malahide", "date": "2025-06-21", "description": "Run For Your Lives World Tour.", "values": { "_ticket-price": "30.00", "currency": "EUR" }, "images": [], "event_details": { "_event-venue": "Malahide Castle", "_time": "16:00", "_event-day": "Sábado", "venue_location": "Malahide" } },
  { "id": "TICKET-2920", "ticket_title": "Billie Eilish - 3Arena", "slug": "billie-eilish-3arena", "date": "2025-07-26", "description": "Hit Me Hard and Soft: The Tour.", "values": { "_ticket-price": "30.00", "currency": "EUR" }, "images": [], "event_details": { "_event-venue": "3Arena", "_time": "18:30", "_event-day": "Sábado", "venue_location": "Dublin" } },
  { "id": "TICKET-2930", "ticket_title": "Sabrina Carpenter - 3Arena", "slug": "sabrina-carpenter-3arena", "date": "2025-03-03", "description": "Short n' Sweet Tour transfer service.", "values": { "_ticket-price": "30.00", "currency": "EUR" }, "images": [], "event_details": { "_event-venue": "3Arena", "_time": "18:30", "_event-day": "Segunda-feira", "venue_location": "Dublin" } },
  { "id": "TICKET-2940", "ticket_title": "Cyndi Lauper - 3Arena", "slug": "cyndi-lauper-3arena", "date": "2025-02-11", "description": "Girls Just Wanna Have Fun Farewell Tour.", "values": { "_ticket-price": "30.00", "currency": "EUR" }, "images": [], "event_details": { "_event-venue": "3Arena", "_time": "18:30", "_event-day": "Terça-feira", "venue_location": "Dublin" } },
  { "id": "TICKET-2950", "ticket_title": "Niall Horan - Royal Hospital Kilmainham", "slug": "niall-horan-rhk", "date": "2025-08-23", "description": "The Show Live On Tour.", "values": { "_ticket-price": "30.00", "currency": "EUR" }, "images": [], "event_details": { "_event-venue": "Royal Hospital Kilmainham", "_time": "17:00", "_event-day": "Sábado", "venue_location": "Dublin 8" } }
];

// Data Provided by User (JS Array format)
const jsArrayData = [
  { title: "Westlife", date: "2026-09-26T20:00", venueStr: "3Arena", price: 30, image: "https://ohaireconcertcoaches.ie/wp-content/uploads/2026/02/westlife_250x250.png" },
  { title: "Westlife", date: "2026-09-25T20:00", venueStr: "3Arena", price: 30, image: "https://ohaireconcertcoaches.ie/wp-content/uploads/2026/02/westlife_25th_september_250x250.png" },
  { title: "Westlife", date: "2026-09-20T20:00", venueStr: "3Arena", price: 30, image: "https://ohaireconcertcoaches.ie/wp-content/uploads/2026/02/ChatGPT-Image-Feb-5-2026-12_41_00-PM.png" },
  { title: "Westlife", date: "2026-09-19T20:00", venueStr: "3Arena", price: 30, image: "https://ohaireconcertcoaches.ie/wp-content/uploads/2026/02/ChatGPT-Image-Feb-5-2026-12_55_38-PM-e1770297528698.png" },
  { title: "Westlife", date: "2026-09-18T20:00", venueStr: "3Arena", price: 30, image: "https://ohaireconcertcoaches.ie/wp-content/uploads/2026/02/ChatGPT-Image-Feb-5-2026-12_51_48-PM-e1770297695492.png" },
  { title: "Bon Jovi", date: "2026-08-30T20:00", venueStr: "Croke Park", price: 30, image: "https://ohaireconcertcoaches.ie/wp-content/uploads/2026/02/bon_jovi_250x250.png" },
  { title: "The Weeknd", date: "2026-08-22T20:00", venueStr: "Croke Park", price: 30, image: "https://ohaireconcertcoaches.ie/wp-content/uploads/2026/02/weeknd_croke_park_250x250.png" },
  { title: "Luke Combs", date: "2026-07-19T15:00", venueStr: "Slane Castle", price: 35, image: "https://ohaireconcertcoaches.ie/wp-content/uploads/2026/02/Luke_Combs_250x250.png" },
  { title: "Luke Combs", date: "2026-07-18T15:00", venueStr: "Slane Castle", price: 35, image: "https://ohaireconcertcoaches.ie/wp-content/uploads/2026/02/Luke_Combs_250x250.png" },
  { title: "Dermot Kennedy", date: "2026-07-12T19:00", venueStr: "Aviva Stadium", price: 30, image: "https://ohaireconcertcoaches.ie/wp-content/uploads/2026/02/dermot_kennedy_250x250.png" },
  { title: "Dermot Kennedy", date: "2026-07-11T19:00", venueStr: "Aviva Stadium", price: 30, image: "https://ohaireconcertcoaches.ie/wp-content/uploads/2026/02/dermot_kennedy_250x250.png" },
  { title: "Take That", date: "2026-07-04T19:00", venueStr: "Aviva Stadium", price: 30, image: "https://ohaireconcertcoaches.ie/wp-content/uploads/2026/02/take_that_aviva_250x250.png" },
  { title: "Lewis Capaldi", date: "2026-06-24T16:00", venueStr: "Marlay Park", price: 30, image: "https://ohaireconcertcoaches.ie/wp-content/uploads/2026/02/lewis_capaldi_250x250.png" },
  { title: "Lewis Capaldi", date: "2026-06-23T16:00", venueStr: "Marlay Park", price: 30, image: "https://ohaireconcertcoaches.ie/wp-content/uploads/2026/02/lewis_capaldi_250x250.png" },
  { title: "Longitude 4th July", date: "2026-07-04T14:00", venueStr: "Marlay Park", price: 40, image: "https://ohaireconcertcoaches.ie/wp-content/uploads/2026/02/longitude_2026_250x250.png" },
  { title: "Longitude 5th July", date: "2026-07-05T14:00", venueStr: "Marlay Park", price: 40, image: "https://ohaireconcertcoaches.ie/wp-content/uploads/2026/02/longitude_2026_250x250.png" },
  { title: "Katy Perry", date: "2026-06-24T17:00", venueStr: "Malahide Castle", price: 30, image: "https://ohaireconcertcoaches.ie/wp-content/uploads/2026/02/katy_perry_250x250.png" },
  { title: "Teddy Swims", date: "2026-06-23T17:00", venueStr: "Malahide Castle", price: 30, image: "https://ohaireconcertcoaches.ie/wp-content/uploads/2026/02/ohaire_teddy_swims_250x250.png" },
  { title: "Metallica", date: "2026-06-21T18:00", venueStr: "Aviva Stadium", price: 30, image: "https://ohaireconcertcoaches.ie/wp-content/uploads/2026/02/metallica_250x250.png" },
  { title: "Metallica", date: "2026-06-19T18:00", venueStr: "Aviva Stadium", price: 30, image: "https://ohaireconcertcoaches.ie/wp-content/uploads/2026/02/metallica_250x250.png" },
  { title: "Kodaline", date: "2026-06-20T16:00", venueStr: "Malahide Castle", price: 30, image: "https://ohaireconcertcoaches.ie/wp-content/uploads/2026/02/OHaire_Concert_Coaches_250x250.png" },
  { title: "Kingfishr", date: "2026-06-13T16:00", venueStr: "Malahide Castle", price: 30, image: "https://ohaireconcertcoaches.ie/wp-content/uploads/2026/02/kingfishr_250x250.png" }
];

async function seed() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    const db = client.db();

    console.log("Cleaning collections...");
    await db.collection('venues').deleteMany({});
    await db.collection('pickuplocations').deleteMany({});
    await db.collection('events').deleteMany({});
    await db.collection('busroutes').deleteMany({});
    // We won't delete sitesettings since it's un-affected and might be useful

    // 1. Process and Merge Events
    const allEventsUnfiltered = [];

    // Parse JSON Array
    jsonData.forEach(item => {
      // Format date
      let parsedDate = item.date;
      if (item.event_details?._time && !item.event_details._time.includes('Todo') && !item.event_details._time.includes('A confirmar')) {
        const timePart = item.event_details._time.split(' ')[0]; // Handle "16:00 (Portões)"
        parsedDate = `${item.date}T${timePart}:00Z`;
      } else {
        parsedDate = `${item.date}T20:00:00Z`; // Default 20:00
      }

      let price = 30;
      if (item.values?.['_ticket-price']) {
         const parsedPrice = parseFloat(item.values['_ticket-price']);
         if (!isNaN(parsedPrice)) price = parsedPrice;
      }

      // Cleanup title: remove "Bus to" from title if it exists to match standard formats like "Bon Jovi"
      let cleanTitle = item.ticket_title.replace(/^Bus to /i, '').trim();
      // Sometimes dates are in titles like "Bon Jovi 30th August", let's leave it for now or clean if we want perfect match, but based on user prompt we just deduplicate over title/date.

      allEventsUnfiltered.push({
        title: cleanTitle,
        date: new Date(parsedDate),
        venueName: item.event_details?.['_event-venue'] || 'TBC',
        venueLocation: item.event_details?.venue_location || '',
        price: price,
        imageUrl: item.images && item.images.length > 0 ? item.images[0] : "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=1920",
        description: item.description || ''
      });
    });

    // Parse JS Array
    jsArrayData.forEach(item => {
      allEventsUnfiltered.push({
        title: item.title,
        date: new Date(item.date.endsWith('Z') ? item.date : item.date + ":00Z"),
        venueName: item.venueStr || 'TBC',
        venueLocation: '', 
        price: item.price,
        imageUrl: item.image || "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=1920",
        description: `${item.title} at ${item.venueStr}`
      });
    });

    // 2. Deduplicate Events
    const uniqueEventsMap = new Map();
    allEventsUnfiltered.forEach(event => {
      // Create a unique key using a normalized title and date (YYYY-MM-DD)
      const dateStr = event.date.toISOString().split('T')[0];
      // Basic normalization text
      const normalizedTitle = event.title.toLowerCase().replace(/[^a-z0-9]/g, '');
      const key = `${normalizedTitle}_${dateStr}`;
      
      // If the map already has this event, maybe prefer the one with better image/description
      if (!uniqueEventsMap.has(key)) {
        uniqueEventsMap.set(key, event);
      } else {
         const existing = uniqueEventsMap.get(key);
         // If newer one has a real description vs placeholder, swap them
         if (event.description.length > existing.description.length && event.description !== `${event.title} at ${event.venueName}`) {
             uniqueEventsMap.set(key, event);
         }
      }
    });

    const uniqueEventsList = Array.from(uniqueEventsMap.values());
    console.log(`Found ${uniqueEventsList.length} unique events after deduplication from ${allEventsUnfiltered.length} total entries.`);


    // 3. Extract Venues and Generate UUIDs (ObjectIds)
    const venueNameMap = new Map();
    uniqueEventsList.forEach(e => {
       if (!venueNameMap.has(e.venueName)) {
           venueNameMap.set(e.venueName, {
               _id: new ObjectId(),
               name: e.venueName,
               address: e.venueLocation || "TBC",
               city: "TBC",
               createdAt: new Date(),
               updatedAt: new Date()
           });
       } else if (e.venueLocation && venueNameMap.get(e.venueName).address === "TBC") {
           // update address if found better one
           venueNameMap.get(e.venueName).address = e.venueLocation;
       }
    });
    const venuesToInsert = Array.from(venueNameMap.values());
    if (venuesToInsert.length > 0) {
        await db.collection('venues').insertMany(venuesToInsert);
        console.log(`Successfully inserted ${venuesToInsert.length} venues.`);
    }

    // 4. Create Pickup Locations
    const pickupData = [
      { name: "Roscommon Town", description: "Casey's Centra / SuperValu", price: 30 },
      { name: "Athlone", description: "B&Q / TUS Athlone / Prince of Wales", price: 25 },
      { name: "Longford", description: "Longford Train Station", price: 25 },
      { name: "Ballymahon", description: "Main Street (Post Office)", price: 25 },
      { name: "Lanesborough", description: "The Green / Bridge", price: 30 },
      { name: "Strokestown", description: "The Square", price: 35 },
      { name: "Castlerea", description: "The Square", price: 35 },
      { name: "Boyle", description: "King House", price: 35 },
      { name: "Ballinasloe", description: "Emerald Star", price: 25 },
      { name: "Carrick-on-Shannon", description: "The Landmark Hotel", price: 35 },
      { name: "Mullingar", description: "The Joe Dolan Statue", price: 20 },
      { name: "Moate", description: "The Grand Hotel", price: 25 },
      { name: "Tulsk", description: "The Crossroads", price: 30 },
      { name: "Knockcroghery", description: "The Clay Pipe", price: 30 },
      { name: "Lecarrow", description: "The Yew Tree", price: 30 },
      { name: "Curraghboy", description: "Cronin's Pub", price: 30 }
    ];

    // Give them a default venue reference (first venue) as required by schema (usually it doesnt matter for pickup, its just how schema is implemented)
    const defaultVenueId = venuesToInsert.length > 0 ? venuesToInsert[0]._id : new ObjectId();
    
    const pickupsToInsert = pickupData.map(p => ({
        _id: new ObjectId(),
        name: p.name,
        description: p.description,
        price: p.price,
        time: "TBC",
        venue: defaultVenueId,
        createdAt: new Date(),
        updatedAt: new Date()
    }));
    await db.collection('pickuplocations').insertMany(pickupsToInsert);
    console.log(`Successfully inserted ${pickupsToInsert.length} pickup locations.`);

    // 5. Insert Unique Events with UUIDs
    const eventsToInsert = uniqueEventsList.map(e => ({
        _id: new ObjectId(),
        title: e.title,
        date: e.date,
        venue: venueNameMap.get(e.venueName)._id,
        description: e.description,
        imageUrl: e.imageUrl,
        price: e.price,
        createdAt: new Date(),
        updatedAt: new Date()
    }));
    await db.collection('events').insertMany(eventsToInsert);
    console.log(`Successfully inserted ${eventsToInsert.length} events.`);

    // 6. Connect Events and Pickups via BusRoutes
    const routesToInsert = [];
    eventsToInsert.forEach(event => {
        pickupsToInsert.forEach(pickup => {
            routesToInsert.push({
                _id: new ObjectId(),
                event: event._id,
                pickupLocation: pickup._id,
                departureTime: "TBC",
                price: pickup.price, // base price on pickup
                capacity: 53,
                booked: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        });
    });
    
    await db.collection('busroutes').insertMany(routesToInsert);
    console.log(`Successfully inserted ${routesToInsert.length} bus routes connecting events and pickups.`);

    console.log("✅ Database successfully seeded with processed data!");
  } catch (err) {
    console.error("❌ Seeding error:", err);
  } finally {
    await client.close();
  }
}

seed();
