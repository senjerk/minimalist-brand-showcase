const GallerySection = () => {
  const images = [
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-light text-brand-accent mb-12 text-center">
          Our Work
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {images.map((src, index) => (
            <div 
              key={index}
              className="aspect-square overflow-hidden bg-brand-light/20"
            >
              <img
                src={src}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;