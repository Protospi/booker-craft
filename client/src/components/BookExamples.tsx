import { AspectRatio } from "@/components/ui/aspect-ratio";

export function BookExamples() {
  const examples = [
    {
      title: "The Lost Kingdom",
      description: "Fantasy adventure with magical creatures",
      imageUrl: "https://images.unsplash.com/photo-1518744358564-f5cd050b1f4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=900&q=80"
    },
    {
      title: "Mediterranean Delights",
      description: "50 authentic recipes from the region",
      imageUrl: "https://images.unsplash.com/photo-1532767153582-b1a0e5145009?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=900&q=80"
    },
    {
      title: "Japan Explorer",
      description: "A comprehensive guide to hidden gems",
      imageUrl: "https://images.unsplash.com/photo-1502920514313-52581002a659?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=900&q=80"
    }
  ];

  return (
    <div className="mt-10 pt-8 border-t border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Example books you can create:</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {examples.map((example, index) => (
          <div 
            key={index} 
            className="group rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative aspect-[2/3]">
              <img 
                src={example.imageUrl} 
                alt={`${example.title} book cover example`} 
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                <h4 className="text-white font-serif text-lg font-bold">{example.title}</h4>
                <p className="text-gray-200 text-sm">{example.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
