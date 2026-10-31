import { Link } from "react-router-dom"

export default function Locations() {
  const stores = [
    {
      name: "Jayanagar - Main Branch",
      address: "4th Block, Jayanagar, Bengaluru",
      phone: "+91 98944 41500",
      mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.661636157984!2d77.58167999999999!3d12.929455599999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15c2814b4f83%3A0xd9d23bbf0d0ff67b!2sKarnan%20Pattu%20Centre%20-%20Jayanagar%20-%20Old%20Silk%20Saree%20Buyers!5e0!3m2!1sen!2sin!4v1793360788675!5m2!1sen!2sin",
    },
    {
      name: "Jayanagar - Branch II",
      address: "Jayanagar Shopping Area, Bengaluru",
      phone: "+91 98944 41500",
      mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.6420763706255!2d77.5841447!3d12.930710900000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15e5f6a5dd9d%3A0x131f2d55755f22df!2sKarnan%20Pattu%20Centre%20-%20Jayanagar!5e0!3m2!1sen!2sin!4v1793360822613!5m2!1sen!2sin",
    },
    {
      name: "Jayanagar - Branch III",
      address: "Jayanagar Commercial Enclave, Bengaluru",
      phone: "+91 98944 41500",
      mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.667746942816!2d77.58548309999999!3d12.9290634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15ef33ea9283%3A0x4014b67ef0c93dff!2sKarnan%20Pattu%20Centre%20-%20Jayanagar!5e0!3m2!1sen!2sin!4v1793360853851!5m2!1sen!2sin",
    },
    {
      name: "Showroom Street View",
      address: "Boutique Exterior View, Bengaluru",
      phone: "+91 98944 41500",
      mapSrc: "https://www.google.com/maps/embed?pb=!4v1793361126751!6m8!1m7!1sc_3QPDsUT3T5L-YpI67edg!2m2!1d12.92003135489287!2d77.59292927983381!3f285.5489!4f0!5f0.7820865974627469",
    },
  ]

  return (
    <>
      {/* Hero Banner Section */}
      <section className="relative flex min-h-[320px] items-center overflow-hidden bg-[#210a0c] sm:min-h-[380px]">
        {/* Full Background Image */}
        <img 
          src="/hero/image.avif" 
          alt="Our Locations Background" 
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* Soft Dark Overlay for Crisp Text Readability */}
        <div className="absolute inset-0 bg-[#210a0c]/85" />

        {/* Content Block */}
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-16 text-center text-[#f7f1e8] md:px-10">
          <p className="text-xs tracking-[0.16em] text-[#f7f1e8]/80 uppercase">
            <Link to="/" className="transition-colors duration-300 hover:text-[#d7c4a2]">
              Home
            </Link>
            <span className="mx-2 text-[#d7c4a2]">/</span>
            Our Locations
          </p>
          <h1 className="mt-4 font-display text-5xl font-bold tracking-wide text-[#faf6f0] md:text-7xl">
            Our Locations
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#f7f1e8]/85 md:text-base">
            Four locations in Bengaluru, welcoming you for new soft silks and cash for old sarees.
          </p>
          <span className="mx-auto mt-6 block h-px w-16 bg-[#d7c4a2]" />
        </div>
      </section>

      {/* Visit Stores & Maps Section */}
      <section className="px-4 py-16 md:px-8 md:py-24 text-[#4a0e17]">
        <div className="mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="text-center" data-slide="up">
            <p className="text-[11px] font-semibold tracking-[0.24em] text-[#4a0e17]/80 uppercase">
              Visit Our Boutiques
            </p>
            <h2 className="mt-2 font-display text-4xl font-bold md:text-5xl text-[#4a0e17]">
              Our Four Locations in Bengaluru
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-[#4a0e17]/90">
              Step into any of our four stores to explore new soft silks or bring in your pre-loved drapes for an instant daylight valuation and cash offer.
            </p>
            <div className="mx-auto mt-4 h-[1px] w-12 bg-[#4a0e17]/40" />
          </div>

         {/* 4 Stores Grid */}
<div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
  {stores.map((store, index) => (
    <div 
      key={store.name}
      /* CHANGED: Switched background to light cream/pink and softened the border. Re-styled hover and added a subtle shadow. */
      className="flex flex-col justify-between border border-[#4a0e17]/10 bg-[#fdf8f4] p-6 shadow-md transition-all duration-300 hover:border-[#4a0e17]/30 hover:shadow-lg"
      data-slide={index % 2 === 0 ? "left" : "right"}
    >
      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-bold text-[#4a0e17]">
            {store.name}
          </h3>
          <span className="text-xs tracking-widest text-[#4a0e17]/70 uppercase">
            Location 0{index + 1}
          </span>
        </div>
        <p className="mt-2 text-sm text-[#4a0e17]/90">
          {store.address}
        </p>
        <p className="mt-1 text-xs font-medium text-[#4a0e17]">
          Phone: {store.phone}
        </p>
      </div>

      {/* Map Container with Open in Maps Button */}
      <div className="mt-6 flex flex-col gap-3">
        {/* Open in Maps Action Button */}
        <div>
          <a 
            href="https://maps.google.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#4a0e17] px-3 py-1.5 text-[11px] font-semibold tracking-wider text-[#faf6f0] uppercase shadow-sm transition-colors duration-300 hover:bg-[#6b1a26]"
          >
            Open in Maps 
            <span aria-hidden="true" className="text-xs">↗</span>
          </a>
        </div>

        {/* Embedded Map / Street View per Store */}
        <div className="overflow-hidden border border-[#4a0e17]/20">
          <div className="relative aspect-video w-full h-[220px]">
            <iframe 
              src={store.mapSrc} 
              className="absolute inset-0 h-full w-full border-0" 
              style={{ border: 0 }}
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="strict-origin-when-cross-origin"
              title={`Karnan Pattu Centre - ${store.name}`}
            />
          </div>
        </div>
      </div>
    </div>
  ))}
</div>
        </div>
      </section>
    </>
  )
}