interface Company {
  _id: string
  name: string
  url: string
  faviconUrl: string
}

interface CompaniesSectionProps {
  companies: Company[]
}

export default function CompaniesSection({ companies }: CompaniesSectionProps) {
  if (companies.length === 0) return null

  return (
    <div className="mt-8 mb-8">
      <h3 className="text-xl font-extrabold leading-5 tracking-tighter mb-4">
        Empresas que confiam no meu trabalho, você pode ser a próxima!
      </h3>

      {companies.map(company => (
        <a
          key={company._id}
          href={company.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3.5 py-2"
        >
          <img
            src={company.faviconUrl}
            alt={company.name}
            className="w-10 h-10 rounded-lg object-contain bg-[#f5f5f5] p-1"
          />
          <div>
            <p className="text-[15px] font-semibold">{company.name}</p>
            <p className="text-xs text-blue-500 font-medium mt-0.5">Conhecer a empresa ↗</p>
          </div>
        </a>
      ))}
    </div>
  )
}
