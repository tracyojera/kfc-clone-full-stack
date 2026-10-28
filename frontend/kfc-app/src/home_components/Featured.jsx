import React from "react";
import Slider from "react-slick";
import styles from "./HomeSlider.module.css";
import SliderData from "../SliderData.json";
import { useFallbackImage } from "../utils/imageFallback";
import { formatUGX } from "../utils/currency";

export default class Featured extends React.Component {
  state = {
    slideIndex: 1,
    updateCount: 1,
  };

  render() {
    const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 3,
      responsive: [
        {
          breakpoint: 1279,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            initialSlide: 1,
          },
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 1,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: 1,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: 1,
          },
        },
      ],
      afterChange: () =>
        this.setState((state) => ({ updateCount: state.updateCount + 1 })),
      beforeChange: (current, next) => this.setState({ slideIndex: next }),
    };
    return (
      <div className={styles.commonSliderDiv}>
        <div
          className={styles.commonSliderHeading}
          style={{ textAlign: "center" }}
        >
          <h2>FEATURED ITEMS</h2>
        </div>
        <Slider ref={(slider) => (this.slider = slider)} {...settings}>
          {SliderData.featured.map((item) => (
            <a
              className={`${styles.itemDiv} ${styles.itemLink}`}
              href={`/menu#${item.type}`}
              aria-label={`View ${item.title}`}
              key={`${item.type}-${item.title}`}
            >
              <img
                src={item.image}
                onError={useFallbackImage}
                alt={item.title}
                className={styles.itemImg}
                loading="lazy"
                decoding="async"
              />
              <p className={styles.itemTitle}>{item.title}</p>
              <p className={styles.itemPrice}>{formatUGX(item.price)}</p>
              <p className={styles.itemDesc}>{item.desc}</p>
            </a>
          ))}
        </Slider>
        <progress
          value={this.state.slideIndex}
          min={0}
          max={1}
          className={styles.sliderProgress}
        ></progress>
      </div>
    );
  }
}
