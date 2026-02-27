interface Testimonial {
  _id: string
  authorName: string
  authorImage: string
  text: string
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (testimonials.length === 0) return null

  return (
    <div className="mt-8">
      <h3 className="text-xl font-extrabold mt-8 mb-1">Coworks</h3>
      <p className="text-sm text-[#888] mb-4">Meus colegas falam por mim!</p>

      {testimonials.map(item => (
        <div key={item._id} className="flex gap-3 mb-5">
          {item.authorImage && (
            <img
              src={item.authorImage}
              alt={item.authorName}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
          )}
          <div>
            <p className="text-sm text-[#333] italic">"{item.text}"</p>
            <p className="text-[13px] font-semibold text-[#555] mt-1">{item.authorName}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
