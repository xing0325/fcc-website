"use client";

import DitheredImage from "@/components/DitheredImage";
import SlideButton from "@/components/SlideButton";
import { TopRightArrowIcon } from "@/components/icons";
import { useAnim } from "@/lib/anim";

const projects = [
  {
    index: "01",
    category: "Consulting",
    title: "Accenture · 分析师",
    href: "/projects",
    image: "/images/fcc-9.jpg",
  },
  {
    index: "02",
    category: "Consulting",
    title: "Bain · 2025 Spring PTA",
    href: "/projects",
    image: "/images/fcc-4.jpg",
  },
  {
    index: "03",
    category: "Audit",
    title: "PwC · 暑期实习",
    href: "/projects",
    image: "/images/fcc-10.jpg",
  },
];

function ProjectTitle({ title, index }: { title: string; index: number }) {
  const ref = useAnim<HTMLHeadingElement>("lineUp", { delay: index * 0.3 });
  return (
    <h3
      ref={ref}
      className="text-blue font-normal font-pp-neue fs-36 leading-none tracking-[0]"
    >
      {title}
    </h3>
  );
}

export default function Projects() {
  const titleRef = useAnim<HTMLHeadingElement>("title");
  const linesRef = useAnim<HTMLDivElement>("line", {
    target: ".js-project-line",
    stagger: 0.3,
  });
  const buttonRef = useAnim<HTMLDivElement>("fadeUp");

  return (
    <section className="px-15 pb-15">
      <div className="border-t-1px b-blue pt-50 lg:pt-100"></div>
      <div className="my-grid">
        <div className="my-title text-center col-span-full lg:col-start-3 lg:col-end-[-3]">
          <h2 ref={titleRef}>
            Most Recent
            <br />
            Offers
          </h2>
        </div>
      </div>
      <div className="my-grid relative mt-130 gap-y-60 lg:pb-40">
        <div ref={linesRef} className="hidden absolute top-0 left-0 w-full h-full my-grid lg:grid">
          {projects.map((project) => (
            <div
              key={project.index}
              className="js-project-line absolute top-0 left-0 b-blue pointer-events-none w-[1px] border-l-1px h-full translate-x-[0.5px] col-span-4 static!"
            ></div>
          ))}
        </div>
        {projects.map((project, i) => (
          <div
            key={project.href}
            className="col-span-full lg:col-span-4 lg:pl-15 lg:pr-65 lg:pb-[20vh]"
            data-project-index={i}
          >
            <div className="flex justify-between text-blue font-normal font-gta-mono fs-12 leading-none tracking-[0] uppercase lg:pr-12">
              <div>
                <span>{project.index}</span>
              </div>
              <div aria-hidden="true">{project.category}</div>
            </div>
            <div className="mt-44 relative z-1">
              <div className="bg-mercury absolute w-[2vw] h-full top-0 right-full -z-1"></div>
              <ProjectTitle title={project.title} index={i} />
              <div className="relative group">
                <div className="overflow-hidden relative w-full mt-24 aspect-[385/260]">
                  <DitheredImage src={project.image} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <div
                    className="bg-white border-[0.5px] b-blue absolute bottom-0 right-0 flex-center scale-0 origin-bottom-right will-change-transform transition-transform duration-500 group-hover:scale-100"
                    style={{ width: "3.75rem", height: "3.75rem" }}
                  >
                    <TopRightArrowIcon
                      className="icon size-[53%] text-blue scale-0 origin-center transition-transform duration-500 delay-100 group-hover:scale-100"
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <a
                  href={project.href}
                  className="absolute inset-0"
                  aria-label={`查看学员案例: ${project.title}`}
                ></a>
              </div>
            </div>
          </div>
        ))}
        <div
          ref={buttonRef}
          className="relative z-1 col-span-full mt-100 lg:col-start-5 lg:col-end-[span_3] lg:justify-self-start"
        >
          <div className="hidden lg:block bg-mercury absolute right-0 w-[105%] h-full -z-1"></div>
          <SlideButton
            label="View All Cases"
            href="/projects"
            className="w-full lg:w-248 lg:ml-15"
          />
        </div>
      </div>
    </section>
  );
}
