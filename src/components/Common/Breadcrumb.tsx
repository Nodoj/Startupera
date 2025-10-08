import Link from "next/link";

const Breadcrumb = ({
  pageName,
  description,
}: {
  pageName: string;
  description: string;
}) => {
  return (
    <>
      <section className="relative z-10 overflow-hidden pt-20 pb-4 sm:pt-24 sm:pb-6 lg:pt-32 lg:pb-8">
        <div className="container">
          {/* Breadcrumb Navigation */}
          <div className={description ? "mb-8 sm:mb-10" : "mb-0"}>
            <div className="inline-flex rounded-lg bg-white/80 backdrop-blur-sm px-4 py-2 sm:px-6 sm:py-3 shadow-lg dark:bg-gray-dark/80 border border-stroke/10 dark:border-stroke-dark/10">
              <ul className="flex items-center gap-2">
                <li className="flex items-center">
                  <Link
                    href="/"
                    className="text-sm sm:text-base font-medium text-body-color hover:text-primary dark:text-body-color-dark dark:hover:text-primary transition-colors duration-300"
                  >
                    Home
                  </Link>
                  <span className="mx-2 sm:mx-3 block h-2 w-2 rotate-45 border-r-2 border-t-2 border-body-color dark:border-body-color-dark"></span>
                </li>
                <li className="text-sm sm:text-base font-medium text-primary dark:text-primary truncate max-w-[150px] sm:max-w-none">
                  {pageName}
                </li>
              </ul>
            </div>
          </div>

          {/* Page Title and Description */}
          {description && (
            <div className="max-w-3xl">
              <h1 className="mb-4 text-2xl font-bold text-black dark:text-white sm:text-3xl lg:text-4xl">
                {pageName}
              </h1>
              <p className="text-base text-body-color dark:text-body-color-dark sm:text-lg">
                {description}
              </p>
            </div>
          )}
        </div>

        <div>
          <span className="absolute left-0 top-0 z-[-1]">
            <svg
              width="287"
              height="254"
              viewBox="0 0 287 254"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.1"
                d="M286.5 0.5L-14.5 254.5V69.5L286.5 0.5Z"
                fill="url(#paint0_linear_111:578)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_111:578"
                  x1="-40.5"
                  y1="117"
                  x2="301.926"
                  y2="-97.1485"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4A6CF7" />
                  <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <span className="absolute right-0 top-0 z-[-1]">
            <svg
              width="628"
              height="258"
              viewBox="0 0 628 258"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.1"
                d="M669.125 257.002L345.875 31.9983L524.571 -15.8832L669.125 257.002Z"
                fill="url(#paint0_linear_0:1)"
              />
              <path
                opacity="0.1"
                d="M0.0716344 182.78L101.988 -15.0769L142.154 81.4093L0.0716344 182.78Z"
                fill="url(#paint1_linear_0:1)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_0:1"
                  x1="644"
                  y1="221"
                  x2="429.946"
                  y2="37.0429"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4A6CF7" />
                  <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_0:1"
                  x1="18.3648"
                  y1="166.016"
                  x2="105.377"
                  y2="32.3398"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4A6CF7" />
                  <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </div>
      </section>
    </>
  );
};

export default Breadcrumb;
