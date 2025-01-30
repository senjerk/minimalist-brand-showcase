const TestimonialsSection = () => {
  const testimonials = [
    {
      text: "Absolutely love my new piece. The attention to detail is remarkable.",
      author: "Anna K."
    },
    {
      text: "Exceptional quality and unique design. Exactly what I was looking for.",
      author: "Michael R."
    },
    {
      text: "The craftsmanship exceeded my expectations. Truly a work of art.",
      author: "Elena S."
    }
  ];

  return (
    <section className="py-20 bg-brand-light/5">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-light text-brand-accent mb-12 text-center">
          Client Stories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="p-8 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="text-lg text-brand-dark mb-6">"{testimonial.text}"</p>
              <p className="text-brand-accent font-medium">{testimonial.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;