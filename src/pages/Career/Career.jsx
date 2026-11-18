// ========== Imports ==========
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdSearch,
  MdClose,
  MdKeyboardArrowDown,
  MdArrowForward,
  MdLocationOn,
  MdOutlineBusinessCenter,
  MdPeopleOutline,
  MdCalculate,
  MdBalance,
  MdEngineering,
  MdComputer,
  MdFactory,
  MdCampaign,
  MdVerified,
  MdGroups,
  MdTrendingUp,
  MdCardGiftcard,
  MdWorkspacePremium,
} from 'react-icons/md';
import SEO from '../../components/SEO';

import { useNavigate } from 'react-router-dom';

// ========== Hooks ==========
import usePageHero from '../../hooks/usePageHero';

// ========== Components ==========
import CareerCarousel from '../../components/CareerCarousel';

// ========== Utilities ==========
import { buildApiUrl } from '../../lib/api';

// ========== Assets ==========
import banner from '../../assets/careerBanner.webp';
import popup from '../../assets/careerPopup2.webp';
// import popup from "../../assets/careerPopup.webp"
import makeUsGreat from '../../assets/Our_People_make_us_Great._IN.webp';
import amazingCulture from '../../assets/Amazing_Culture!_IN.webp';
import wereCertified from "../../assets/We're_Certified!_IN.webp";

// ========== Job Types ==========


// ========== Departments ==========
const departments = [
  'All',
  'Finance',
  'Legal & Compliance',
  'Engineering',
  'IT & Software',
  'Operations',
  'Sales & Marketing',
  'Quality Control',
];

const deptIcons = {
  Finance: MdCalculate,
  'Legal & Compliance': MdBalance,
  Engineering: MdEngineering,
  'IT & Software': MdComputer,
  Operations: MdFactory,
  'Sales & Marketing': MdCampaign,
  'Quality Control': MdVerified,
};

const whyJoin = [
  { icon: MdGroups, title: 'People-First Culture', text: 'A supportive and inclusive workplace' },
  { icon: MdTrendingUp, title: 'Growth Opportunities', text: 'Continuous learning and career advancement' },
  { icon: MdCardGiftcard, title: 'Competitive Benefits', text: 'Total rewards for your well-being' },
  { icon: MdWorkspacePremium, title: 'A Great Place to Work®', text: 'Recognised for our positive work culture' },
];

const FilterSelect = ({ value, onChange, allLabel, options, ariaLabel }) => (
  <div className="relative">
    <select
      value={value}
      onChange={onChange}
      aria-label={ariaLabel}
      className="appearance-none w-full h-12 pl-4 pr-10 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-[#292c44] outline-none focus:border-[#292c44]"
    >
      <option value="All">{allLabel}</option>
      {options
        .filter((o) => o !== 'All')
        .map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
    </select>
    <MdKeyboardArrowDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xl text-[#292c44]" />
  </div>
);

const badgeImages = [
  { src: makeUsGreat, alt: 'Our People make us Great' },
  { src: amazingCulture, alt: 'Amazing Culture' },
  { src: wereCertified, alt: "We're Certified" },
];

const isPrerender =
  typeof navigator !== 'undefined' && navigator.userAgent === 'ReactSnap';
const stripHtml = (html = '') =>
  html
    .replace(/<\/(p|h[1-6]|li|div)>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&reg;/g, '®')
    .replace(/&#8377;/g, '₹')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
const Career = () => {
  // ========== Hero Content ==========
  const { heroSrc, heroHeading } = usePageHero('careers', 'Careers', banner);

  // ========== State ==========
  const [jobsData, setJobsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const emptyFilters = { search: '', department: 'All', location: 'All', experience: 'All' };
const [draft, setDraft] = useState(emptyFilters);
const [filters, setFilters] = useState(emptyFilters);

const handleSearch = (e) => {
  e.preventDefault();
  setFilters(draft);
};

const scrollToCulture = () =>
  document.getElementById('culture')?.scrollIntoView({ behavior: 'smooth' });
  // Popup state (true so it appears automatically when user visits the page, false during prerendering)
  const [showPopup, setShowPopup] = useState(!isPrerender);

  // Carousel Active Index State (Fixed Reference)
  const [currentSlide, setCurrentSlide] = useState(0);

  // ========== Navigation ==========
  const navigate = useNavigate();

  // ========== Auto-slide for Badge Carousel ==========
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevIndex) => (prevIndex + 1) % badgeImages.length);
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  // ========== Fetch Jobs ==========
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(buildApiUrl('/api/career/jobs'));

        if (res.data.success) {
          setJobsData(res.data.data);
        }
      } catch {
        setErrorMessage('We could not load current openings right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);
  const fadeUp = {
    hidden: {
      opacity: 0,
      y: 80,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: 'easeOut',
      },
    },
  };

  // ========== Filtered Jobs ==========
  const locations = [...new Set(jobsData.map((j) => j.location).filter(Boolean))];
  const experiences = [...new Set(jobsData.map((j) => j.experience).filter(Boolean))];
  const filteredJobs = jobsData.filter((job) => {
    const q = filters.search.toLowerCase();
    return (
      (filters.department === 'All' || job.department === filters.department) &&
      (filters.location === 'All' || job.location === filters.location) &&
      (filters.experience === 'All' || job.experience === filters.experience) &&
      (!q ||
        job.title?.toLowerCase().includes(q) ||
        job.department?.toLowerCase().includes(q) ||
        stripHtml(job.description || '').toLowerCase().includes(q))
    );
  });
  return (
    <>
      <SEO
        title="Careers at Renny Strips | Steel Manufacturing Jobs"
        description="Explore career opportunities at Renny Strips in steel manufacturing, engineering, production, and industrial innovation."
        keywords="Renny Strips careers, steel jobs, engineering jobs, manufacturing careers"
        url="https://rennystrips.com/careers"
      />

      {/* ========== AUTOMATIC POPUP MODAL ========== */}
      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            {/* Click backdrop to close */}
            <div
              className="absolute inset-0"
              onClick={() => setShowPopup(false)}
            />

            {/* Popup Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative z-10 max-w-lg w-full flex items-center justify-center"
            >
              {/* Close (X) Icon Button */}
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-[#292c44] hover:bg-gray-100 rounded-full transition"
                aria-label="Close modal"
              >
                <MdClose className="text-2xl" />
              </button>

              {/* Popup Image Only */}
              <img
                src={popup}
                alt="Popup Announcement"
                width={1536}
                height={1024}
                loading="lazy"
                className="w-full h-auto max-h-[80vh] object-contain rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <section className="w-full font-helvetica bg-[#f8f9fa] font-helvetica">
        {/* HERO */}
        <section className="relative h-[100vh] md:h-[100vh] overflow-hidden">
          {heroSrc &&
          (heroSrc.endsWith('.webm') || heroSrc.endsWith('.mp4')) ? (
            <video
              key={heroSrc}
              src={heroSrc}
              autoPlay
              loop
              alt="Career Banner"
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <img
              key={heroSrc || 'fallback'}
              src={heroSrc || banner}
              alt="Career Banner"
              width={1920}
              height={1080}
              loading="eager"
              fetchPriority="high"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <motion.h1
            variants={fadeUp}
            className="relative z-10 text-white text-4xl md:text-7xl font-bold
          flex items-end justify-start h-full py-10 px-6 md:px-10"
          >
            {heroHeading}
          </motion.h1>
        </section>

        {/* ========== WHERE TALENT MEETS OPPORTUNITY SECTION ========== */}
        <section id="culture" className="bg-white py-16 md:py-24 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            {/* Centered Heading */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeUp}
              className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold text-[#292c44] tracking-tight">
                Where Talent Meets Opportunity
              </h2>
            </motion.div>

            {/* Split Grid: Left Text, Right Carousel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left Side: Text */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-5 text-gray-600 text-base md:text-lg leading-relaxed text-left"
              >
                <p>
                  At Renny, our people first culture is the foundation of
                  everything we do. We work like a family built on trust,
                  respect, collaboration, and the belief that every voice
                  deserves to be heard.
                </p>
                <p>
                  As a Great Place To Work® Certified organization with 93%
                  employee participation, our workplace reflects the confidence
                  and commitment of our people.
                </p>
                <p>According to LinkedIn’s Cities on the Rise 2026 report, Ludhiana ranks #2 among India’s cities on the rise, reflecting its growing opportunities, dynamic economy, and strong career potential.
Proudly rooted in Ludhiana, Renny Strips Ltd. is growing alongside the city.
Here, growth is more than a business goal,it’s an opportunity for our people to grow with us.
Ludhiana is rising. 
Renny Strips Ltd. is growing. Your career can rise with us.</p>
                <p>
                  Here, you're empowered to learn, grow, lead, and make a
                  meaningful impact.
                </p>
                <p className="font-bold text-[#292c44] text-lg pt-2">
                  Join Renny, where people come first, careers flourish, and the
                  future is built together.
                </p>
              </motion.div>

              {/* Right Side: Image Auto Scroller with 3 Dots */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center justify-center w-full"
              >
                {/* Full Coverage Image Slide Container */}
                <div className="relative w-full max-w-lg aspect-[16/10] bg-gray-50 rounded-3xl border border-gray-100 shadow-md overflow-hidden p-0">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentSlide}
                      src={badgeImages[currentSlide].src}
                      width={1358}
                      height={1920}
                      alt={badgeImages[currentSlide].alt}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      transition={{ duration: 0.4 }}
                      className="w-full h-full object-cover block"
                    />
                  </AnimatePresence>
                </div>

                {/* Interactive 3 Dots Navigation */}
                <div className="flex items-center gap-3 mt-6">
                  {badgeImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-3 rounded-full transition-all duration-300 ${
                        currentSlide === index
                          ? 'w-8 bg-[#292c44]'
                          : 'w-3 bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CONTENT */}
        {/* ========== CURRENT JOB OPENINGS ========== */}
<div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
  {/* LEFT: openings */}
  <section>
    <h2 className="text-3xl md:text-4xl font-extrabold text-[#292c44]">
      Current <span className="text-#292c44">Job Openings</span>
    </h2>
    <p className="mt-1 text-gray-600">
      Find your perfect role and be a part of our growing team.
    </p>

    {/* Search bar */}
    <form
      onSubmit={handleSearch}
      className="mt-6 grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto_auto] gap-3"
    >
      <div className="relative">
        <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-[#292c44]" />
        <input
          type="text"
          value={draft.search}
          onChange={(e) => setDraft({ ...draft, search: e.target.value })}
          placeholder="Search by job title or keyword..."
          className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-[#292c44]"
        />
      </div>
      <FilterSelect
        ariaLabel="Department"
        allLabel="All Departments"
        value={draft.department}
        options={departments}
        onChange={(e) => setDraft({ ...draft, department: e.target.value })}
      />
      <FilterSelect
        ariaLabel="Location"
        allLabel="All Locations"
        value={draft.location}
        options={locations}
        onChange={(e) => setDraft({ ...draft, location: e.target.value })}
      />
      <FilterSelect
        ariaLabel="Experience level"
        allLabel="All Experience Levels"
        value={draft.experience}
        options={experiences}
        onChange={(e) => setDraft({ ...draft, experience: e.target.value })}
      />
      <button
        type="submit"
        className="h-12 px-6 rounded-xl bg-[#292c44] text-white text-sm font-bold hover:opacity-90 transition"
      >
        Search Jobs
      </button>
    </form>

    {/* Job list */}
    <div className="mt-6">
      {errorMessage && (
        <div className="mb-6 rounded-2xl bg-white px-5 py-4 text-sm font-medium text-[#292c44] shadow-sm">
          {errorMessage}
        </div>
      )}

      {loading ? (
        <div className="py-24 text-center text-gray-300 font-bold">
          Loading opportunities…
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="py-24 text-center text-gray-400 font-bold">
          No positions found
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredJobs.map((job) => {
            const DeptIcon = deptIcons[job.department] || MdOutlineBusinessCenter;
            const vacancies = Number(job.vacancies);
            return (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-5">
                  {/* Icon */}
                  <div className="shrink-0 w-16 h-16 rounded-full bg-blue-100 text-[#292c44] flex items-center justify-center">
                    <DeptIcon className="text-3xl" />
                  </div>

                  {/* Title and department tag */}
                  <div className="md:w-[260px]">
                    <h3 className="text-lg font-bold text-[#292c44] leading-snug">
                      {job.title}
                    </h3>
                    {job.department && (
                      <span className="inline-block mt-2 px-2.5 py-0.5 rounded-md bg-blue-50 text-xs font-medium text-[#292c44]">
                        {job.department}
                      </span>
                    )}
                  </div>

                  {/* Meta columns */}
                  <div className="flex flex-wrap md:flex-nowrap items-stretch gap-y-3 md:flex-1">
                    {job.location && (
                      <div className="flex items-center gap-2 pr-5 md:px-5 md:border-l border-gray-300 text-sm font-semibold text-[#292c44]">
                        <MdLocationOn className="text-xl shrink-0" />
                        <span>{job.location}</span>
                      </div>
                    )}
                    {job.experience && (
                      <div className="flex items-center gap-2 pr-5 md:px-5 md:border-l border-gray-300 text-sm font-semibold text-[#292c44]">
                        <MdOutlineBusinessCenter className="text-xl shrink-0" />
                        <span>{job.experience}</span>
                      </div>
                    )}
                    {vacancies > 0 && (
                      <div className="flex items-center gap-2 pr-5 md:px-5 md:border-l border-gray-300 text-sm font-semibold text-[#292c44]">
                        <MdPeopleOutline className="text-xl shrink-0" />
                        <span>
                          {vacancies} {vacancies === 1 ? 'Vacancy' : 'Vacancies'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Apply */}
                  <div className="md:pl-5 md:border-l border-gray-300">
                    <button
                      onClick={() => navigate(`/careers/${job._id}`)}
                      className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#292c44] text-white text-sm font-bold hover:bg-[#292c44] transition"
                    >
                      Apply Now <MdArrowForward />
                    </button>
                  </div>
                </div>

                {/* Description and details link */}
                {job.description && (
  <p className="mt-4 text-sm text-gray-700 line-clamp-2">
    {stripHtml(job.description)}
  </p>
)}
                <button
                  onClick={() => navigate(`/careers/${job._id}`)}
                  className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-[#292c44] hover:underline"
                >
                  View Details <MdArrowForward />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  </section>

  {/* RIGHT: Why Join */}
  <motion.aside
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="h-fit lg:sticky lg:top-24 rounded-3xl bg-gradient-to-b from-blue-50 to-blue-100/60 border border-blue-100 p-6"
  >
    <h3 className="text-xl font-extrabold text-[#292c44]">Why Join Renny Strips?</h3>
    <div className="mt-2 mb-6 h-0.5 w-16 bg-red-600" />

    <ul className="flex flex-col gap-5">
      {whyJoin.map(({ icon: Icon, title, text }) => (
        <li key={title} className="flex items-start gap-4">
          <div className="shrink-0 w-12 h-12 rounded-full bg-blue-100 text-[#292c44] flex items-center justify-center">
            <Icon className="text-2xl" />
          </div>
          <div>
            <p className="font-bold text-[#292c44] text-sm">{title}</p>
            <p className="text-xs text-gray-600">{text}</p>
          </div>
        </li>
      ))}
    </ul>

    <button
      onClick={scrollToCulture}
      className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#292c44] hover:underline"
    >
      Learn More <MdArrowForward />
    </button>
  </motion.aside>
</div>

        {/* Success Stories */}
        {/* <section className="bg-[#eff6ff] py-10">
          <div className=" mx-auto px-6"> */}
        {/* Heading */}
        {/* <motion.h2
              className="text-[32px] md:text-[48px] font-bold mb-5 w-full text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Success Stories
              <div className="w-32 md:w-76 h-0.5 bg-blue mx-auto rounded-full mb-10" />
            </motion.h2>
            <h2 className="text-2xl text-center font-bold text-[#292c44] mb-3">
              Where careers are built to last
            </h2>

            <span className="block max-w-3xl mx-auto text-center text-sm md:text-base text-black leading-relaxed md:leading-7">
              At RENNY Strips, we invest in our people with the same commitment
              we bring to our products. Through hands-on experience,
              collaboration, and real-world challenges, we create an environment
              where talent grows, innovation thrives, and long-term careers are
              built on trust and expertise. Our teams work on meaningful
              projects that shape industries while continuously developing their
              skills, confidence, and professional capabilities.
            </span> */}

        {/* Carousel here */}
        {/* <CareerCarousel />
          </div>
        </section> */}
      </section>
    </>
  );
};

export default Career;
