import Image from "next/image"

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/images/semente-bendita-logo.png" alt="Connectus" width={40} height={40} />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Connectus</h1>
              <p className="text-sm text-gray-600">Mobile Church Platform</p>
            </div>
          </div>
          {/* Navigation or other header elements can go here */}
        </div>
      </div>
    </header>
  )
}
