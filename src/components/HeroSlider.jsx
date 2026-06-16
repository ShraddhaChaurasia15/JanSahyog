import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./HeroSlider.css";

function HeroSlider() {
  const slides = [
    {
      title: "PM Kisan Samman Nidhi",
      description: "Financial assistance for eligible farmers across India.",
      benefit: "₹6,000 per Year",
      image:
        "https://images.unsplash.com/photo-1500937386664-56d1dfef3854",
      link: "/check-eligibility"
    },

    {
      title: "Ayushman Bharat",
      description: "Free healthcare coverage for families.",
      benefit: "₹5 Lakh Health Insurance",
      image:
        "https://images.unsplash.com/photo-1584515933487-779824d29309",
      link: "/check-eligibility"
    },

    {
      title: "PM Awas Yojana",
      description: "Affordable housing support for citizens.",
      benefit: "Up to ₹2.5 Lakh",
      image:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa",
      link: "/check-eligibility"
    }
  ];

  return (
    <section className="hero-slider">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation
        loop
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="slide"
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            >
              <div className="overlay"></div>

              <div className="slide-content">
                <span className="badge">
                  Government Welfare Scheme
                </span>

                <h1>{slide.title}</h1>

                <p>{slide.description}</p>

                <h3>{slide.benefit}</h3>

                <Link to={slide.link} className="slide-btn">
                  Explore Scheme
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default HeroSlider;