import Image from "next/image";
import Banner from "@/components/Banner";
import About from "@/components/About";
import NomCalculator from "@/components/NomCalculator";
import Tokenomics from "@/components/Tokenomics";
import Roadmap from "@/components/Roadmap";
import Dashboard from "@/components/Dashboard";
import Game from "@/components/Game";
export default function Home() {
  return (
    <div>
      <Banner />
      <About />
      {/* <NomCalculator /> */}
      <Tokenomics />
      <Roadmap />
      <Game />
      <Dashboard />
    </div>
  );
}
