export default function HelpPage() {
  return (
    <div className="container px-4 py-12 md:py-16 max-w-4xl mx-auto pb-24 fade-in-up">
      <div className="space-y-8">
        <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">
          Help & FAQ
        </h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-muted-foreground leading-relaxed">
            Content coming soon. We're building our help center.
          </p>
          <p className="text-lg text-muted-foreground/90 leading-relaxed">
            Check back soon for guides, troubleshooting tips, and frequently asked questions.
          </p>
        </div>
      </div>
    </div>
  );
}
