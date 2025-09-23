import SectionTitle from "../Common/SectionTitle";
import AnimatedCubes from "../AnimatedCubes";
import Brands from "../Brands";
import Button from "../Common/Button";
import { 
  Globe, 
  Lightbulb, 
  Handshake, 
  Target, 
  Monitor, 
  Server, 
  Cloud, 
  Shield,
  Building2,
  Wrench,
  BookOpen
} from "lucide-react";

const ComprehensiveAbout = () => {
  const checkIcon = (
    <svg width="16" height="13" viewBox="0 0 16 13" className="fill-current">
      <path d="M5.8535 12.6631C5.65824 12.8584 5.34166 12.8584 5.1464 12.6631L0.678505 8.1952C0.483242 7.99994 0.483242 7.68336 0.678505 7.4881L2.32921 5.83739C2.52467 5.64193 2.84166 5.64216 3.03684 5.83791L5.14622 7.95354C5.34147 8.14936 5.65859 8.14952 5.85403 7.95388L13.3797 0.420561C13.575 0.22513 13.8917 0.225051 14.087 0.420383L15.7381 2.07143C15.9333 2.26669 15.9333 2.58327 15.7381 2.77854L5.8535 12.6631Z" />
    </svg>
  );

  const List = ({ text }) => (
    <p className="text-body-color mb-5 flex items-center text-lg font-medium">
      <span className="bg-primary/10 text-primary mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-md">
        {checkIcon}
      </span>
      {text}
    </p>
  );

  const teamMembers = [
    {
      name: "Core Team",
      role: "4 Expert Technicians",
      experience: "15+ Years Combined Experience",
      description: "Passionate professionals with deep expertise across multiple IT domains"
    }
  ];

  const capabilities = [
    {
      icon: Monitor,
      title: "Software Development",
      description: "Custom applications, AI solutions, and enterprise software built to your exact specifications."
    },
    {
      icon: Server,
      title: "Hardware & Infrastructure",
      description: "Complete office setups, datacenter design, and hardware optimization for maximum performance."
    },
    {
      icon: Cloud,
      title: "Cloud Solutions",
      description: "Scalable cloud applications, migrations, and hybrid infrastructure solutions."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Top-notch security implementations with compliance standards and audit trails."
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="pb-16 pt-16 md:pb-20 md:pt-20 lg:pb-28 lg:pt-28">
        <div className="container">
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-4 lg:w-1/2">
              <SectionTitle
                title="Meet Toraflow - Your AI Transformation Partner"
                paragraph="We are a passionate team of 4 core technicians with over 15 years of combined experience in IT. We're motivated, open-minded, and love what we do. There are no limitations to what we can build for you."
                mb="44px"
              />

              <div className="mb-12 max-w-[570px] lg:mb-0">
                <div className="mx-[-12px] flex flex-wrap">
                  <div className="w-full px-3 sm:w-1/2 lg:w-full xl:w-1/2">
                    <List text="15+ Years Experience" />
                    <List text="Global Solutions" />
                    <List text="No Limitations" />
                  </div>
                  <div className="w-full px-3 sm:w-1/2 lg:w-full xl:w-1/2">
                    <List text="Custom Development" />
                    <List text="Enterprise Grade" />
                    <List text="Passionate Team" />
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full px-4 lg:w-1/2">
              <div className="relative flex items-center justify-center min-h-[400px]">
                <div className="transform translate-y-[-100px]">
                  <AnimatedCubes />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-20 lg:py-28 bg-gray-light dark:bg-bg-color-dark">
        <div className="container">
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-4 lg:w-1/2">
              <div className="mb-12 lg:mb-0">
                <h2 className="mb-8 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight">
                  Our Story & Mission
                </h2>
                <p className="mb-6 text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
                  At Toraflow, we believe technology should serve people, not the other way around. Our journey began with a simple vision: to create meaningful solutions that truly make a difference.
                </p>
                <p className="mb-6 text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
                  We're not just another tech company. We're dreamers, builders, and problem-solvers who thrive on turning your vision into reality. Whether you're an individual with a unique idea or an enterprise needing robust solutions, we're here to make it happen.
                </p>
                <p className="text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
                  Our open-minded approach means we don't say "no" - we say "how can we make this work?" Every project is an opportunity to push boundaries and deliver something extraordinary.
                </p>
              </div>
            </div>
            <div className="w-full px-4 lg:w-1/2">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-black dark:text-white">Global Reach</h3>
                  <p className="text-body-color">Serving clients worldwide with custom solutions tailored to local needs.</p>
                </div>
                <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Lightbulb className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-black dark:text-white">Innovation First</h3>
                  <p className="text-body-color">Constantly learning new technologies to deliver cutting-edge solutions.</p>
                </div>
                <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Handshake className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-black dark:text-white">Partnership</h3>
                  <p className="text-body-color">We work with you, not for you. Your success is our success.</p>
                </div>
                <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-black dark:text-white">Results Driven</h3>
                  <p className="text-body-color">Focused on delivering measurable outcomes that drive real business value.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-16 md:py-20 lg:py-28">
        <div className="container">
          <SectionTitle
            title="Our Expertise Spans Every Domain"
            paragraph="From software to hardware, from startups to enterprises - our experience covers the full spectrum of technology solutions."
            center
            mb="80px"
          />
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((capability, index) => {
              const IconComponent = capability.icon;
              return (
                <div
                  key={index}
                  className="group rounded-lg bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-dark"
                >
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-4 text-xl font-bold text-black dark:text-white">
                    {capability.title}
                  </h3>
                  <p className="text-body-color leading-relaxed">
                    {capability.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-16 md:py-20 lg:py-28 bg-gray-light dark:bg-bg-color-dark">
        <div className="container">
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-4 lg:w-1/2">
              <h2 className="mb-8 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight">
                Proven Track Record
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="mr-4 mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-black dark:text-white">
                      Top Company Projects
                    </h3>
                    <p className="text-body-color">
                      Our team members have contributed to major projects at leading technology companies, bringing enterprise-level expertise to every engagement.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-4 mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Wrench className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-black dark:text-white">
                      Full-Stack Infrastructure
                    </h3>
                    <p className="text-body-color">
                      We've built complete offices, designed datacenters, and deployed cloud applications from the ground up.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-4 mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-black dark:text-white">
                      Continuous Learning
                    </h3>
                    <p className="text-body-color">
                      We constantly evolve our skills and stay ahead of technology trends to deliver the best solutions for our clients.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full px-4 lg:w-1/2">
              <div className="mt-12 lg:mt-0">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="mb-2 text-4xl font-bold text-primary">15+</div>
                    <p className="text-body-color">Years Experience</p>
                  </div>
                  <div className="text-center">
                    <div className="mb-2 text-4xl font-bold text-primary">100+</div>
                    <p className="text-body-color">Projects Delivered</p>
                  </div>
                  <div className="text-center">
                    <div className="mb-2 text-4xl font-bold text-primary">4</div>
                    <p className="text-body-color">Core Team Members</p>
                  </div>
                  <div className="text-center">
                    <div className="mb-2 text-4xl font-bold text-primary">24/7</div>
                    <p className="text-body-color">Support Available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies We Work With */}
      <Brands />

      {/* CTA Section */}
      <section className="py-16 md:py-20 lg:py-28">
        <div className="container">
          <div className="rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 px-8 py-16 text-center dark:from-primary/20 dark:to-primary/10">
            <h2 className="mb-6 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight">
              Ready to Make Your Dream Come True?
            </h2>
            <p className="mb-8 text-lg text-body-color">
              Whether you need a custom solution for your business or want to build something meaningful just for you, we're here to help. No limitations, no compromises - just results.
            </p>
            <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button
                href="/contact"
                variant="primary"
                size="lg"
              >
                Start Your Project
              </Button>
              <Button
                href="#"
                variant="outline"
                size="lg"
              >
                View Our Work
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ComprehensiveAbout;
