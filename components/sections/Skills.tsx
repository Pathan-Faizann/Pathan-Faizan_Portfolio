"use client";
import React from "react";
import { ContainerScroll } from "../ui/container-scroll-animation";

export function Skills() {
  return (
    <section className="w-full lg:pl-[16%]! 2xl:pl-[16.5%]! flex justify-center">
      <div className="w-full max-w-[1600px]">
        <ContainerScroll
          titleComponent={
            <>
              {/* <h1 className="text-4xl font-semibold text-white">
                Capabilities
              </h1> */}
            </>
          }
        >
          <img
            src="/skills.png"
            alt="skills"
            className="w-full h-full object-cover rounded-2xl"
          />
        </ContainerScroll>
      </div>
    </section>
  );
}
