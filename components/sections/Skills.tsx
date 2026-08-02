"use client";
import React from "react";
import { ContainerScroll } from "../ui/container-scroll-animation";

export function Skills() {
  return (
    <section className="w-full bg-[#050505] overflow-x-hidden">
      <ContainerScroll
        titleComponent={
          <></>
        }
      >
        <img
          src="/skills.png"
          alt="skills"
          className="w-full h-full object-cover rounded-2xl"
        />
      </ContainerScroll>
    </section>
  );
}
