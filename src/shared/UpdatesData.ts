interface UpdateData {
    title: string;
    description: string;
    version: string;
    image: string;
}

const updateData: UpdateData[] = [
    {
        title: "RACE UPDATE",
        description: "New tracks have been added, including high-speed straights and competitive curves. Performance improvements and bug fixes ensure a smoother, more competitive racing experience.",
        version: "v2.1.0",
        image: "https://cataas.com/cat/cute?width=400&height=200"
    },
    {
        title: "VEHICLE SYSTEM",
        description: "Enhanced vehicle physics and new customization options. Improved handling mechanics and expanded tuning capabilities for the ultimate racing experience.",
        version: "v2.0.8",
        image: "https://cataas.com/cat/kitten?width=400&height=200"
    },
    {
        title: "SECURITY UPDATE",
        description: "Enhanced anti-cheat system and improved server stability. New security measures to ensure fair play and better protection against exploits.",
        version: "v2.0.5",
        image: "https://cataas.com/cat/orange?width=400&height=200"
    },
    {
        title: "UI OVERHAUL",
        description: "Complete redesign of the user interface with modern styling. Improved accessibility and responsive design for better user experience.",
        version: "v2.0.3",
        image: "https://cataas.com/cat/black?width=400&height=200"
    },
    {
        title: "NEW VEHICLES",
        description: "Added a variety of new vehicles including sports cars, motorcycles, and trucks. Each vehicle comes with unique handling characteristics and customization options.",
        version: "v2.0.0",
        image: "https://cataas.com/cat/white?width=400&height=200"
    },
    {
        title: "INITIAL RELEASE",
        description: "Welcome to our racing server! Experience thrilling races, competitive gameplay, and a vibrant community. Get ready to hit the tracks and show off your skills!",
        version: "v1.0.0",
        image: "https://cataas.com/cat/sleepy?width=400&height=200"
    }
];

export default updateData;