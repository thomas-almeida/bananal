interface ProfileHeaderProps {
  profile: {
    name: string
    image: string
    location: string
  }
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="flex justify-between items-start py-8 pb-6">
      <div className="flex-1 pr-4 py-4">
        <h1 className="text-4xl w-10 leading-7 tracking-tighter font-extrabold">{profile.name}</h1>
        {profile.location && (
          <p className="text-sm text-[#888] mt-1">{profile.location}</p>
        )}
      </div>
      {profile.image && (
        <img
          src={profile.image}
          alt={profile.name}
          className="w-25 h-25 rounded-full object-cover shadow-xl"
        />
      )}
    </div>
  )
}
