import Image from "next/image"


interface CurrentlySectionProps {
  profile: {
    jobTitle: string
    jobCompany: string
    studyCourse: string
    studyInstitution: string
  }
}

export default function CurrentlySection({ profile }: CurrentlySectionProps) {
  const hasJob = profile.jobTitle || profile.jobCompany
  const hasStudy = profile.studyCourse || profile.studyInstitution

  if (!hasJob && !hasStudy) return null

  return (
    <div className="mt-8">
      <h3 className="text-xl font-extrabold mb-4">Atualmente</h3>

      {hasJob && (
        <div className="flex gap-3 mb-4">
          <Image src={"/job.png"} width={20} height={20} alt="job" className="w-5 h-5" />
          <div>
            <p className="text-xl font-semibold">{profile.jobTitle}</p>
            {profile.jobCompany && (
              <p className="text-xs font-bold text-[#999] uppercase tracking-wide mt-0.5">
                {profile.jobCompany}
              </p>
            )}
          </div>
        </div>
      )}

      {hasStudy && (
        <div className="flex gap-3">
          <Image src={"/school.png"} width={20} height={20} alt="job" className="w-5 h-5" />
          <div>
            <p className="text-xl font-semibold">{profile.studyCourse}</p>
            {profile.studyInstitution && (
              <p className="text-xs font-bold text-[#999] uppercase tracking-wide mt-0.5">
                {profile.studyInstitution}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
