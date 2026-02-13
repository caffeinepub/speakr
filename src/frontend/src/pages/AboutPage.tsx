export default function AboutPage() {
  return (
    <div className="container px-4 py-12 md:py-16 max-w-4xl mx-auto">
      <div className="space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          About SPEAKR
        </h1>
        <div className="prose prose-lg max-w-none text-muted-foreground">
          <p className="text-xl">
            Content coming soon. We're building a platform that gives everyone a voice.
          </p>
          <p>
            SPEAKR is dedicated to empowering creators and listeners through audio content.
            Stay tuned for more information about our mission, team, and vision.
          </p>
        </div>
      </div>
    </div>
  );
}
