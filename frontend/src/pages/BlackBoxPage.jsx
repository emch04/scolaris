import React from "react";
import ScolarisIA from "../components/BlackBoxConsole";
import Navbar from "../components/Navbar";

const ScolarisIAPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <ScolarisIA />
      </main>
    </div>
  );
};

export default ScolarisIAPage;
