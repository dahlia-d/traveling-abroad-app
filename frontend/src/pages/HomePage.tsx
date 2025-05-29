export function HomePage() {
    return (
        <div className="flex flex-col items-center gap-5 p-6">
            <h1 className="text-center font-serif text-3xl font-semibold italic">
                Here to help you with your travel plans!
            </h1>
            <div className="max-w-4xl font-serif text-xl">
                In today’s fast-paced world, travel and mobility have become
                essential parts of everyday life. This web-based application is
                designed to simplify international travel planning by providing
                real-time, reliable, and user-generated information about
                traffic conditions at border crossing checkpoints. Beyond just
                live data, the platform allows users to share personal travel
                experiences through posts, including details such as waiting
                times, vehicle type, crossing time, and other observations.
                These posts help create a community-driven information source
                that complements official data, giving travelers a more complete
                and up-to-date picture of border conditions.
            </div>
        </div>
    );
}
