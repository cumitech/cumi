import React from "react";
import Image from "next/image";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { IService } from "@domain/models/service.model";
import { Empty } from "antd";

interface IServiceListProps {
  services: IService[];
}
const ServiceList: React.FC<IServiceListProps> = ({ services }) => {
  return (
    <section className="py-5">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <Swiper
              modules={[Autoplay, Pagination]}
              pagination={{ clickable: true }}
              loop={true}
              centeredSlides={true}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              spaceBetween={24}
              breakpoints={{
                768: {
                  slidesPerView: 2,
                },
                992: {
                  slidesPerView: 3,
                },
              }}
            >
              {services && services.length > 0 ? (
                services.map((item: IService, index: number) => (
                  <SwiperSlide key={index}>
                    <div className="card rounded bg-light shadow border-0">
                      <div style={{ position: 'relative', width: '100%', height: 250 }}>
                        <Image
                          src={item.imageUrl}
                          alt={item.title || "Service image"}
                          fill
                          className="card-img-top"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="card-body">
                        <h3 className="h5 fw-semibold">{item.title}</h3>
                        <blockquote
                          className="mt-3"
                          dangerouslySetInnerHTML={{
                            __html: item.description,
                          }}
                        />
                        <a
                          href={`/our_services/${item.slug}`}
                          className="btn btn-sm btn-dark rounded-pill"
                        >
                          Learn more
                        </a>
                      </div>
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                <div className="col-12 empty-wrap">
                  <Empty />
                </div>
              )}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceList;
