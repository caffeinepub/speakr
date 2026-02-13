import PrimaryNav from '@/components/layout/PrimaryNav';
import UploadForm from '@/components/upload/UploadForm';

export default function UploadPage() {
  return (
    <div className="min-h-screen pb-24">
      <PrimaryNav />
      <div className="container px-4 md:px-6 py-8">
        <UploadForm />
      </div>
    </div>
  );
}
