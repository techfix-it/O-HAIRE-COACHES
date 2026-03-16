import { MongoClient, ObjectId } from 'mongodb';

const uri = "mongodb+srv://O-HAIRE:n3EVEdOEM6DSLAfl@cluster-ohc.xj7b6ye.mongodb.net/?appName=Cluster-OHC";
const client = new MongoClient(uri);

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
    await db.collection('sitesettings').deleteMany({});

    // 1. Seed Venues
    console.log("Seeding Venues...");
    const venueData = [
      { _id: new ObjectId(), name: "3Arena", address: "North Wall Quay", city: "Dublin" },
      { _id: new ObjectId(), name: "Malahide Castle", address: "Malahide", city: "Dublin" },
      { _id: new ObjectId(), name: "Marlay Park", address: "Grange Rd", city: "Dublin" },
      { _id: new ObjectId(), name: "Slane Castle", address: "Slane", city: "Meath" },
      { _id: new ObjectId(), name: "Croke Park", address: "Jones' Rd", city: "Dublin" },
      { _id: new ObjectId(), name: "Aviva Stadium", address: "Lansdowne Rd", city: "Dublin" },
      { _id: new ObjectId(), name: "St. Anne's Park", address: "Raheny", city: "Dublin" },
      { _id: new ObjectId(), name: "RDS Arena", address: "Merrion Rd", city: "Dublin" }
    ];
    await db.collection('venues').insertMany(venueData);

    const arena3 = venueData[0]._id;
    const malahide = venueData[1]._id;
    const marlay = venueData[2]._id;
    const slane = venueData[3]._id;
    const croke = venueData[4]._id;
    const aviva = venueData[5]._id;
    const stAnnes = venueData[6]._id;
    const rds = venueData[7]._id;

    // 2. Seed Pickup Locations (Roscommon / Midlands Area)
    console.log("Seeding Pickup Locations...");
    const pickupData = [
      { _id: new ObjectId(), name: "Roscommon Town", description: "Casey's Centra / SuperValu", price: 30 },
      { _id: new ObjectId(), name: "Athlone", description: "B&Q / TUS Athlone / Prince of Wales", price: 25 },
      { _id: new ObjectId(), name: "Longford", description: "Longford Train Station", price: 25 },
      { _id: new ObjectId(), name: "Ballymahon", description: "Main Street (Post Office)", price: 25 },
      { _id: new ObjectId(), name: "Lanesborough", description: "The Green / Bridge", price: 30 },
      { _id: new ObjectId(), name: "Strokestown", description: "The Square", price: 35 },
      { _id: new ObjectId(), name: "Castlerea", description: "The Square", price: 35 },
      { _id: new ObjectId(), name: "Boyle", description: "King House", price: 35 },
      { _id: new ObjectId(), name: "Ballinasloe", description: "Emerald Star", price: 25 },
      { _id: new ObjectId(), name: "Carrick-on-Shannon", description: "The Landmark Hotel", price: 35 },
      { _id: new ObjectId(), name: "Mullingar", description: "The Joe Dolan Statue", price: 20 },
      { _id: new ObjectId(), name: "Moate", description: "The Grand Hotel", price: 25 },
      { _id: new ObjectId(), name: "Tulsk", description: "The Crossroads", price: 30 },
      { _id: new ObjectId(), name: "Knockcroghery", description: "The Clay Pipe", price: 30 },
      { _id: new ObjectId(), name: "Lecarrow", description: "The Yew Tree", price: 30 },
      { _id: new ObjectId(), name: "Curraghboy", description: "Cronin's Pub", price: 30 }
    ];
    await db.collection('pickuplocations').insertMany(pickupData.map(p => ({ ...p, time: "TBC", venue: croke }))); // Default venue ref

    // 3. Seed 16 Events
    console.log("Seeding 16 Events...");
    const eventData = [
      { title: "Coldplay: Music of the Spheres", date: "2025-08-29", venue: croke, img: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14" },
      { title: "Oasis: Live '25 (Saturday)", date: "2025-08-16", venue: croke, img: "https://images.unsplash.com/photo-1514525253361-bee8d4adae5f" },
      { title: "Oasis: Live '25 (Sunday)", date: "2025-08-17", venue: croke, img: "https://images.unsplash.com/photo-1514525253361-bee8d4adae5f" },
      { title: "Billie Eilish", date: "2025-07-26", venue: arena3, img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745" },
      { title: "Catfish and the Bottlemen", date: "2025-08-31", venue: marlay, img: "https://images.unsplash.com/photo-1459749411177-042180ce673c" },
      { title: "Bruce Springsteen", date: "2025-05-19", venue: croke, img: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9" },
      { title: "Ed Sheeran: +-=÷x Tour", date: "2025-07-12", venue: croke, img: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a" },
      { title: "P!nk: Summer Carnival", date: "2025-06-20", venue: aviva, img: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b" },
      { title: "Foo Fighters", date: "2025-06-27", venue: marlay, img: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c" },
      { title: "Noah Kahan", date: "2025-07-04", venue: marlay, img: "https://images.unsplash.com/photo-1526218626217-dc65a29bb444" },
      { title: "Hozier", date: "2025-07-05", venue: marlay, img: "https://images.unsplash.com/photo-1543900694-13e9cdadac65" },
      { title: "Kygo", date: "2025-11-15", venue: arena3, img: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9" },
      { title: "Tate McRae", date: "2025-05-20", venue: arena3, img: "https://images.unsplash.com/photo-1514525253361-bee8d4adae5f" },
      { title: "Sabrina Carpenter", date: "2025-03-03", venue: arena3, img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745" },
      { title: "Iron Maiden", date: "2025-06-21", venue: arena3, img: "https://images.unsplash.com/photo-1459749411177-042180ce673c" },
      { title: "Dua Lipa", date: "2025-06-24", venue: aviva, img: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a" }
    ];

    const insertedEvents = await db.collection('events').insertMany(eventData.map(e => ({
      _id: new ObjectId(),
      title: e.title,
      date: new Date(e.date + "T20:00:00Z"),
      venue: e.venue,
      description: `Official coach service for ${e.title} at ${venueData.find(v => v._id === e.venue).name}.`,
      imageUrl: e.img + "?auto=format&fit=crop&q=80&w=800",
      price: 90
    })));

    // 4. Seed Bus Routes (Connect all pickups to all events)
    console.log("Seeding Bus Routes (Connecting pickups)...");
    const routes = [];
    const eventIds = Object.values(insertedEvents.insertedIds);
    for (const eventId of eventIds) {
      for (const pickup of pickupData) {
        routes.push({
          event: eventId,
          pickupLocation: pickup._id,
          departureTime: "14:00",
          price: pickup.price,
          capacity: 53,
          booked: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }
    await db.collection('busroutes').insertMany(routes);

    // 5. Seed Site Settings
    console.log("Seeding Site Settings...");
    const settingsData = [
      {
        page_key: "home",
        title: "GET THERE WITH O'HAIRE",
        description: "Premium return coach services to Ireland's biggest concerts and festivals. Serving Roscommon and the Midlands.",
        image_url: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=1920",
        button_text: "Browse Concerts",
        button_link: "/concerts"
      },
      {
        page_key: "concerts",
        title: "UPCOMING CONCERTS",
        subtitle: "The full lineup of shows we are covering this season.",
        image_url: "https://images.unsplash.com/photo-1514525253361-bee8d4adae5f?auto=format&fit=crop&q=80&w=1920"
      },
      {
        page_key: "bus-info",
        title: "PICKUP POINTS",
        subtitle: "We serve 16+ locations across Roscommon, Westmeath, and Longford.",
        bus_pickup_locations: "Our primary pickup points include Roscommon, Athlone, Longford, Ballymahon, and more.",
        bus_policy_text: "• No alcohol permitted on board\n• No smoking or vaping\n• Respect your driver\n+353 (0) 87 900 4876"
      }
    ];
    await db.collection('sitesettings').insertMany(settingsData);

    console.log("✅ Database successfully seeded with 16 events!");
  } catch (err) {
    console.error("❌ Seeding error:", err);
  } finally {
    await client.close();
  }
}

seed();
