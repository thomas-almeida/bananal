interface Portfolio {
  _id: string
  title: string
  description: string
  url: string
  imageUrl: string
}

interface PortfolioSectionProps {
  portfolios: Portfolio[]
}

export default function PortfolioSection({ portfolios }: PortfolioSectionProps) {
  if (portfolios.length === 0) return null

  return (
    <div className="mt-8">
      <h3 className="text-xl font-extrabold mb-4">Portfólio</h3>

      {portfolios.map(item => (
        <a
          key={item._id}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block mb-7 cursor-pointer hover:opacity-90 transition-opacity border border-slate-300 rounded-xl shadow-xl p-2"
        >
          {item.imageUrl && (
            <div className="w-full aspect-video rounded-2xl overflow-hidden bg-[#f0f0f0] border border-slate-200 shadow">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <h4 className="text-xl font-bold mt-2.5">{item.title}</h4>
          {item.description && (
            <p className="text-xs text-[#888] mt-1">{item.description}</p>
          )}
        </a>
      ))}
    </div>
  )
}
