import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';
import Tilt from 'react-parallax-tilt';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(offerListings);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=3');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=6');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=6');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        log(error);
      }
    };
    fetchOfferListings();
  }, []);
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-800 to-orange-500 transition-all duration-700 hover:from-orange-500 hover:to-black overflow-hidden">
  
      {/* Animated Background Glow Behind Top Section */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] bg-orange-400 opacity-30 rounded-full blur-3xl animate-pulse z-0"></div>
  
      {/* Tilted Top Hero Section with Diagonal Hover Effect */}
      <Tilt
        glareEnable={true}
        glareMaxOpacity={0.1}
        glareColor="#ffffff"
        tiltMaxAngleX={5}
        tiltMaxAngleY={5}
        scale={0.9}
        className="mx-auto"
      >
        <div className="relative flex flex-col gap-6 py-24 px-6 md:px-12 max-w-6xl mx-auto text-center bg-black/80 backdrop-blur-lg rounded-3xl shadow-xl mt-8 transition-transform duration-300 ease-out hover:transform hover:scale-105  hover:duration-500 hover:shadow-2xl">
          <h1 className="text-orange-400 font-extrabold text-4xl lg:text-6xl">
            Find your next <span className="text-orange-200">Perfect</span>
            <br />
            place with ease
          </h1>
          <div className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
            <span className='font-bold text-lg'>QuestaNest</span> is the best place to find your next perfect place to live.
            <br />
            We have a wide range of properties for you to choose from.
          </div>
          <Link
            to="/search"
            className="text-sm sm:text-base text-orange-200 font-semibold hover:underline transition duration-200"
          >
            Let's get started...
          </Link>
          <div className="absolute -top-10 -left-10 w-60 h-60 bg-orange-300 rounded-full blur-3xl opacity-20 -z-10"></div>
        </div>
      </Tilt>
  
      {/* Swiper Carousel */}
      <div className="mt-10 px-4">
        <Swiper navigation className="rounded-3xl shadow-xl bg-black/80">
          {offerListings &&
            offerListings.length > 0 &&
            offerListings.map((listing) => (
              <SwiperSlide key={listing._id}>
                <div
                  style={{
                    background: `url(${listing.imageUrls[0]}) center no-repeat`,
                    backgroundSize: 'contain',
                  }}
                  className="h-[500px] rounded-3xl shadow-xl"
                ></div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
  
      {/* Listings Section */}
      <div className="max-w-6xl mx-auto p-6 md:p-8 flex flex-col gap-12 my-10 bg-black/80 backdrop-blur-md rounded-3xl shadow-xl z-10">
        {offerListings && offerListings.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-bold text-orange-200">Recent offers</h2>
              <Link
                className="text-sm text-orange-200 font-medium hover:underline transition"
                to="/search?offer=true"
              >
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 justify-center">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
  
        {rentListings && rentListings.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-bold text-orange-200">Recent places for RENT</h2>
              <Link
                className="text-sm text-orange-200 font-medium hover:underline transition"
                to="/search?type=rent"
              >
                Show more places for rent
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 justify-center">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
  
        {saleListings && saleListings.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-bold text-orange-200">Recent places for SALE</h2>
              <Link
                className="text-sm text-orange-200 font-medium hover:underline transition"
                to="/search?type=sale"
              >
                Show more places for sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 justify-center">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}