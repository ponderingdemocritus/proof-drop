import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Proofs } from "./Proofs";
import { Account } from "./Account";
import { Home } from "./Home";
import { ProofDrop } from "./ProofDrop";

export const MainContent = () => {
  return (
    <div className=" p-8 ">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/proofs" element={<Proofs />} />
        <Route path="/account" element={<Account />} />
        <Route path="/drops/:id" element={<ProofDrop />} />
      </Routes>
    </div>
  );
};
