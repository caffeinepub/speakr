import UploadForm from '@/components/upload/UploadForm';

export default function UploadPage() {
  return (
    <div className="min-h-screen pb-24">
      <div className="container px-4 md:px-6 py-8 max-w-3xl mx-auto fade-in-up">
        <div className="space-y-3 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Upload Audio</h1>
          <p className="text-lg text-muted-foreground">
            Share your voice with the world
          </p>
        </div>
        <UploadForm />
      </div>
    </div>
  );
}
