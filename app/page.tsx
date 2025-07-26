import ImageGallery from "./components/ImageGallery";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">SnapVault</h1>
      <ImageGallery />
    </main>
  );
}
