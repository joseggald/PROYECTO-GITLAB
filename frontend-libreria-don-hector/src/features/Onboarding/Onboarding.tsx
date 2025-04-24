import { useState, useEffect } from 'react';
import DefaultLayout from "@/layout/DefaultLayout/DefaultLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, ChevronRight, ChevronLeft, Heart, Library, BookUser } from "lucide-react";
import { useNavigate } from '@tanstack/react-router';
const slides = [
  {
    background: "/background.png",
    title: "Librería Don Héctor",
    subtitle: "Conectando a los lectores",
    description: "Encuentra los mejores libros y disfruta de la lectura",
    icon: Library
  },
  {
    background: "/background1.png",
    title: "Atención Personalizada",
    subtitle: "Encuentra lo que necesitas",
    description: "Personal ayudando a encontrar lo que buscas",
    icon: Clock
  },
  {
    background: "/background3.png",
    title: "La librería de tus sueños",
    subtitle: "Un lugar para soñar",
    description: "Un lugar seguro para disfrutar de la lectura",
    icon: BookUser
  },
  {
    background: "/background4.png",
    title: "Conecta con tus emociones",
    subtitle: "Cuida de tu salud mental",
    description: "Encuentra libros que te ayuden a cuidar de ti",
    icon: Heart
  }
];

export const Onboarding = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const navigate = useNavigate();
  const nextSlide = () => {
    setFadeIn(false);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setFadeIn(true);
    }, 500);
  };

  const prevSlide = () => {
    setFadeIn(false);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      setFadeIn(true);
    }, 500);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, []);

  const CurrentIcon = slides[currentSlide].icon;

  return (
    <DefaultLayout
      title="Clínica Fénix"
      description="Centro médico de excelencia"
    >
      <div className="relative h-screen w-full overflow-hidden bg-gray-900">
        <div
          className="absolute inset-0 transition-all duration-1000 ease-out"
          style={{
            backgroundImage: `url(${slides[currentSlide].background})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: fadeIn ? 1 : 0,
            transform: fadeIn ? 'scale(1)' : 'scale(1.1)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/60 via-gray-900/60 to-gray-900/80" />
        </div>

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
          <div className={`transition-all duration-700 ${fadeIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="mb-8 flex justify-center">
              <div className="rounded-full bg-amber-900/20 p-6 backdrop-blur-sm">
                <CurrentIcon className="h-12 w-12 text-yellow-600" />
              </div>
            </div>

            <div className="text-center">
              <h2 className="mb-2 text-lg font-medium uppercase tracking-wider text-yellow-600">
                {slides[currentSlide].subtitle}
              </h2>
              <h1 className="mb-6 font-serif text-5xl font-bold text-white">
                {slides[currentSlide].title}
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-gray-300">
                {slides[currentSlide].description}
              </p>
            </div>

            <div className="mt-12 flex justify-center">
              <Button 
                className="group relative bg-yellow-700 px-8 py-3 m-2 text-lg font-medium text-white hover:bg-yellow-900"
                onClick={() => navigate({ to: '/login' })}
              >
                Iniciar Sesión
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                className="group relative bg-yellow-700 px-8 py-3 m-2 text-lg font-medium text-white hover:bg-yellow-900"
                onClick={() => navigate({ to: '/productos' })}
              >
                Ver Libros
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>

            <div className="mt-12 flex justify-center space-x-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setFadeIn(false);
                    setTimeout(() => {
                      setCurrentSlide(index);
                      setFadeIn(true);
                    }, 700);
                  }}
                  className={`h-2 w-12 rounded-full transition-all ${
                    currentSlide === index 
                      ? 'bg-yellow-700' 
                      : 'bg-amber-100 hover:bg-yellow-700'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
              onClick={nextSlide}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Onboarding;