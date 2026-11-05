import PageDamaskHero from "../components/PageDamaskHero"
import { storePhone, storePhoneLabel } from "../data/locations"

const storeLocations = [
  {
    id: 1,
    name: "Karnan Pattu Centre - Jayanagar Branch 1",
    area: "Jayanagar",
    address: "Jayanagar, Bengaluru, Karnataka",
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.661636157984!2d77.58167999999999!3d12.929455599999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15c2814b4f83%3A0xd9d23bbf0d0ff67b!2sKarnan%20Pattu%20Centre%20-%20Jayanagar%20-%20Old%20Silk%20Saree%20Buyers!5e0!3m2!1sen!2sin!4v1793863909547!5m2!1sen!2sin",
    mapUrl:
      "https://maps.google.com/?q=Karnan+Pattu+Centre+-+Jayanagar+-+Old+Silk+Saree+Buyers",
  },
  {
    id: 2,
    name: "Karnan Pattu Centre - Jayanagar Branch 2",
    area: "Jayanagar",
    address: "Jayanagar, Bengaluru, Karnataka",
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.6420763706255!2d77.5841447!3d12.930710900000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15e5f6a5dd9d%3A0x131f2d55755f22df!2sKarnan%20Pattu%20Centre%20-%20Jayanagar!5e0!3m2!1sen!2sin!4v1793863973092!5m2!1sen!2sin",
    mapUrl: "https://maps.google.com/?q=Karnan+Pattu+Centre+-+Jayanagar",
  },
  {
    id: 3,
    name: "Karnan Pattu Centre - Jayanagar Branch 3",
    area: "Jayanagar",
    address: "Jayanagar, Bengaluru, Karnataka",
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.667746942816!2d77.58548309999999!3d12.9290634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15ef33ea9283%3A0x4014b67ef0c93dff!2sKarnan%20Pattu%20Centre%20-%20Jayanagar!5e0!3m2!1sen!2sin!4v1793864004155!5m2!1sen!2sin",
    mapUrl: "https://maps.google.com/?q=Karnan+Pattu+Centre+-+Jayanagar",
  },
  {
    id: 4,
    name: "Karnan Pattu Centre - Jayanagar Branch 4",
    area: "Jayanagar",
    address: "12°55'08.4\"N 77°35'31.8\"E, Bengaluru, Karnataka",
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3888.8246922490716!2d77.58958127507553!3d12.91898638739158!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTLCsDU1JzA4LjQiTiA3N8KwMzUnMzEuOCJF!5e0!3m2!1sen!2sin!4v1793864037651!5m2!1sen!2sin",
    mapUrl: "https://maps.google.com/?q=12.918986,77.589581",
  },
]

export default function Locations() {
  return (
    <div className="w-full min-w-0 overflow-x-clip">
      <PageDamaskHero
        breadcrumb="Our Locations"
        title="Our Locations"
        subtitle={`Visit Karnan Pattu Centre At Our Four Bengaluru Locations. For assistance, call ${storePhoneLabel}.`}
      />

      {/* Locations Grid Section */}
      <section className="py-16 text-[#4a0e17] md:py-24">
        <div className="site-container min-w-0">
          <div className="text-center" data-slide="up">
            <p className="text-[11px] font-semibold tracking-[0.24em] text-[#4a0e17]/80 uppercase">
              Visit Our Stores
            </p>
            <h2 className="mt-2 font-display text-4xl font-bold text-[#4a0e17] md:text-5xl">
              Four Locations in Bengaluru
            </h2>
          </div>

          <ul className="mt-12 grid min-w-0 grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
            {storeLocations.map((store, index) => (
              <li
                key={store.id}
                className="flex min-w-0 flex-col justify-between border border-[#4a0e17]/10 bg-[#fdf8f4] p-6 shadow-md"
                data-slide={index % 2 === 0 ? "left" : "right"}
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-display text-xl font-bold text-[#4a0e17]">{store.name}</h3>
                    <span className="text-xs tracking-widest text-[#4a0e17]/70 uppercase">
                      {store.area}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#4a0e17]/90">{store.address}</p>
                  <a
                    className="mt-2 inline-block text-xs font-medium text-[#4a0e17] underline underline-offset-2"
                    href={`tel:${storePhone}`}
                  >
                    Call: {storePhoneLabel}
                  </a>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <a
                    href={store.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-fit items-center gap-1.5 bg-[#4a0e17] px-3 py-2 text-[11px] font-semibold tracking-wider text-[#faf6f0] uppercase transition-colors duration-300 hover:bg-[#6b1a26]"
                  >
                    Get Directions <span aria-hidden="true" className="text-xs">↗</span>
                  </a>
                  <div className="h-[220px] overflow-hidden border border-[#4a0e17]/20">
                    <iframe
                      src={store.embedUrl}
                      className="h-full w-full border-0"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                      title={`Map to ${store.name}`}
                      style={{ border: 0 }}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}