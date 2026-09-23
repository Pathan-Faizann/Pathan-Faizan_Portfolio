"use client";
import React from "react";
import { ContainerScroll } from "../ui/container-scroll-animation";

export function Skills() {
  return (
    <section id="skills" className="w-full! bg-[#050505]! overflow-x-hidden!">
      <ContainerScroll titleComponent={<></>}>
        {/* Desktop View */}
        <img
          src="/skills.png"
          alt="Skills"
          className="hidden md:block w-full h-full object-cover rounded-2xl"
        />
        {/* Mobile View */}
        <img
          src="/skills-mob.png"
          alt="Skills"
          className="block md:hidden w-full h-full object-cover rounded-2xl"
        />
      </ContainerScroll>
    </section>
  );
}
