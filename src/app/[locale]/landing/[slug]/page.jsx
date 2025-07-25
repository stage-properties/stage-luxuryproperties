import { convertPrice, fetchAPI } from "@/app/[locale]/_utils/utils";
import { notFound } from "next/navigation";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import HubspotForm from "@/app/[locale]/landing/[slug]/HubspotForm";
import AboutDeveloper from "../_components/AboutDeveloper/AboutDeveloper";
import { serverPathname } from "@/app/[locale]/_utils/serverPathname";

export async function generateMetadata({ params }) {
  const { origin } = serverPathname();
  const slug = params.slug;
  let { data } = await fetchAPI(`/pageLanding/${slug}`, "noCache");

  if (!data?.length) {
    return {
      title: "Page Not Found",
    };
  }

  data = data[0].attributes;
  const title = data?.project_title;
  const section_1_img = data?.section_1_img?.data?.attributes?.url;
  const section_1_img_alt =
    data?.section_1_img?.data?.attributes?.alternativeText || title;

  return {
    title: title,
    openGraph: {
      url: `${origin}`,
      title: title,
      images: [
        {
          url: section_1_img,
          width: 1200,
          height: 630,
          alt: section_1_img_alt,
        },
      ],
      type: "website",
    },
  };
}

export default async function page({ params }) {
  const currencyToSymbol = (currency) => {
    if (currency === "EUR") return "€";
    else if (currency === "USD") return "$";
    else return currency;
  };

  const slug = params.slug;
  let { data } = await fetchAPI(`/pageLanding/${slug}`, "noCache");

  if (!data?.length) {
    notFound();
  }

  data = data[0].attributes;

  const title = data?.project_title;
  const developer_logo =
    data?.developer?.data?.attributes?.developer_logo?.data?.attributes?.url;
  const developer_logo_alt =
    data?.developer?.data?.attributes?.developer_logo?.data?.attributes
      ?.alternativeText || title;

  const project_logo_black = data?.project_logo_black?.data?.attributes?.url;
  const project_logo_black_alt =
    data?.project_logo_black?.data?.attributes?.alternativeText;

  const project_logo = data?.project_logo?.data?.attributes?.url;
  const project_logo_alt =
    data?.project_logo?.data?.attributes?.alternativeText || title;

  const section_1_img = data?.section_1_img?.data?.attributes?.url;

  const section_1 = data?.section_1;
  const handover_year = data?.handover_year;
  const payment_plan = data?.payment_plan;
  const starting_price = data?.starting_price;

  const section_2_img = data?.section_2_img?.data?.attributes?.url;
  const section_2 = data?.section_2;

  const section_3_img = data?.section_3_img?.data?.attributes?.url;

  const time_to_almaktoumAirport = data?.time_to_almaktoumAirport;
  const time_to_palmJumeirah = data?.time_to_palmJumeirah;
  const time_to_burjAlArab = data?.time_to_burjAlArab;
  const time_to_theWalkJBR = data?.time_to_theWalkJBR;
  const time_to_dxdAirport = data?.time_to_dxdAirport;
  const time_to_BurjKhalifa = data?.time_to_BurjKhalifa;

  const section_3 = data?.section_3;

  const section_4_img = data?.section_4_img?.data?.attributes?.url;
  const section_4 = data?.section_4;

  const section_5_img = data?.section_5_img?.data?.attributes?.url;

  const form_img = data?.form_img?.data?.attributes?.url;
  const form_img_alt =
    data?.form_img?.data?.attributes?.alternativeText || title;

  const options = data?.options;

  const hubspot_form_id = data?.hubspot_form_id;

  const currency = data?.currency;

  const barbecue_area = data?.barbecue_area;
  const basketball_court = data?.basketball_court;
  const cinema = data?.cinema;
  const cycling_trail = data?.cycling_trail;
  const green_spaces = data?.green_spaces;
  const infinity_pool = data?.infinity_pool;
  const jogging_trail = data?.jogging_trail;
  const kids_play_area = data?.kids_play_area;
  const kids_pool = data?.kids_pool;
  const parks = data?.parks;
  const retail = data?.retail;
  const rooftop_lounge = data?.rooftop_lounge;
  const tennis_court = data?.tennis_court;
  const zen_garden = data?.zen_garden;

  return (
    <div className="landing">
      <div
        className="section_1"
        style={{
          backgroundImage: `
                        linear-gradient(
                        180deg, 
                        rgba(255, 255, 255, 0.60) 16.95%, 
                        rgba(255, 255, 255, 0.00) 61.22%
                        ),
                        url(${section_1_img})
                    `,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <img
          className="developer_logo"
          src={developer_logo}
          alt={developer_logo_alt}
        />
        <img
          className="project_logo"
          src={project_logo_black}
          alt={project_logo_black_alt}
        />
      </div>
      <div className="wrapper">
        <BlocksRenderer content={section_1} />
        <div className="handover-details">
          <div className="handover-item border-right">
            <div className="handover-title">Handover in</div>
            <div className="handover-year">{handover_year}</div>
          </div>
          <div className="handover-item border-right">
            <div className="handover-title">Attractive</div>
            <div className="handover-year">{payment_plan}</div>
            <div className="handover-subtitle">Payment Plan</div>
          </div>
          <div className="handover-item">
            <div className="handover-title">Starting from</div>
            <div className="handover-year">
              {currencyToSymbol(currency)} {convertPrice(starting_price)}
            </div>
          </div>
        </div>
      </div>
      <div
        className="section_2"
        style={{ backgroundImage: `url(${section_2_img})` }}
      ></div>
      <div className="wrapper">
        <div className="content-container">
          <div>
            <BlocksRenderer content={section_2} />
          </div>
        </div>
      </div>
      <div
        className="section_3"
        style={{ backgroundImage: `url(${section_3_img})` }}
      ></div>
      <div className="wrapper">
        <div className="content-container">
          <BlocksRenderer content={section_3} />
          <div className="location-container">
            {time_to_almaktoumAirport ? (
              <div className="location-item">
                <div className="location-time">
                  {time_to_almaktoumAirport} min
                  {time_to_almaktoumAirport >= 2 ? "s" : ""}.
                </div>
                <div className="location-text">to Al Maktoum</div>
                <div className="location-text">International Airport</div>
              </div>
            ) : null}
            {time_to_palmJumeirah ? (
              <div className="location-item">
                <div className="location-time">
                  {time_to_palmJumeirah} min
                  {time_to_palmJumeirah >= 2 ? "s" : ""}.
                </div>
                <div className="location-text">to Palm</div>
                <div className="location-text">Jumeirah</div>
              </div>
            ) : null}
            {time_to_burjAlArab ? (
              <div className="location-item">
                <div className="location-time">
                  {time_to_burjAlArab} min{time_to_burjAlArab >= 2 ? "s" : ""}.
                </div>
                <div className="location-text">to Burj Al</div>
                <div className="location-text">Arab</div>
              </div>
            ) : null}
            {time_to_theWalkJBR ? (
              <div className="location-item">
                <div className="location-time">
                  {time_to_theWalkJBR} min{time_to_theWalkJBR >= 2 ? "s" : ""}.
                </div>
                <div className="location-text">to The</div>
                <div className="location-text">Walk JBR</div>
              </div>
            ) : null}
            {time_to_dxdAirport ? (
              <div className="location-item">
                <div className="location-time">
                  {time_to_dxdAirport} min{time_to_dxdAirport >= 2 ? "s" : ""}.
                </div>
                <div className="location-text">to DXB International</div>
                <div className="location-text">Airport</div>
              </div>
            ) : null}
            {time_to_BurjKhalifa ? (
              <div className="location-item">
                <div className="location-time">
                  {time_to_BurjKhalifa} min{time_to_BurjKhalifa >= 2 ? "s" : ""}
                  .
                </div>
                <div className="location-text">to Dubai Mall,</div>
                <div className="location-text">Burj Khalifa, and</div>
                <div className="location-text">Dubai Fountain</div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div
        className="section_4"
        style={{ backgroundImage: `url(${section_4_img})` }}
      ></div>
      <div className="wrapper">
        <div className="content-container">
          <BlocksRenderer content={section_4} />
          <div className="location-container">
            {/* Barbecue area */}
            {barbecue_area ? (
              <div className="location-item">
                <div className="location-time">
                  <img
                    src="/icons/barbecue_area.svg"
                    alt="Barbecue Area"
                    height={88}
                  />
                </div>
                <div className="location-text" style={{ marginTop: ".5rem" }}>
                  Barbecue Area
                </div>
              </div>
            ) : null}
            {/* Basketball court */}
            {basketball_court ? (
              <div className="location-item">
                <div className="location-time">
                  <img
                    src="/icons/basketball_court.svg"
                    alt="basketball Court"
                    height={88}
                  />
                </div>
                <div className="location-text" style={{ marginTop: ".5rem" }}>
                  Basketball Court
                </div>
              </div>
            ) : null}
            {/* Cinema */}
            {cinema ? (
              <div className="location-item">
                <div className="location-time">
                  <img src="/icons/cinema.svg" alt="Cinema" height={88} />
                </div>
                <div className="location-text" style={{ marginTop: ".5rem" }}>
                  Cinema
                </div>
              </div>
            ) : null}
            {/* Cycling Trail */}
            {cycling_trail ? (
              <div className="location-item">
                <div className="location-time">
                  <img
                    src="/icons/cycling_trail.svg"
                    alt="Cycling Trail"
                    height={88}
                  />
                </div>
                <div className="location-text" style={{ marginTop: ".5rem" }}>
                  Cycling Trail
                </div>
              </div>
            ) : null}
            {/* Green Spaces */}
            {green_spaces ? (
              <div className="location-item">
                <div className="location-time">
                  <img
                    src="/icons/green_spaces.svg"
                    alt="Green Spaces"
                    height={88}
                  />
                </div>
                <div className="location-text" style={{ marginTop: ".5rem" }}>
                  Green Spaces
                </div>
              </div>
            ) : null}
            {/* Infinity Pool */}
            {infinity_pool ? (
              <div className="location-item">
                <div className="location-time">
                  <img
                    src="/icons/infinity_pool.svg"
                    alt="Infinity Pool"
                    height={88}
                  />
                </div>
                <div className="location-text" style={{ marginTop: ".5rem" }}>
                  Infinity Pool
                </div>
              </div>
            ) : null}
            {/* Jogging Trail */}
            {jogging_trail ? (
              <div className="location-item">
                <div className="location-time">
                  <img
                    src="/icons/jogging_trail.svg"
                    alt="Jogging Trail"
                    height={88}
                  />
                </div>
                <div className="location-text" style={{ marginTop: ".5rem" }}>
                  Jogging Trail
                </div>
              </div>
            ) : null}
            {/* Kids Play Area */}
            {kids_play_area ? (
              <div className="location-item">
                <div className="location-time">
                  <img
                    src="/icons/kids_play_area.svg"
                    alt="Kids Play Area"
                    height={88}
                  />
                </div>
                <div className="location-text" style={{ marginTop: ".5rem" }}>
                  Kids Play Area
                </div>
              </div>
            ) : null}
            {/* Kids Pool */}
            {kids_pool ? (
              <div className="location-item">
                <div className="location-time">
                  <img src="/icons/kids_pool.svg" alt="Kids Pool" height={88} />
                </div>
                <div className="location-text" style={{ marginTop: ".5rem" }}>
                  Kids Pool
                </div>
              </div>
            ) : null}
            {/* Parks */}
            {parks ? (
              <div className="location-item">
                <div className="location-time">
                  <img src="/icons/parks.svg" alt="Parks" height={88} />
                </div>
                <div className="location-text" style={{ marginTop: ".5rem" }}>
                  Parks
                </div>
              </div>
            ) : null}
            {/* Retail */}
            {retail ? (
              <div className="location-item">
                <div className="location-time">
                  <img src="/icons/retail.svg" alt="Retail" height={88} />
                </div>
                <div className="location-text" style={{ marginTop: ".5rem" }}>
                  Retail
                </div>
              </div>
            ) : null}
            {/* Rooftop Lounge */}
            {rooftop_lounge ? (
              <div className="location-item">
                <div className="location-time">
                  <img
                    src="/icons/rooftop_lounge.svg"
                    alt="Rooftop Lounge"
                    height={88}
                  />
                </div>
                <div className="location-text" style={{ marginTop: ".5rem" }}>
                  Rooftop Lounge
                </div>
              </div>
            ) : null}
            {/* Tennis Court */}
            {tennis_court ? (
              <div className="location-item">
                <div className="location-time">
                  <img
                    src="/icons/tennis_court.svg"
                    alt="Tennis Court"
                    height={88}
                  />
                </div>
                <div className="location-text" style={{ marginTop: ".5rem" }}>
                  Tennis Court
                </div>
              </div>
            ) : null}
            {/* Zen Garden */}
            {zen_garden ? (
              <div className="location-item">
                <div className="location-time">
                  <img
                    src="/icons/zen_garden.svg"
                    alt="Zen Garden"
                    height={88}
                  />
                </div>
                <div className="location-text" style={{ marginTop: ".5rem" }}>
                  Zen Garden
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div
        className="section_5"
        style={{ backgroundImage: `url(${section_5_img})` }}
      ></div>
      <AboutDeveloper developer={data?.developer} />
      <HubspotForm
        form_img={form_img}
        form_img_alt={form_img_alt}
        title={title}
        hubspot_form_id={hubspot_form_id}
      />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="sticky-footer">
        <div className="sticky-footer-logos">
          <img src={project_logo} alt={project_logo_alt} />
        </div>
        <div>
          {options.map(({ option }, index) => (
            <p key={index} className="sticky-footer-text">
              {option}
            </p>
          ))}
        </div>
        <div>
          <p className="sticky-footer-text">Attractive {payment_plan}</p>
          <p className="sticky-footer-text">Payment Plan</p>
        </div>
        <div>
          <p className="sticky-footer-text">Starting from</p>
          <p className="sticky-footer-text">
            {currencyToSymbol(currency)} {convertPrice(starting_price)}
          </p>
        </div>
        <div>
          <p className="sticky-footer-text">Handover</p>
          <p className="sticky-footer-text">in {handover_year}</p>
        </div>
        <a className="register-button" href="#form-container">
          Register Interest
        </a>
      </div>
    </div>
  );
}
